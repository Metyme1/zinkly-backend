"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Booking = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const bookingSchema = new mongoose_1.Schema({
    users: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' }],
    artist: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    price: { type: Number, required: true },
    fine: { type: Number },
    bookingId: { type: String, required: true, unique: true },
    status: {
        type: String,
        enum: ['Pending', 'Complete', 'Accept', 'Reject', 'Refund'],
        default: 'Pending',
    },
    booking_date: { type: String, required: true },
    booking_time: { type: String, required: true },
    transactionId: { type: String, required: true },
    // Zoom + multi-user fields
    zoomJoinUrl: { type: String },
    zoomStartUrl: { type: String },
    allowMultiple: { type: Boolean, default: false },
}, { timestamps: true });
exports.Booking = (0, mongoose_1.model)('Booking', bookingSchema);
