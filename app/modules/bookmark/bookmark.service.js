"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookmarkService = void 0;
const http_status_codes_1 = require("http-status-codes");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const bookmark_model_1 = require("./bookmark.model");
const mongoose_1 = __importDefault(require("mongoose"));
const toggleBookmark = async (payload) => {
    // Check if the bookmark already exists
    const existingBookmark = await bookmark_model_1.Bookmark.findOne({
        user: payload.user,
        artist: payload.artist
    });
    if (existingBookmark) {
        // If the bookmark exists, delete it
        await bookmark_model_1.Bookmark.findByIdAndDelete(existingBookmark._id);
        return "Bookmark Remove successfully";
    }
    else {
        // If the bookmark doesn't exist, create it
        const result = await bookmark_model_1.Bookmark.create(payload);
        if (!result) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.EXPECTATION_FAILED, "Failed to add bookmark");
        }
        return "Bookmark Added successfully";
    }
};
const getBookmark = async (user) => {
    const result = await bookmark_model_1.Bookmark.find({ user: new mongoose_1.default.Types.ObjectId(user?.id) })
        .populate({
        path: 'artist',
        model: 'User',
        select: '_id name profile',
        populate: {
            path: 'lesson',
            model: 'Lesson',
            select: 'rating totalRating gallery lessonTitle'
        }
    }).select("artist");
    return result?.map((bookmark) => {
        const { lesson, ...otherData } = bookmark?.artist?.toObject();
        // Remove the lesson ID field if it exists
        if (lesson?._id) {
            delete lesson?._id;
        }
        return { ...otherData, ...lesson, status: true };
    });
};
exports.BookmarkService = { toggleBookmark, getBookmark };
