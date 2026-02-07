"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LessonController = void 0;
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const lesson_service_1 = require("./lesson.service");
const createLesson = (0, catchAsync_1.default)(async (req, res) => {
    const lessonData = req.body;
    const user = req.user.id;
    let gallery = [];
    if (req.files && "image" in req.files && req.files.image.length) {
        for (let image of req.files.image) {
            gallery.push(`/images/${image.filename}`);
        }
    }
    const payload = {
        ...lessonData,
        gallery,
        user
    };
    console.log(payload);
    const result = await lesson_service_1.LessonService.createLesson(payload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Lesson created successfully",
        data: result
    });
});
const updateLesson = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    const updateData = req.body;
    let gallery = [];
    if (req.files && "image" in req.files && req.files.image.length) {
        for (let image of req.files.image) {
            gallery.push(`/images/${image.filename}`);
        }
    }
    const payload = {
        ...updateData,
        gallery
    };
    console.log(payload);
    const result = await lesson_service_1.LessonService.updateLesson(payload, user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Lesson updated successfully",
        data: result
    });
});
exports.LessonController = {
    createLesson,
    updateLesson
};
