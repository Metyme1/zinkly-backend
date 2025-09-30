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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const notification_model_1 = require("./notification.model");
const getNotificationFromDB = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield notification_model_1.Notification.find({ receiver: user.id }).populate({ path: "sender", select: "name profile" });
    return result;
});
const adminNotificationFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield notification_model_1.Notification.find({ type: "ADMIN" });
    return result;
});
const readNotificationToDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield notification_model_1.Notification.updateMany({ read: false }, { $set: { read: true } });
    return result;
});
exports.NotificationService = {
    adminNotificationFromDB,
    getNotificationFromDB,
    readNotificationToDB
};
