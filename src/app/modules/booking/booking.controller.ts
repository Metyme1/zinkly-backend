import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { BookingService } from './booking.service';
import { User } from '../user/user.model';
import { Booking } from './booking.model';
import { ZoomService } from '../zoom/zoon.service';

const createBooking = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const payload = { user: user?.id, ...req.body };

  console.log('[BOOKING] Creating booking with payload:', payload);

  // 1. Create booking in DB
  let result = await BookingService.createBooking(payload);
  console.log('[BOOKING] Initial booking saved:', result.bookingId);

  // 2. Create Zoom meeting
  const artist = await User.findById(result.artist);
  const zoomMeeting = await ZoomService.createMeeting(
    artist?.name || 'Musician',
    'Music Lesson',
    result.booking_date,
    result.booking_time
  );

  // 3. Update booking with Zoom links
  result.zoomJoinUrl = zoomMeeting.joinUrl;
  result.zoomStartUrl = zoomMeeting.startUrl;
  await (result as any).save();

  console.log('[BOOKING] Zoom links attached:', {
    join: result.zoomJoinUrl,
    start: result.zoomStartUrl,
  });

  // 4. Response
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Booking Booked Successfully (with Zoom link)',
    data: result,
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
const respondBookingToDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  // Support both ?status=Accepted and body {status: "Rejected"}
  const status =
    (req.body.status as string) || (req.query.status as string) || '';

  if (!status) {
    return sendResponse(res, {
      statusCode: StatusCodes.BAD_REQUEST,
      success: false,
      message: 'Status is required',
      data: null,
    });
  }

  const result = await BookingService.respondBookingToDB(id, status);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: `Artist ${status} the Booking Successfully`,
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
};
