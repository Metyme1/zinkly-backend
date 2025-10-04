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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvailabilityService = void 0;
const avaliablity_model_1 = require("./avaliablity.model");
const setAvailability = (artistId, date, slots) => __awaiter(void 0, void 0, void 0, function* () {
    return yield avaliablity_model_1.Availability.findOneAndUpdate({ artist: artistId, date }, { artist: artistId, date, slots }, { new: true, upsert: true });
});
const getAvailability = (artistId, date) => __awaiter(void 0, void 0, void 0, function* () {
    return yield avaliablity_model_1.Availability.findOne({ artist: artistId, date });
});
exports.AvailabilityService = {
    setAvailability,
    getAvailability,
};
