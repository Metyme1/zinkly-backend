import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { BookingService } from './booking.service';
import { User } from '../user/user.model';
import { Booking } from './booking.model';
import { ZoomService } from '../zoom/zoon.service';

const createBooking = catchAsync(async (req: Request, res: Response) => {
  const generateBookingId = () => {
    return `#${Date.now()}`; // example: #1759464694023
  };

  const user = req.user;
  const payload = { user: user?.id, ...req.body };

  console.log('[BOOKING] Creating booking with payload:', payload);

  // 1. Look for *any existing booking* for same artist/date/time with allowMultiple
  const existing = await Booking.findOne({
    artist: payload.artist,
    booking_date: payload.booking_date,
    booking_time: payload.booking_time,
    allowMultiple: true,
  });

  let zoomJoinUrl: string;
  let zoomStartUrl: string;

  if (existing) {
    zoomJoinUrl = existing.zoomJoinUrl || '';
    zoomStartUrl = existing.zoomStartUrl || '';
  } else {
    console.log('[BOOKING] No existing booking → create Zoom meeting');

    const artist = await User.findById(payload.artist);
    const zoomMeeting = await ZoomService.createMeeting(
      artist?.name || 'Musician',
      'Music Lesson',
      payload.booking_date,
      payload.booking_time
    );

    zoomJoinUrl = zoomMeeting.joinUrl;
    zoomStartUrl = zoomMeeting.startUrl;
  }

  // 2. Create a *new booking for this student*
  const newBooking = await Booking.create({
    artist: payload.artist,
    users: [payload.user],
    price: payload.price,
    bookingId: generateBookingId(), // ✅ auto-generate instead of relying on frontend
    transactionId: payload.transactionId,
    booking_date: payload.booking_date,
    booking_time: payload.booking_time,
    allowMultiple: payload.allowMultiple || false,
    zoomJoinUrl,
    zoomStartUrl,
  });

  console.log('[BOOKING] Created new booking with Zoom reuse:', newBooking._id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Booking created successfully',
    data: newBooking,
  });
});

const toggleMultiUser = catchAsync(async (req: Request, res: Response) => {
  const { bookingId, allowMultiple } = req.body;

  console.log(
    `🔄 Toggling multi-user for booking ${bookingId} → ${allowMultiple}`
  );

  const booking = await Booking.findByIdAndUpdate(
    bookingId,
    { allowMultiple },
    { new: true }
  );

  if (!booking) {
    console.log('❌ Booking not found');
    return sendResponse(res, {
      statusCode: StatusCodes.NOT_FOUND,
      success: false,
      message: 'Booking not found',
      data: null,
    });
  }

  console.log('✅ Multi-user option updated:', booking);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Multi-user option updated successfully',
    data: booking,
  });
});
const toggleMultiUserForSlot = catchAsync(
  async (req: Request, res: Response) => {
    const { zoomJoinUrl, allowMultiple } = req.body;
    const artistId = req.user?.id; // 👈 this is throwing the error if req.user is undefined

    if (!artistId) {
      return sendResponse(res, {
        statusCode: StatusCodes.UNAUTHORIZED,
        success: false,
        message: 'Unauthorized - artist not found in request',
        data: null,
      });
    }

    console.log(
      `🔄 Toggling multi-user for all bookings with zoom=${zoomJoinUrl} (artist=${artistId}) → ${allowMultiple}`
    );

    // Update ALL bookings that share this zoom link
    const result = await Booking.updateMany(
      {
        artist: artistId,
        zoomJoinUrl, // 👈 group bookings by same Zoom session
      },
      { allowMultiple }
    );

    console.log(
      `✅ Updated ${result.modifiedCount} bookings with same Zoom link`
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Multi-user option updated for this Zoom session',
      data: { updated: result.modifiedCount },
    });
  }
);

const myBookingFromDB = catchAsync(async (req: Request, res: Response) => {
  const queryStatus =
    typeof req.query.status === 'string' ? req.query.status : '';
  const userId = req.user.id;

  console.log(
    `[BOOKING] Fetching bookings for user ${userId} with status=${queryStatus}`
  );

  const result = await BookingService.myBookingFromDB(userId, queryStatus);

  // Debugging: log how many bookings found and whether Zoom links exist
  console.log(`[BOOKING] Retrieved ${result.length} bookings`);
  result.forEach(b => {
    console.log(
      `   - ${b.bookingId}: join=${b.zoomJoinUrl ? '✅' : '❌'} start=${
        b.zoomStartUrl ? '✅' : '❌'
      }`
    );
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Booking Retrieved Successfully',
    data: result,
  });
});

// booking marked as complete
const completeBookingToDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await BookingService.completeBookingToDB(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Booking Completed Successfully',
    data: result,
  });
});

// reschedule booking;
const rescheduleBookingToDB = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const payloadData = req.body;
    const result = await BookingService.rescheduleBookingToDB(id, payloadData);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Booking Scheduled Successfully',
      data: result,
    });
  }
);

// check booking availability
const checkAvailabilityBookingFromDB = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const date = req.query.date as string;
    const result = await BookingService.checkAvailabilityBookingFromDB(
      id,
      date
    );
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Booking Availability retrieved Successfully',
      data: result,
    });
  }
);

// check booking availability
const transactionsHistoryFromDB = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.user;
    const result = await BookingService.transactionsHistoryFromDB(user);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Transactions History retrieved Successfully',
      data: result,
    });
  }
);

// booking.controller.ts
const respondBookingToDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const status = req.query.status as string; // "Accept" or "Reject"
  const result = await BookingService.respondBookingToDB(id, status);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: `Artist ${status}ed the Booking Successfully`,
    data: result,
  });
});

// respond booking
const bookingDetailsFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await BookingService.bookingDetailsFromDB(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: `Booking Details Retrieved`,
    data: result,
  });
});

// booking summary
const bookingSummaryFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.user.id;
  const result = await BookingService.bookingSummaryFromDB(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: `Booking Summary Retrieved`,
    data: result,
  });
});

// lesson booking summary
const lessonBookingSummary = catchAsync(async (req: Request, res: Response) => {
  const id = req.user.id;
  const { status, date } = req.query;
  const result = await BookingService.lessonBookingFromDB(
    id,
    status as string,
    date as string
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: `Lesson Booking Summary Retrieved`,
    data: result,
  });
});

// lesson booking summary
const sendLinkToUser = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const bookingLink = req.body.bookingLink;
  await BookingService.sendLinkToUser(id, bookingLink);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: `Session Link send Successfully`,
  });
});

export const BookingController = {
  createBooking,
  myBookingFromDB,
  completeBookingToDB,
  rescheduleBookingToDB,
  checkAvailabilityBookingFromDB,
  transactionsHistoryFromDB,
  respondBookingToDB,
  bookingDetailsFromDB,
  bookingSummaryFromDB,
  lessonBookingSummary,
  sendLinkToUser,
  toggleMultiUser,
  toggleMultiUserForSlot,
};
