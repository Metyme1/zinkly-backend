"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const notification_model_1 = require("./notification.model");
const getNotificationFromDB = async (user) => {
    const result = await notification_model_1.Notification.find({ receiver: user.id }).populate({ path: "sender", select: "name profile" });
    return result;
};
const adminNotificationFromDB = async () => {
    const result = await notification_model_1.Notification.find({ type: "ADMIN" });
    return result;
};
const readNotificationToDB = async () => {
    const result = await notification_model_1.Notification.updateMany({ read: false }, { $set: { read: true } });
    return result;
};
exports.NotificationService = {
    adminNotificationFromDB,
    getNotificationFromDB,
    readNotificationToDB
};
