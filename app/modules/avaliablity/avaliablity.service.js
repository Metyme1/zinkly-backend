"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvailabilityService = void 0;
const avaliablity_model_1 = require("./avaliablity.model");
const normalizeDate = (date) => {
    return new Date(date.split('T')[0]);
};
const setAvailability = async (artistId, date, slots) => {
    const normalizedDate = normalizeDate(date);
    return await avaliablity_model_1.Availability.findOneAndUpdate({
        artist: artistId,
        date: normalizedDate,
    }, {
        artist: artistId,
        date: normalizedDate,
        slots,
    }, { new: true, upsert: true });
};
const getAvailability = async (artistId, date) => {
    const normalizedDate = normalizeDate(date);
    return await avaliablity_model_1.Availability.findOne({
        artist: artistId,
        date: normalizedDate,
    });
};
exports.AvailabilityService = {
    setAvailability,
    getAvailability,
};
