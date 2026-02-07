"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArtistController = void 0;
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const artist_service_1 = require("./artist.service");
const lesson_model_1 = require("../lesson/lesson.model");
const artistProfileFromDB = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.params.id;
    const result = await artist_service_1.ArtistService.artistProfileFromDB(user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Artist Profile Retrieved Successfully',
        data: result,
    });
});
const popularArtistFromDB = (0, catchAsync_1.default)(async (req, res) => {
    const result = await artist_service_1.ArtistService.popularArtistFromDB();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Popular Available Artist Retrieved Successfully',
        data: result,
    });
});
const artistByCategoryFromDB = (0, catchAsync_1.default)(async (req, res) => {
    const category = req.params.category;
    const result = await artist_service_1.ArtistService.artistByCategoryFromDB(category);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: ' Artist By Category Retrieved Successfully',
        data: result,
    });
});
const availableArtistFromDB = (0, catchAsync_1.default)(async (req, res) => {
    const result = await artist_service_1.ArtistService.availableArtistFromDB();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Available Artist Retrieved Successfully',
        data: result,
    });
});
const artistListFromDB = (0, catchAsync_1.default)(async (req, res) => {
    const query = req.query; // Get query parameters directly from the request
    const { search, rating, gender, ...filterData } = query;
    const anyConditions = [];
    // Artist search handling
    if (search && typeof search === 'string' && search.trim().length > 0) {
        anyConditions.push({
            $or: ['title', 'lessonTitle', 'genre', 'instrument'].map(field => ({
                [field]: {
                    $regex: new RegExp(search, 'i'),
                },
            })),
        });
    }
    // Gender filter
    if (typeof gender === 'string' && gender.toLowerCase() !== 'all') {
        anyConditions.push({ gender: gender });
    }
    // Other filters
    if (Object.keys(filterData).length) {
        anyConditions.push({
            $and: Object.entries(filterData).map(([field, value]) => ({
                [field]: value,
            })),
        });
    }
    // Rating filter
    if (rating) {
        const ratingNumber = typeof rating === 'string'
            ? Number(rating)
            : Array.isArray(rating)
                ? Number(rating[0])
                : Number(rating);
        if (!isNaN(ratingNumber)) {
            anyConditions.push({
                rating: {
                    $gte: ratingNumber,
                    $lt: ratingNumber + 1,
                },
            });
        }
    }
    const whereConditions = anyConditions.length > 0 ? { $and: anyConditions } : {};
    const results = await lesson_model_1.Lesson.find(whereConditions)
        .populate({
        path: 'user',
        select: 'name profile email contact',
    })
        .select('rating totalRating gallery title price lessonTitle');
    const availableArtist = results.map((item) => {
        const artist = item.toObject();
        const { user, ...otherData } = artist;
        return {
            ...user,
            lesson: {
                ...otherData,
            },
        };
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Artist List Retrieved Successfully',
        data: availableArtist,
    });
});
exports.ArtistController = {
    artistProfileFromDB,
    popularArtistFromDB,
    artistByCategoryFromDB,
    availableArtistFromDB,
    artistListFromDB,
};
