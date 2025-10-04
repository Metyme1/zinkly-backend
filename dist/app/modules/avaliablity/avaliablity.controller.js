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
exports.AvailabilityController = void 0;
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const avaliablity_service_1 = require("./avaliablity.service");
const booking_model_1 = require("../booking/booking.model"); // ✅ make sure path matches your project
const setAvailability = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const artistId = req.user.id; // must be ARTIST role
    const { date, slots } = req.body;
    const result = yield avaliablity_service_1.AvailabilityService.setAvailability(artistId, date, slots);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Availability saved successfully',
        data: result,
    });
}));
const getAvailability = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { artistId, date } = req.query;
    // 1. Get base availability slots (from Availability collection)
    const baseSlots = yield avaliablity_service_1.AvailabilityService.getAvailability(artistId, date);
    if (!baseSlots) {
        return (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true,
            message: 'No availability found',
            data: [],
        });
    }
    // 2. Merge availability slots with booking info
    const slotsWithStatus = yield Promise.all(baseSlots.slots.map((slot) => __awaiter(void 0, void 0, void 0, function* () {
        const booking = yield booking_model_1.Booking.findOne({
            artist: artistId,
            booking_date: date, // ✅ use your schema field (watch snake/camel case!)
            booking_time: slot.time,
        }).populate('users', 'name profile');
        if (booking) {
            return {
                time: slot.time,
                isBooked: !booking.allowMultiple, // 🔑 only block if allowMultiple = false
                allowMultiple: booking.allowMultiple || false,
                users: booking.users || [],
            };
        }
        return {
            time: slot.time,
            isBooked: false,
            allowMultiple: false,
            users: [],
        };
    })));
    console.log('[AVAILABILITY] artistId:', artistId, 'date:', date, 'slots:', JSON.stringify(slotsWithStatus, null, 2));
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Availability fetched successfully',
        data: slotsWithStatus,
    });
}));
exports.AvailabilityController = {
    setAvailability,
    getAvailability,
};
