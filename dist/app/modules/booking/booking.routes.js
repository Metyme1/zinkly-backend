"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enums/user");
const fileUploadHandler_1 = __importDefault(require("../../middlewares/fileUploadHandler"));
const booking_controller_1 = require("./booking.controller");
const router = express_1.default.Router();
router.post('/', (0, auth_1.default)(user_1.USER_ROLES.USER), (0, fileUploadHandler_1.default)(), booking_controller_1.BookingController.createBooking);
router.get('/', (0, auth_1.default)(user_1.USER_ROLES.USER), booking_controller_1.BookingController.myBookingFromDB);
router.get('/complete/:id', (0, auth_1.default)(user_1.USER_ROLES.USER), booking_controller_1.BookingController.completeBookingToDB);
router.patch('/reschedule/:id', (0, auth_1.default)(user_1.USER_ROLES.USER), (0, fileUploadHandler_1.default)(), booking_controller_1.BookingController.rescheduleBookingToDB);
router.get('/check-availability/:id', (0, auth_1.default)(user_1.USER_ROLES.USER), booking_controller_1.BookingController.checkAvailabilityBookingFromDB);
router.get('/transactions-history', (0, auth_1.default)(user_1.USER_ROLES.USER, user_1.USER_ROLES.ARTIST), booking_controller_1.BookingController.transactionsHistoryFromDB);
router.get('/booking-summary', (0, auth_1.default)(user_1.USER_ROLES.ARTIST), booking_controller_1.BookingController.bookingSummaryFromDB);
router.get('/lesson-booking', (0, auth_1.default)(user_1.USER_ROLES.ARTIST), booking_controller_1.BookingController.lessonBookingSummary);
router.post('/send-link/:id', (0, auth_1.default)(user_1.USER_ROLES.ARTIST), (0, fileUploadHandler_1.default)(), booking_controller_1.BookingController.sendLinkToUser);
router.patch('/respond/:id', (0, auth_1.default)(user_1.USER_ROLES.USER, user_1.USER_ROLES.ARTIST), booking_controller_1.BookingController.respondBookingToDB);
router.get('/details/:id', booking_controller_1.BookingController.bookingDetailsFromDB);
router.patch('/toggle-multi', booking_controller_1.BookingController.toggleMultiUser);
// ✅ New endpoint for Flutter’s call
router.patch('/lesson-booking/:id/status', (0, auth_1.default)(user_1.USER_ROLES.ARTIST), booking_controller_1.BookingController.respondBookingToDB);
router.patch('/lesson-booking/toggle-slot', (0, auth_1.default)(user_1.USER_ROLES.ARTIST), booking_controller_1.BookingController.toggleMultiUserForSlot);
exports.BookingRoutes = router;
