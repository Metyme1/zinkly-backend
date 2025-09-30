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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingService = void 0;
const http_status_codes_1 = require("http-status-codes");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const user_model_1 = require("../user/user.model");
const booking_model_1 = require("./booking.model");
const generateBookingId_1 = __importDefault(require("../../../util/generateBookingId"));
const mongoose_1 = __importDefault(require("mongoose"));
const emailHelper_1 = require("../../../helpers/emailHelper");
const stripe_1 = __importDefault(require("stripe"));
const config_1 = __importDefault(require("../../../config"));
const notificationsHelper_1 = require("../../../helpers/notificationsHelper");
//create stripe instance
const stripe = new stripe_1.default(config_1.default.stripe_api_secret);
const createBooking = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistArtist = yield user_model_1.User.findById(payload.user);
    if (!isExistArtist) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "No User Found to Booked");
    }
    const { price } = payload;
    if (typeof price === "string") {
        payload.price = Number(price);
    }
    const createOrder = Object.assign(Object.assign({}, payload), { bookingId: yield (0, generateBookingId_1.default)() });
    const booking = yield booking_model_1.Booking.create(createOrder);
    if (!booking) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Failed to Booked A Booking");
    }
    // this notifications for artist
    const data = {
        sender: payload.user,
        receiver: payload.artist,
        text: `Booking on your lesson`,
    };
    yield (0, notificationsHelper_1.sendNotifications)(data);
    /* const bookingTime = new Date(payload.booking_time as string);
    console.log(bookingTime, payload.booking_time)
    const reminderTime = new Date(bookingTime.getTime() - 2 * 60 * 60 * 1000);

    // Check if reminderTime is valid
    if (isNaN(reminderTime.getTime())) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid reminder time calculated");
    }

    // Convert reminder time to cron format
    const cronTime = `${reminderTime.getMinutes()} ${reminderTime.getHours()} ${reminderTime.getDate()} ${reminderTime.getMonth() + 1} *`;

    // Log or validate cronTime before scheduling
    console.log("Scheduling reminder with cron time:", cronTime);

    // Schedule the reminder
    cron.schedule(cronTime, async () => {
        // Notification for the user
        const data = {
            sender: payload.artist,
            receiver: payload.user,
            text: `Your appointment is in 2 hours. Don't forget!`,
        };
        await sendNotifications(data);
    }); */
    return booking;
});
const myBookingFromDB = (payload, queries) => __awaiter(void 0, void 0, void 0, function* () {
    const query = {
        user: payload
    };
    if (queries === "Complete") {
        query.status = queries;
    }
    else {
        query.status = "Pending";
    }
    const result = yield booking_model_1.Booking.find(query).populate({
        path: "artist",
        select: "name profile"
    }).select("artist booking_time status booking_date bookingId");
    return result;
});
// booking marked as complete
const completeBookingToDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistBooking = yield booking_model_1.Booking.findByIdAndUpdate({ _id: id }, { status: "Complete" }, { new: true });
    if (!isExistBooking) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "There is No Booking Found");
    }
    // this notifications for artist
    const data = {
        sender: isExistBooking.user,
        receiver: isExistBooking.artist,
        text: `Someone booking on your lesson`,
    };
    yield (0, notificationsHelper_1.sendNotifications)(data);
    return isExistBooking;
});
// reschedule booking
const rescheduleBookingToDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistBooking = yield booking_model_1.Booking.findById(id);
    if (!isExistBooking) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "There is No Booking Found");
    }
    const updatedData = Object.assign(Object.assign({}, payload), { price: parseInt(isExistBooking.price) + 5, fine: 5 });
    // this notifications for artist
    const data = {
        sender: isExistBooking.user,
        receiver: isExistBooking.artist,
        text: `Reschedule on your lesson`,
    };
    yield (0, notificationsHelper_1.sendNotifications)(data);
    const result = yield booking_model_1.Booking.findByIdAndUpdate({ _id: id }, updatedData, { new: true });
    return result;
});
// check booking availability
const checkAvailabilityBookingFromDB = (id, date) => __awaiter(void 0, void 0, void 0, function* () {
    // Convert date to yyyy-mm-dd format
    const today = new Date().toISOString().split('T')[0];
    // Get all booked dates for the artist from today onwards
    const bookingList = yield booking_model_1.Booking.find({
        artist: id,
        booking_date: { $gte: today }
    });
    // Get unique booked dates
    const bookedDates = [...new Set(bookingList.map((item) => item.booking_date))];
    // Get bookings for the specific date (either `date` or `today`)
    const getBookingTimes = yield booking_model_1.Booking.find({
        artist: id,
        booking_date: date ? date : today //Check if `date` exists, otherwise use `today`
    });
    // Get unique booked times for that date
    const bookedTimes = [...new Set(getBookingTimes.map((item) => item.booking_time))];
    // Return the booked dates and times
    const data = {
        bookedDate: bookedDates,
        bookedTime: bookedTimes
    };
    return data;
});
// transaction history 
const transactionsHistoryFromDB = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const role = user === null || user === void 0 ? void 0 : user.role;
    const query = role === "USER" ? { user: user === null || user === void 0 ? void 0 : user.id } : { artist: user === null || user === void 0 ? void 0 : user.id };
    // Perform the query and conditionally populate the fields
    const result = yield booking_model_1.Booking.find(query)
        .populate({
        path: role === "USER" ? "artist" : "user",
        select: "name profile"
    })
        .select(`booking_date booking_time price  ${role === "USER" ? "artist" : "user"}`);
    // Format the response
    const transactions = result.map((item) => {
        const populatedField = role === "USER" ? "artist" : "user";
        const _a = item === null || item === void 0 ? void 0 : item.toObject(), _b = populatedField, populatedData = _a[_b], othersInfo = __rest(_a, [typeof _b === "symbol" ? _b : _b + ""]);
        return Object.assign(Object.assign({}, populatedData), othersInfo);
    });
    return transactions;
});
// respond for booking status 
const respondBookingToDB = (id, status) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Invalid ID");
    }
    // Update the booking status
    const result = yield booking_model_1.Booking.findByIdAndUpdate({ _id: id }, { status: status }, { new: true });
    // Check if the booking was found and updated
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Failed to update booking.");
    }
    // If the status is "rejected", initiate a refund
    if (status === "Reject") {
        const paymentIntent = yield stripe.paymentIntents.retrieve(result === null || result === void 0 ? void 0 : result.transactionId);
        const chargeId = paymentIntent.charges.data[0].id;
        if (!chargeId) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "No payment found for this booking.");
        }
        // Initiate the refund
        try {
            const refund = yield stripe.refunds.create({
                charge: chargeId,
            });
            console.log("Refund successful:", refund);
        }
        catch (refundError) {
            console.error("Refund failed:", refundError);
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Refund failed. Please try again.");
        }
    }
    // this notifications for artist
    const data = {
        receiver: result.artist,
        sender: result.user,
        text: `Your session is ${status}`,
    };
    yield (0, notificationsHelper_1.sendNotifications)(data);
    return result;
});
// booking details 
const bookingDetailsFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield booking_model_1.Booking.findById(id).populate([
        {
            path: "artist",
            select: "name",
            populate: {
                path: 'lesson',
                select: "lessonTitle price"
            }
        },
        {
            path: "user",
            select: "name contact"
        }
    ]).select("user artist bookingId price booking_date booking_time");
    return result;
});
// check booking availability
const bookingSummaryFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // Convert date to yyyy-mm-dd format
    const today = new Date().toISOString().split('T')[0];
    // Get all booked user
    const bookingList = yield booking_model_1.Booking.find({
        artist: new mongoose_1.default.Types.ObjectId(id),
        status: "Pending",
        booking_date: { $gte: today }
    }).populate({ path: "user", select: "name profile" }).select("user booking_date");
    // my balance
    const totalIncome = yield booking_model_1.Booking.aggregate([
        { $match: { artist: new mongoose_1.default.Types.ObjectId(id) } },
        {
            $group: {
                _id: null,
                totalIncomes: { $sum: "$price" }
            }
        },
        {
            $project: {
                totalIncomes: 1,
                incomeAfterDeduction: { $subtract: ["$totalIncomes", { $multiply: ["$totalIncomes", 0.2] }] } // Subtract 20%
            }
        }
    ]);
    const balance = ((_a = totalIncome[0]) === null || _a === void 0 ? void 0 : _a.incomeAfterDeduction) || 0;
    // total user count;
    const result = yield booking_model_1.Booking.aggregate([
        {
            $match: {
                artist: new mongoose_1.default.Types.ObjectId(id)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "user"
            }
        },
        {
            $unwind: "$user"
        },
        {
            $group: {
                _id: "$user._id"
            }
        },
        {
            $count: "uniqueUserCount"
        }
    ]);
    const totalClient = result.length > 0 ? result[0].uniqueUserCount : 0;
    // yearly revenue
    const newDate = new Date();
    const startOfYear = new Date(newDate.getFullYear(), 0, 1).toISOString().split('T')[0];
    const endOfYear = new Date(newDate.getFullYear(), 11, 31).toISOString().split('T')[0];
    const yearlyBooking = yield booking_model_1.Booking.find({
        artist: id,
        createdAt: { $gte: startOfYear, $lt: endOfYear }
    });
    const yearlyIncome = [
        { month: "Jan", income: 0 },
        { month: "Feb", income: 0 },
        { month: "Mar", income: 0 },
        { month: "Apr", income: 0 },
        { month: "May", income: 0 },
        { month: "Jun", income: 0 },
        { month: "Jul", income: 0 },
        { month: "Aug", income: 0 },
        { month: "Sep", income: 0 },
        { month: "Oct", income: 0 },
        { month: "Nov", income: 0 },
        { month: "Dec", income: 0 }
    ];
    // Update income based on the booking creation date (createdAt)
    yearlyBooking.forEach((booking) => {
        const createdAtDate = new Date(booking.createdAt);
        const createdAtMonth = createdAtDate.getMonth();
        // Ensure that the month exists before trying to access income
        if (yearlyIncome[createdAtMonth]) {
            yearlyIncome[createdAtMonth].income += parseInt((booking === null || booking === void 0 ? void 0 : booking.price) || 0);
        }
    });
    return { totalClient, balance, bookingList, yearlyIncome };
});
const lessonBookingFromDB = (id, status, date) => __awaiter(void 0, void 0, void 0, function* () {
    // Convert date to yyyy-mm-dd format
    const today = new Date().toISOString().split('T')[0];
    let query = {
        artist: id,
        booking_date: { $gte: today },
    };
    if (date) {
        query.booking_date = date;
    }
    else {
        query.status = "Pending";
    }
    if (status) {
        if (status === "Accept") {
            query.status = "Accept";
        }
        else if (status === "Reject") {
            query.status = "Reject";
        }
    }
    const booking = yield booking_model_1.Booking.find(query).populate({
        path: "user",
        select: "name profile"
    }).select("user bookingId status booking_date");
    const bookingList = yield booking_model_1.Booking.find({ artist: id, booking_date: { $gte: today } });
    const bookingDates = [...new Set(bookingList.map(item => item.booking_date))];
    return { bookingDates, booking };
});
const sendLinkToUser = (id, bookingLink) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const booking = yield booking_model_1.Booking.findById(id).populate("user artist");
    const emailData = {
        to: (_a = booking === null || booking === void 0 ? void 0 : booking.user) === null || _a === void 0 ? void 0 : _a.email,
        userName: (_b = booking === null || booking === void 0 ? void 0 : booking.user) === null || _b === void 0 ? void 0 : _b.name,
        artistName: (_c = booking === null || booking === void 0 ? void 0 : booking.artist) === null || _c === void 0 ? void 0 : _c.name,
        bookingDate: booking === null || booking === void 0 ? void 0 : booking.booking_date,
        bookingTime: booking === null || booking === void 0 ? void 0 : booking.booking_time,
        bookingLink: bookingLink
    };
    // this notifications for artist
    const data = {
        sender: booking.user,
        receiver: booking.artist,
        text: `Send Lesson session link with details`,
    };
    yield (0, notificationsHelper_1.sendNotifications)(data);
    yield emailHelper_1.emailHelper.sendLink(emailData);
});
exports.BookingService = {
    createBooking,
    myBookingFromDB,
    completeBookingToDB,
    rescheduleBookingToDB,
    checkAvailabilityBookingFromDB,
    transactionsHistoryFromDB,
    respondBookingToDB,
    bookingDetailsFromDB,
    bookingSummaryFromDB,
    lessonBookingFromDB,
    sendLinkToUser
};
