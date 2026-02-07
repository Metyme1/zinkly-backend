"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuleService = void 0;
const http_status_codes_1 = require("http-status-codes");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const rule_model_1 = require("./rule.model");
//terms and conditions
const createTermsAndConditionToDB = async (payload) => {
    const isExistTerms = await rule_model_1.Rule.findOne({ type: 'terms' });
    if (isExistTerms) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Terms and conditions already exist!');
    }
    else {
        const result = await rule_model_1.Rule.create({ ...payload, type: 'terms' });
        return result;
    }
};
const getTermsAndConditionFromDB = async () => {
    const result = await rule_model_1.Rule.findOne({ type: 'terms' });
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Terms and conditions doesn't  exist!");
    }
    return result;
};
const updateTermsAndConditionToDB = async (payload) => {
    const isExistTerms = await rule_model_1.Rule.findOne({ type: 'terms' });
    if (!isExistTerms) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Terms and conditions doesn't  exist!");
    }
    const result = await rule_model_1.Rule.findOneAndUpdate({ type: 'terms' }, payload, {
        new: true,
    });
    return result;
};
//disclaimer
const createDisclaimerToDB = async (payload) => {
    const isExistDisclaimer = await rule_model_1.Rule.findOne({ type: 'disclaimer' });
    if (isExistDisclaimer) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Disclaimer already exist!');
    }
    else {
        const result = await rule_model_1.Rule.create({ ...payload, type: 'disclaimer' });
        return result;
    }
};
const getDisclaimerFromDB = async () => {
    const result = await rule_model_1.Rule.findOne({ type: 'disclaimer' });
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Disclaimer doesn't exist!");
    }
    return result;
};
const updateDisclaimerToDB = async (payload) => {
    const isExistDisclaimer = await rule_model_1.Rule.findOne({ type: 'disclaimer' });
    if (!isExistDisclaimer) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Disclaimer doesn't exist!");
    }
    const result = await rule_model_1.Rule.findOneAndUpdate({ type: 'disclaimer' }, payload, {
        new: true,
    });
    return result;
};
exports.RuleService = {
    createDisclaimerToDB,
    getDisclaimerFromDB,
    updateDisclaimerToDB,
    createTermsAndConditionToDB,
    getTermsAndConditionFromDB,
    updateTermsAndConditionToDB
};
