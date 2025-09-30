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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
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
const createLesson = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const artist = payload.user;
    // check artist is add all bank info or not
    const isExistBank = yield user_model_1.User.isAccountCreated(artist);
    /* if(!isExistBank){
        throw new ApiError(StatusCodes.UNAUTHORIZED, "Please Put all of your bank info then try again");
    } */
    const result = yield lesson_model_1.Lesson.create(payload);
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Failed to create Lesson");
    }
    if (result === null || result === void 0 ? void 0 : result._id) {
        yield user_model_1.User.findByIdAndUpdate({ _id: result === null || result === void 0 ? void 0 : result.user }, { $set: { lesson: result === null || result === void 0 ? void 0 : result._id } });
    }
    return result;
});
const updateLesson = (payload, user) => __awaiter(void 0, void 0, void 0, function* () {
    const isValidUser = yield user_model_1.User.findById(user === null || user === void 0 ? void 0 : user.id);
    const isExistLesson = yield lesson_model_1.Lesson.findById(isValidUser === null || isValidUser === void 0 ? void 0 : isValidUser.lesson);
    if (!isExistLesson) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "You are not authorized to edit Lesson");
    }
    const { imagesToDelete, gallery } = payload, othersValue = __rest(payload, ["imagesToDelete", "gallery"]);
    // Filter images to delete only if `imagesToDelete` exists
    const updatedImages = isExistLesson.gallery.filter((image) => !(imagesToDelete === null || imagesToDelete === void 0 ? void 0 : imagesToDelete.includes(image)));
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
    const updateData = Object.assign(Object.assign({}, othersValue), { gallery: updatedImages.length > 0 ? updatedImages : isExistLesson.gallery });
    // Update lesson and return result
    const result = yield lesson_model_1.Lesson.findByIdAndUpdate({ _id: isValidUser === null || isValidUser === void 0 ? void 0 : isValidUser.lesson }, updateData, { new: true });
    return result;
});
exports.LessonService = { createLesson, updateLesson };
