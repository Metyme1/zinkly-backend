"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LessonService = void 0;
const http_status_codes_1 = require("http-status-codes");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const lesson_model_1 = require("./lesson.model");
const user_model_1 = require("../user/user.model");
const unlinkFile_1 = __importDefault(require("../../../shared/unlinkFile"));
const createLesson = async (payload) => {
    const artist = payload.user;
    // check artist is add all bank info or not
    const isExistBank = await user_model_1.User.isAccountCreated(artist);
    /* if(!isExistBank){
        throw new ApiError(StatusCodes.UNAUTHORIZED, "Please Put all of your bank info then try again");
    } */
    const result = await lesson_model_1.Lesson.create(payload);
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Failed to create Lesson");
    }
    if (result?._id) {
        await user_model_1.User.findByIdAndUpdate({ _id: result?.user }, { $set: { lesson: result?._id } });
    }
    return result;
};
const updateLesson = async (payload, user) => {
    const isValidUser = await user_model_1.User.findById(user?.id);
    const isExistLesson = await lesson_model_1.Lesson.findById(isValidUser?.lesson);
    if (!isExistLesson) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "You are not authorized to edit Lesson");
    }
    const { imagesToDelete, gallery, ...othersValue } = payload;
    // Filter images to delete only if `imagesToDelete` exists
    const updatedImages = isExistLesson.gallery.filter((image) => !imagesToDelete?.includes(image));
    // Remove file only if `imagesToDelete` is present
    if (imagesToDelete && imagesToDelete.length > 0) {
        for (let image of imagesToDelete) {
            (0, unlinkFile_1.default)(image);
        }
    }
    // If new gallery images are provided, add them to the updated images
    if (payload.gallery && payload.gallery.length > 0) {
        updatedImages.push(...payload.gallery);
    }
    // Prepare data for update
    const updateData = {
        ...othersValue,
        gallery: updatedImages.length > 0 ? updatedImages : isExistLesson.gallery
    };
    // Update lesson and return result
    const result = await lesson_model_1.Lesson.findByIdAndUpdate({ _id: isValidUser?.lesson }, updateData, { new: true });
    return result;
};
const moveLesson = async (lessonId, newUserId) => {
    const lesson = await lesson_model_1.Lesson.findById(lessonId);
    if (!lesson) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Lesson not found");
    }
    const newUser = await user_model_1.User.findById(newUserId);
    if (!newUser) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "New user not found");
    }
    const oldUserId = lesson.user;
    // Update lesson owner
    lesson.user = newUserId;
    await lesson.save();
    // Update old user's lesson field
    await user_model_1.User.findByIdAndUpdate(oldUserId, { $unset: { lesson: 1 } });
    // Update new user's lesson field
    await user_model_1.User.findByIdAndUpdate(newUserId, { $set: { lesson: lessonId } });
    return lesson;
};
const createLessonByAdmin = async (payload) => {
    const user = await user_model_1.User.findById(payload.user);
    if (!user) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
    }
    const result = await lesson_model_1.Lesson.create(payload);
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Failed to create Lesson");
    }
    if (result?._id) {
        await user_model_1.User.findByIdAndUpdate({ _id: result?.user }, { $set: { lesson: result?._id } });
    }
    return result;
};
const updateLessonByAdmin = async (id, payload) => {
    const lesson = await lesson_model_1.Lesson.findById(id);
    if (!lesson) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Lesson not found");
    }
    const result = await lesson_model_1.Lesson.findByIdAndUpdate({ _id: id }, payload, { new: true });
    return result;
};
exports.LessonService = { createLesson, updateLesson, moveLesson, createLessonByAdmin, updateLessonByAdmin };
