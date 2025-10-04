"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Availability = void 0;
// availability.model.ts
const mongoose_1 = require("mongoose");
const slotSchema = new mongoose_1.Schema({
    time: { type: String, required: true }, // e.g. "10:00"
    isBooked: { type: Boolean, default: false },
});
const availabilitySchema = new mongoose_1.Schema({
    artist: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true }, // store in YYYY-MM-DD
    slots: [slotSchema],
}, { timestamps: true });
exports.Availability = (0, mongoose_1.model)('Availability', availabilitySchema);
