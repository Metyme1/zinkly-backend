"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notification = void 0;
const mongoose_1 = require("mongoose");
const notificationSchema = new mongoose_1.Schema({
    text: {
        type: String,
        required: true
    },
    sender: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiver: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    read: {
        type: Boolean,
        default: false
    },
    type: {
        type: String,
        required: false
    },
    adminRead: {
        type: Boolean,
        required: false
    }
}, {
    timestamps: true
});
exports.Notification = (0, mongoose_1.model)("Notification", notificationSchema);
