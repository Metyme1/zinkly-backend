"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const admin_service_1 = require("./admin.service");
const userList = (0, catchAsync_1.default)(async (req, res) => {
    const { page, limit, search } = req.query;
    const payload = { page, limit, search };
    console.log(search);
    const result = await admin_service_1.AdminService.usersFromDB(payload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "User Retrieved Successfully",
        data: result
    });
});
const createSuperAdmin = (0, catchAsync_1.default)(async (req, res) => {
    const result = await admin_service_1.AdminService.createSuperAdminToDB(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Super Admin Created Successfully",
        data: result
    });
});
const artistList = (0, catchAsync_1.default)(async (req, res) => {
    const { page, limit, search } = req.query;
    const payload = { page, limit, search };
    const result = await admin_service_1.AdminService.artistFromDB(payload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Artist Retrieved Successfully",
        data: result
    });
});
const transactionList = (0, catchAsync_1.default)(async (req, res) => {
    const { search, page, limit, status } = req.query;
    const payload = { search, page, limit, status };
    const result = await admin_service_1.AdminService.transactionsFromDB(payload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Transaction Retrieved Successfully",
        data: result
    });
});
const bookingSummary = (0, catchAsync_1.default)(async (req, res) => {
    const result = await admin_service_1.AdminService.bookingSummaryFromDB();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Booking Summary Retrieved Successfully",
        data: result
    });
});
const earningStatistic = (0, catchAsync_1.default)(async (req, res) => {
    const result = await admin_service_1.AdminService.earningStatisticFromDB();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Earing Statistic Retrieved Successfully",
        data: result
    });
});
const userStatistic = (0, catchAsync_1.default)(async (req, res) => {
    const result = await admin_service_1.AdminService.userStatisticFromDB();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "User Statistic Retrieved Successfully",
        data: result
    });
});
const createAdmin = (0, catchAsync_1.default)(async (req, res) => {
    const payload = req.body;
    const result = await admin_service_1.AdminService.createAdminToDB(payload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Admin created Successfully",
        data: result
    });
});
const deleteAdmin = (0, catchAsync_1.default)(async (req, res) => {
    const payload = req.params.id;
    const result = await admin_service_1.AdminService.deleteAdminFromDB(payload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Admin Deleted Successfully",
        data: result
    });
});
const getAdmin = (0, catchAsync_1.default)(async (req, res) => {
    const result = await admin_service_1.AdminService.getAdminFromDB();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Admin Retrieved Successfully",
        data: result
    });
});
exports.AdminController = {
    userList,
    artistList,
    transactionList,
    createSuperAdmin,
    bookingSummary,
    userStatistic,
    earningStatistic,
    deleteAdmin,
    createAdmin,
    getAdmin
};
