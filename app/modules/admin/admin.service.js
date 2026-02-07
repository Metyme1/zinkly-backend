"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const http_status_codes_1 = require("http-status-codes");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const booking_model_1 = require("../booking/booking.model");
const user_model_1 = require("../user/user.model");
const createSuperAdminToDB = async (payload) => {
    if (payload.role !== 'SUPER_ADMIN') {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'This Api only for Super ADMIN');
    }
    const isExistEmail = await user_model_1.User.findOne({ email: payload.email });
    if (isExistEmail) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'This email already Taken');
    }
    const createAdmin = await user_model_1.User.create(payload);
    if (!createAdmin) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Failed to create Admin');
    }
    if (createAdmin) {
        await user_model_1.User.findByIdAndUpdate({ _id: createAdmin?._id }, { verified: true }, { new: true });
    }
    return createAdmin;
};
const usersFromDB = async (payload) => {
    const { search, page, limit } = payload;
    const anyConditions = [{ role: 'USER' }];
    //artist search here
    if (search) {
        anyConditions.push({
            $or: ['name', 'email'].map(field => ({
                [field]: {
                    $regex: search,
                    $options: 'i',
                },
            })),
        });
    }
    const whereConditions = anyConditions.length > 0 ? { $and: anyConditions } : {};
    const pages = parseInt(page) || 1;
    const size = parseInt(limit) || 10;
    const skip = (pages - 1) * size;
    const result = await user_model_1.User.find(whereConditions)
        .select('name email contact location gender profile')
        .skip(skip)
        .limit(size);
    const count = await user_model_1.User.countDocuments(whereConditions);
    const data = {
        data: result,
        meta: {
            page: pages,
            total: count,
        },
    };
    return data;
};
const artistFromDB = async (payload) => {
    const { search, page, limit } = payload;
    const anyConditions = [{ role: 'ARTIST' }];
    //artist search here
    if (search) {
        anyConditions.push({
            $or: ['name', 'email'].map(field => ({
                [field]: {
                    $regex: search,
                    $options: 'i',
                },
            })),
        });
    }
    const whereConditions = anyConditions.length > 0 ? { $and: anyConditions } : {};
    const pages = parseInt(page) || 1;
    const size = parseInt(limit) || 10;
    const skip = (pages - 1) * size;
    const result = await user_model_1.User.find(whereConditions)
        .populate({ path: 'lesson', select: 'genre bio' })
        .select('name email contact location gender profile lesson')
        .skip(skip)
        .limit(size);
    const count = await user_model_1.User.countDocuments(whereConditions);
    const data = {
        data: result,
        meta: {
            page: pages,
            total: count,
        },
    };
    return data;
};
const transactionsFromDB = async (payload) => {
    const { search, page, limit, status } = payload;
    const anyConditions = [];
    // Filter by status if provided
    if (status) {
        anyConditions.push({
            status: status,
        });
    }
    // Search condition for populated fields
    if (search) {
        // For user and artist populated fields (name, email)
        anyConditions.push({
            $or: [
                { 'user.name': { $regex: search, $options: 'i' } },
                { 'user.email': { $regex: search, $options: 'i' } },
                { 'artist.name': { $regex: search, $options: 'i' } },
                { 'artist.email': { $regex: search, $options: 'i' } },
            ],
        });
    }
    const whereConditions = anyConditions.length > 0 ? { $and: anyConditions } : {};
    const pages = parseInt(page) || 1;
    const size = parseInt(limit) || 10;
    const skip = (pages - 1) * size;
    const result = await booking_model_1.Booking.find(whereConditions)
        .populate([
        {
            path: 'user',
            select: 'name email profile',
        },
        {
            path: 'artist',
            select: 'name email profile',
        },
    ])
        .skip(skip)
        .limit(size);
    // Count the documents that match the search conditions
    const count = await booking_model_1.Booking.countDocuments(whereConditions);
    const data = {
        data: result,
        meta: {
            page: pages,
            total: count,
        },
    };
    return data;
};
const bookingSummaryFromDB = async () => {
    // total user
    const users = await user_model_1.User.countDocuments({ role: 'USER' });
    // total artist
    const artist = await user_model_1.User.countDocuments({ role: 'ARTIST' });
    // balance
    const income = await booking_model_1.Booking.aggregate([
        {
            $group: {
                _id: null,
                totalIncome: { $sum: '$price' },
            },
        },
        {
            $project: {
                totalIncome: { $ifNull: ['$totalIncome', 0] }, // ✅ default 0 if null
                totalRevenue: {
                    $subtract: ['$totalIncome', { $multiply: ['$totalIncome', 0.9] }],
                },
            },
        },
    ]);
    const balance = income[0] || { totalIncome: 0, totalRevenue: 0 };
    return {
        totalUser: users,
        totalArtist: artist,
        balance,
    };
};
const earningStatisticFromDB = async () => {
    // month with 0 income
    const months = [
        { name: 'Jan', totalIncome: 0 },
        { name: 'Feb', totalIncome: 0 },
        { name: 'Mar', totalIncome: 0 },
        { name: 'Apr', totalIncome: 0 },
        { name: 'May', totalIncome: 0 },
        { name: 'Jun', totalIncome: 0 },
        { name: 'Jul', totalIncome: 0 },
        { name: 'Aug', totalIncome: 0 },
        { name: 'Sep', totalIncome: 0 },
        { name: 'Oct', totalIncome: 0 },
        { name: 'Nov', totalIncome: 0 },
        { name: 'Dec', totalIncome: 0 },
    ];
    const now = new Date();
    const currentYear = now.getFullYear();
    const startDate = new Date(currentYear, 0, 1);
    const endDate = new Date(currentYear + 1, 0, 1);
    const monthlyEarnings = await booking_model_1.Booking.aggregate([
        { $match: { createdAt: { $gte: startDate, $lt: endDate } } },
        {
            $group: {
                _id: {
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' },
                },
                totalIncome: { $sum: '$price' },
            },
        },
    ]);
    monthlyEarnings.forEach((income) => {
        const monthIndex = income._id.month - 1;
        months[monthIndex].totalIncome = income.totalIncome;
    });
    return months;
};
const userStatisticFromDB = async () => {
    const months = [
        { name: 'Jan', artist: 0, user: 0 },
        { name: 'Feb', artist: 0, user: 0 },
        { name: 'Mar', artist: 0, user: 0 },
        { name: 'Apr', artist: 0, user: 0 },
        { name: 'May', artist: 0, user: 0 },
        { name: 'Jun', artist: 0, user: 0 },
        { name: 'Jul', artist: 0, user: 0 },
        { name: 'Aug', artist: 0, user: 0 },
        { name: 'Sep', artist: 0, user: 0 },
        { name: 'Oct', artist: 0, user: 0 },
        { name: 'Nov', artist: 0, user: 0 },
        { name: 'Dec', artist: 0, user: 0 },
    ];
    const now = new Date();
    const currentYear = now.getFullYear();
    const startDate = new Date(currentYear, 0, 1);
    const endDate = new Date(currentYear + 1, 0, 1);
    // Aggregate users by month
    const monthlyUser = await user_model_1.User.aggregate([
        { $match: { role: 'USER', createdAt: { $gte: startDate, $lt: endDate } } },
        {
            $group: { _id: { month: { $month: '$createdAt' } }, count: { $sum: 1 } },
        },
    ]);
    // Aggregate artists by month
    const monthlyArtist = await user_model_1.User.aggregate([
        {
            $match: { role: 'ARTIST', createdAt: { $gte: startDate, $lt: endDate } },
        },
        {
            $group: { _id: { month: { $month: '$createdAt' } }, count: { $sum: 1 } },
        },
    ]);
    // Merge user data into the months array
    monthlyUser.forEach((user) => {
        const monthIndex = user._id.month - 1;
        months[monthIndex].user = user.count;
    });
    // Merge artist data into the months array
    monthlyArtist.forEach((artist) => {
        const monthIndex = artist._id.month - 1;
        months[monthIndex].artist = artist.count;
    });
    return months;
};
const createAdminToDB = async (payload) => {
    const createAdmin = await user_model_1.User.create(payload);
    if (!createAdmin) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Failed to create Admin');
    }
    if (createAdmin) {
        await user_model_1.User.findByIdAndUpdate({ _id: createAdmin?._id }, { verified: true }, { new: true });
    }
    return createAdmin;
};
const deleteAdminFromDB = async (id) => {
    const isExistAdmin = await user_model_1.User.findByIdAndDelete(id);
    if (!isExistAdmin) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Failed to delete Admin');
    }
    return;
};
const getAdminFromDB = async () => {
    const admins = await user_model_1.User.find({ role: 'ADMIN' }).select('name email profile contact location');
    return admins;
};
exports.AdminService = {
    usersFromDB,
    artistFromDB,
    transactionsFromDB,
    createSuperAdminToDB,
    bookingSummaryFromDB,
    earningStatisticFromDB,
    userStatisticFromDB,
    createAdminToDB,
    deleteAdminFromDB,
    getAdminFromDB,
};
