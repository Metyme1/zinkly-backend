"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookmarkController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const bookmark_service_1 = require("./bookmark.service");
const toggleBookmark = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user.id;
    const artist = req.params.id;
    const payload = { user, artist };
    const result = await bookmark_service_1.BookmarkService.toggleBookmark(payload);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: result
    });
});
const getBookmark = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    const result = await bookmark_service_1.BookmarkService.getBookmark(user);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Bookmark Retrieved Successfully",
        data: result
    });
});
exports.BookmarkController = { toggleBookmark, getBookmark };
