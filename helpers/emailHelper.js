"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailHelper = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("../config"));
const logger_1 = require("../shared/logger");
const ejs_1 = __importDefault(require("ejs"));
const path_1 = __importDefault(require("path"));
const transporter = nodemailer_1.default.createTransport({
    host: config_1.default.email.host,
    port: Number(config_1.default.email.port),
    secure: false,
    auth: {
        user: config_1.default.email.user,
        pass: config_1.default.email.pass,
    },
});
const sendEmail = async (values) => {
    try {
        const info = await transporter.sendMail({
            from: `"Zinkly" ${config_1.default.email.from}`,
            to: values.to,
            subject: values.subject,
            html: values.html,
        });
        logger_1.logger.info('Mail send successfully', info.accepted);
    }
    catch (error) {
        logger_1.errorLogger.error('Email', error);
    }
};
const sendLink = async (values) => {
    const templatePath = path_1.default.join(__dirname, '../ejs/sessionConfirmation.ejs');
    const html = await ejs_1.default.renderFile(templatePath, {
        userName: values?.userName,
        artistName: values?.artistName,
        bookingDate: values?.bookingDate,
        bookingTime: values?.bookingTime,
        bookingLink: values?.bookingLink
    });
    try {
        const info = await transporter.sendMail({
            from: `"Zinkly" ${config_1.default.email.from}`,
            to: values.to,
            subject: "Session Link",
            html: html,
        });
        logger_1.logger.info('Mail send successfully', info.accepted);
    }
    catch (error) {
        logger_1.errorLogger.error('Email', error);
    }
};
exports.emailHelper = {
    sendEmail,
    sendLink
};
