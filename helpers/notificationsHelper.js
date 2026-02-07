"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNotifications = void 0;
const notification_model_1 = require("../app/modules/notification/notification.model");
const sendNotifications = async (data) => {
    const result = await notification_model_1.Notification.create(data);
    const notification = await notification_model_1.Notification.findById(result._id).populate({ path: "sender", select: "name profile" }).select("text sender read createdAt");
    //@ts-ignore
    const socketIo = global.io;
    if (socketIo) {
        socketIo.emit(`get-notification::${data?.receiver}`, notification);
    }
    return result;
};
exports.sendNotifications = sendNotifications;
