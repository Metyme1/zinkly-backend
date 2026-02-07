"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const user_service_1 = require("./user.service");
const createUser = (0, catchAsync_1.default)(async (req, res, next) => {
    const { ...userData } = req.body;
    const result = await user_service_1.UserService.createUserToDB(userData);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'User created successfully',
        data: result,
    });
});
const getUserProfile = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    const result = await user_service_1.UserService.getUserProfileFromDB(user);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Profile data retrieved successfully',
        data: result,
    });
});
//update profile
const updateProfile = (0, catchAsync_1.default)(async (req, res, next) => {
    const user = req.user;
    let profile;
    if (req.files && 'image' in req.files && req.files.image[0]) {
        profile = `/images/${req.files.image[0].filename}`;
    }
    const data = {
        profile: profile,
        ...req.body,
    };
    console.log(data);
    const result = await user_service_1.UserService.updateProfileToDB(user, data);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Profile updated successfully',
        data: result,
    });
});
// delete user
const deleteUser = (0, catchAsync_1.default)(async (req, res) => {
    const result = await user_service_1.UserService.deleteUserFromDB(req.user, req.body.password);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Account Deleted successfully',
        data: result
    });
});
exports.UserController = { createUser, getUserProfile, updateProfile, deleteUser };
