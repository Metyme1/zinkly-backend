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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArtistService = void 0;
const lesson_model_1 = require("../lesson/lesson.model");
const bookmark_model_1 = require("../bookmark/bookmark.model");
const user_model_1 = require("../user/user.model");
const booking_model_1 = require("../booking/booking.model");
const review_model_1 = require("../review/review.model");
const artistProfileFromDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistArtist = yield user_model_1.User.findById(payload)
        .populate({
        path: "lesson",
        select: "title genre instrument bio duration price notes rating totalRating gallery lessonTitle lessonDescription lessonOutline"
    }).select("name profile");
    // get all artist id from bookmark;
    const bookmarkId = yield bookmark_model_1.Bookmark.find({ artist: payload }).distinct("artist");
    const reviews = yield review_model_1.Review.find({ artist: payload })
        .populate({
        path: "user",
        select: "name profile"
    }).select("user text rating");
    // Convert ObjectId to strings if necessary
    const bookmarkIdStrings = bookmarkId === null || bookmarkId === void 0 ? void 0 : bookmarkId.map(id => id === null || id === void 0 ? void 0 : id.toString());
    // now checking bookmark includes the artist; 
    const isWish = bookmarkIdStrings === null || bookmarkIdStrings === void 0 ? void 0 : bookmarkIdStrings.includes(isExistArtist === null || isExistArtist === void 0 ? void 0 : isExistArtist._id.toString());
    const result = Object.assign(Object.assign({}, isExistArtist === null || isExistArtist === void 0 ? void 0 : isExistArtist.toObject()), { bookmark: isWish, reviews: reviews || [] });
    return result;
});
const popularArtistFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const artists = yield lesson_model_1.Lesson.find({ rating: { $gt: 0 } })
        .populate({
        path: "user",
        select: "name profile"
    }).select("gallery  user rating totalRating lessonTitle duration").sort({ rating: -1 });
    // get all artist id from bookmark;
    const bookmarkId = yield bookmark_model_1.Bookmark.find({}).distinct("artist");
    const bookmarkIdStrings = bookmarkId.map(id => id.toString());
    // Add wish property to each artist if it matches with the bookmark
    const popularArtist = artists.map((item) => {
        var _a;
        const artist = item.toObject();
        const { user } = artist, otherArtist = __rest(artist, ["user"]);
        const isWish = bookmarkIdStrings.includes((_a = artist === null || artist === void 0 ? void 0 : artist.user) === null || _a === void 0 ? void 0 : _a._id.toString());
        const data = Object.assign(Object.assign({}, user), { lesson: Object.assign({}, otherArtist), wish: isWish });
        return data;
    });
    return popularArtist;
});
const artistByCategoryFromDB = (category) => __awaiter(void 0, void 0, void 0, function* () {
    const artists = yield lesson_model_1.Lesson.find({ genre: category })
        .populate({
        path: "user",
        select: "name profile"
    }).select("gallery title user rating totalRating").sort({ rating: -1 });
    // Add wish property to each artist if it matches with the bookmark
    const popularArtist = artists.map((item) => {
        const artist = item.toObject();
        const { user } = artist, otherArtist = __rest(artist, ["user"]);
        const data = Object.assign(Object.assign({}, user), { lesson: Object.assign({}, otherArtist) });
        return data;
    });
    return popularArtist;
});
const availableArtistFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    // Get IDs of artist who have made a booking
    const bookedArtistIds = yield booking_model_1.Booking.distinct("artist");
    console.log(bookedArtistIds);
    // Find users who are not in the list of bookedArtistIds
    const availableArtists = yield user_model_1.User.find({ _id: { $nin: bookedArtistIds }, role: "ARTIST" })
        .populate({
        path: "lesson",
        select: "gallery rating totalRating lessonTitle duration"
    })
        .select("name profile lesson");
    // get all artist id from bookmark;
    const bookmarkId = yield bookmark_model_1.Bookmark.find({}).distinct("artist");
    const bookmarkIdStrings = bookmarkId.map(id => id.toString());
    // Add wish property to each artist if it matches with the bookmark
    const availableArtist = availableArtists.map((item) => {
        const artist = item.toObject();
        const { lesson } = artist, otherData = __rest(artist, ["lesson"]);
        const isWish = bookmarkIdStrings.includes(artist === null || artist === void 0 ? void 0 : artist._id.toString());
        const data = Object.assign(Object.assign({}, otherData), { lesson: lesson || {}, wish: isWish });
        return data;
    });
    return availableArtist;
});
// artist list
const artistListFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { search, rating } = query, filerData = __rest(query, ["search", "rating"]);
    const anyConditions = [];
    // Artist search handling
    if (search && typeof search === "string" && search.trim().length > 0) {
        anyConditions.push({
            $or: ["title", "lessonTitle", "genre", "instrument"].map((field) => ({
                [field]: {
                    $regex: new RegExp(search, "i")
                }
            }))
        });
    }
    // artist filter here
    if (Object.keys(filerData).length) {
        anyConditions.push({
            $and: Object.entries(filerData).map(([field, value]) => ({
                [field]: value
            }))
        });
    }
    //artist filter with price range
    if (rating) {
        anyConditions.push({
            rating: {
                $gte: rating,
                $lt: rating + 1
            },
        });
    }
    const whereConditions = anyConditions.length > 0 ? { $and: anyConditions } : {};
    // Find users who are not in the list of bookedArtistIds
    const results = yield lesson_model_1.Lesson.find(whereConditions)
        .populate({
        path: "user",
        select: "name profile"
    })
        .select("rating totalRating gallery title");
    // Add wish property to each artist if it matches with the bookmark
    const availableArtist = results.map((item) => {
        const artist = item.toObject();
        const { user } = artist, otherData = __rest(artist, ["user"]);
        const data = Object.assign(Object.assign({}, user), { lesson: Object.assign({}, otherData) });
        return data;
    });
    return availableArtist;
});
exports.ArtistService = {
    artistProfileFromDB,
    popularArtistFromDB,
    artistByCategoryFromDB,
    availableArtistFromDB,
    artistListFromDB
};
