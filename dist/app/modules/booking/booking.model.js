"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Booking = void 0;
const mongoose_1 = require("mongoose");
const bookingSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    artist: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    fine: {
        type: Number,
        default: 0
    },
    bookingId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["Pending", "Complete", "Accept", "Reject", "Refund"],
        default: "Pending"
    },
    booking_date: {
        type: String,
        required: true
    },
    transactionId: {
        type: String,
        require: true
    },
    booking_time: {
        type: String,
        required: true
    }
}, { timestamps: true });
exports.Booking = (0, mongoose_1.model)("Booking", bookingSchema);
