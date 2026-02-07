"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewController = void 0;
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const review_service_1 = require("./review.service");
const createReview = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    const reviewData = req.body;
    const id = req.params.id;
    const payload = {
        ...reviewData,
        artist: id,
        user: user?.id
    };
    const result = await review_service_1.ReviewService.createReview(payload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Review created successfully",
        data: result
    });
});
const getReview = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    const result = await review_service_1.ReviewService.getReview(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Review Retrieved successfully",
        data: result
    });
});
exports.ReviewController = { createReview, getReview };
