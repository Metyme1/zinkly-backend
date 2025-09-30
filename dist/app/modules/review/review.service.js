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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewService = void 0;
const http_status_codes_1 = require("http-status-codes");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const review_model_1 = require("./review.model");
const lesson_model_1 = require("../lesson/lesson.model");
const mongoose_1 = __importDefault(require("mongoose"));
const createReview = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // convert string to object id;
    const id = new mongoose_1.default.Types.ObjectId(payload.artist);
    // check the artist is exist or not;
    const isExistArtist = yield lesson_model_1.Lesson.findOne({ user: id });
    if (!isExistArtist) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "No Artist Found");
    }
    // checking the rating is valid or not;
    const rating = Number(payload.rating);
    if (rating < 1 || rating > 5) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Invalid rating value");
    }
    // creating review;
    const review = yield review_model_1.Review.create(payload);
    if (!review) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Failed to create review");
    }
    // Update artist's rating and total ratings count
    const totalRating = isExistArtist.totalRating + 1;
    let newRating;
    if (isExistArtist.rating === null || isExistArtist.rating === 0) {
        newRating = rating;
    }
    else {
        newRating = ((isExistArtist.rating * isExistArtist.totalRating) + rating) / totalRating;
    }
    const updatedData = {
        totalRating: totalRating,
        rating: Number(newRating).toFixed(2) // Round to 2 decimal places
    };
    const result = yield lesson_model_1.Lesson.findOneAndUpdate({ user: payload.artist }, updatedData, { new: true });
    if (!result) {
        console.log("error");
    }
    return result;
});
const getReview = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield review_model_1.Review.find({ artist: id }).populate({ path: "user", select: "name profile" }).select("user rating text");
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.EXPECTATION_FAILED, "Failed to create review");
    }
    return result;
});
exports.ReviewService = {
    createReview,
    getReview
};
