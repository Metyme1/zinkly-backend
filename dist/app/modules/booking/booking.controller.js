"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_codes_1 = require("http-status-codes");
const booking_service_1 = require("./booking.service");
const createBooking = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const payload = Object.assign({ user: user === null || user === void 0 ? void 0 : user.id }, req.body);
    const result = yield booking_service_1.BookingService.createBooking(payload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Booking Booked Successfully",
        data: result
    });
}));
const myBookingFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query.status;
    const user = req.user.id;
    const statusQuery = typeof query === 'string' ? query : '';
    const result = yield booking_service_1.BookingService.myBookingFromDB(user, statusQuery);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Booking Retrieved Successfully",
        data: result
    });
}));
// booking marked as complete
const completeBookingToDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield booking_service_1.BookingService.completeBookingToDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Booking Completed Successfully",
        data: result
    });
}));
// reschedule booking;
const rescheduleBookingToDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const payloadData = req.body;
    const result = yield booking_service_1.BookingService.rescheduleBookingToDB(id, payloadData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Booking Scheduled Successfully",
        data: result
    });
}));
// check booking availability
const checkAvailabilityBookingFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const date = req.query.date;
    const result = yield booking_service_1.BookingService.checkAvailabilityBookingFromDB(id, date);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Booking Availability retrieved Successfully",
        data: result
    });
}));
// check booking availability
const transactionsHistoryFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield booking_service_1.BookingService.transactionsHistoryFromDB(user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Transactions History retrieved Successfully",
        data: result
    });
}));
// respond booking
const respondBookingToDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const status = req.query.status;
    const result = yield booking_service_1.BookingService.respondBookingToDB(id, status);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: `Artist ${status} the Booking Successfully`,
        data: result
    });
}));
// respond booking
const bookingDetailsFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield booking_service_1.BookingService.bookingDetailsFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: `Booking Details Retrieved`,
        data: result
    });
}));
// booking summary
const bookingSummaryFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.user.id;
    const result = yield booking_service_1.BookingService.bookingSummaryFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: `Booking Summary Retrieved`,
        data: result
    });
}));
// lesson booking summary
const lessonBookingSummary = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.user.id;
    const { status, date } = req.query;
    const result = yield booking_service_1.BookingService.lessonBookingFromDB(id, status, date);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: `Lesson Booking Summary Retrieved`,
        data: result
    });
}));
// lesson booking summary
const sendLinkToUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const bookingLink = req.body.bookingLink;
    yield booking_service_1.BookingService.sendLinkToUser(id, bookingLink);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: `Session Link send Successfully`
    });
}));
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
    sendLinkToUser
};
