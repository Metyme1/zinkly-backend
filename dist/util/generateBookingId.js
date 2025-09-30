"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generateBookingId = () => {
    const date = new Date();
    const bookingID = "#" +
        date.getDate() +
        date.getMonth() +
        date.getFullYear() +
        date.getHours() +
        date.getMinutes();
    return bookingID;
};
exports.default = generateBookingId;
