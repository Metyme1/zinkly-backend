"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_codes_1 = require("http-status-codes");
const booking_service_1 = require("./booking.service");
const user_model_1 = require("../user/user.model");
const booking_model_1 = require("./booking.model");
const zoon_service_1 = require("../zoom/zoon.service");
const createBooking = (0, catchAsync_1.default)(async (req, res) => {
    const generateBookingId = () => {
        return `#${Date.now()}`; // example: #1759464694023
    };
    const user = req.user;
    const payload = { user: user?.id, ...req.body };
    console.log('[BOOKING] Creating booking with payload:', payload);
    // 1. Look for *any existing booking* for same artist/date/time with allowMultiple
    const existing = await booking_model_1.Booking.findOne({
        artist: payload.artist,
        booking_date: payload.booking_date,
        booking_time: payload.booking_time,
        allowMultiple: true,
    });
    let zoomJoinUrl;
    let zoomStartUrl;
    if (existing) {
        zoomJoinUrl = existing.zoomJoinUrl || '';
        zoomStartUrl = existing.zoomStartUrl || '';
    }
    else {
        console.log('[BOOKING] No existing booking → create Zoom meeting');
        const artist = await user_model_1.User.findById(payload.artist);
        const zoomMeeting = await zoon_service_1.ZoomService.createMeeting(artist?.name || 'Musician', 'Music Lesson', payload.booking_date, payload.booking_time);
        zoomJoinUrl = zoomMeeting.joinUrl;
        zoomStartUrl = zoomMeeting.startUrl;
    }
    // 2. Create a *new booking for this student*
    const newBooking = await booking_model_1.Booking.create({
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
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Booking created successfully',
        data: newBooking,
    });
});
const toggleMultiUser = (0, catchAsync_1.default)(async (req, res) => {
    const { bookingId, allowMultiple } = req.body;
    console.log(`🔄 Toggling multi-user for booking ${bookingId} → ${allowMultiple}`);
    const booking = await booking_model_1.Booking.findByIdAndUpdate(bookingId, { allowMultiple }, { new: true });
    if (!booking) {
        console.log('❌ Booking not found');
        return (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
            success: false,
            message: 'Booking not found',
            data: null,
        });
    }
    console.log('✅ Multi-user option updated:', booking);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Multi-user option updated successfully',
        data: booking,
    });
});
const toggleMultiUserForSlot = (0, catchAsync_1.default)(async (req, res) => {
    const { zoomJoinUrl, allowMultiple } = req.body;
    const artistId = req.user?.id; // 👈 this is throwing the error if req.user is undefined
    if (!artistId) {
        return (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.UNAUTHORIZED,
            success: false,
            message: 'Unauthorized - artist not found in request',
            data: null,
        });
    }
    console.log(`🔄 Toggling multi-user for all bookings with zoom=${zoomJoinUrl} (artist=${artistId}) → ${allowMultiple}`);
    // Update ALL bookings that share this zoom link
    const result = await booking_model_1.Booking.updateMany({
        artist: artistId,
        zoomJoinUrl, // 👈 group bookings by same Zoom session
    }, { allowMultiple });
    console.log(`✅ Updated ${result.modifiedCount} bookings with same Zoom link`);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Multi-user option updated for this Zoom session',
        data: { updated: result.modifiedCount },
    });
});
const myBookingFromDB = (0, catchAsync_1.default)(async (req, res) => {
    const queryStatus = typeof req.query.status === 'string' ? req.query.status : '';
    const userId = req.user.id;
    console.log(`[BOOKING] Fetching bookings for user ${userId} with status=${queryStatus}`);
    const result = await booking_service_1.BookingService.myBookingFromDB(userId, queryStatus);
    // Debugging: log how many bookings found and whether Zoom links exist
    console.log(`[BOOKING] Retrieved ${result.length} bookings`);
    result.forEach(b => {
        console.log(`   - ${b.bookingId}: join=${b.zoomJoinUrl ? '✅' : '❌'} start=${b.zoomStartUrl ? '✅' : '❌'}`);
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Booking Retrieved Successfully',
        data: result,
    });
});
// booking marked as complete
const completeBookingToDB = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    const result = await booking_service_1.BookingService.completeBookingToDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Booking Completed Successfully',
        data: result,
    });
});
// reschedule booking;
const rescheduleBookingToDB = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    const payloadData = req.body;
    const result = await booking_service_1.BookingService.rescheduleBookingToDB(id, payloadData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Booking Scheduled Successfully',
        data: result,
    });
});
// check booking availability
const checkAvailabilityBookingFromDB = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    const date = req.query.date;
    const result = await booking_service_1.BookingService.checkAvailabilityBookingFromDB(id, date);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Booking Availability retrieved Successfully',
        data: result,
    });
});
// check booking availability
const transactionsHistoryFromDB = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    const result = await booking_service_1.BookingService.transactionsHistoryFromDB(user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Transactions History retrieved Successfully',
        data: result,
    });
});
// booking.controller.ts
const respondBookingToDB = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    const status = req.query.status; // "Accept" or "Reject"
    const result = await booking_service_1.BookingService.respondBookingToDB(id, status);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: `Artist ${status}ed the Booking Successfully`,
        data: result,
    });
});
// respond booking
const bookingDetailsFromDB = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    const result = await booking_service_1.BookingService.bookingDetailsFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: `Booking Details Retrieved`,
        data: result,
    });
});
// booking summary
const bookingSummaryFromDB = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.user.id;
    const result = await booking_service_1.BookingService.bookingSummaryFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: `Booking Summary Retrieved`,
        data: result,
    });
});
// lesson booking summary
const lessonBookingSummary = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.user.id;
    const { status, date } = req.query;
    const result = await booking_service_1.BookingService.lessonBookingFromDB(id, status, date);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: `Lesson Booking Summary Retrieved`,
        data: result,
    });
});
// lesson booking summary
const sendLinkToUser = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    const bookingLink = req.body.bookingLink;
    await booking_service_1.BookingService.sendLinkToUser(id, bookingLink);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: `Session Link send Successfully`,
    });
});
exports.BookingController = {
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
