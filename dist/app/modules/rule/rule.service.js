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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuleService = void 0;
const http_status_codes_1 = require("http-status-codes");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const rule_model_1 = require("./rule.model");
//terms and conditions
const createTermsAndConditionToDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistTerms = yield rule_model_1.Rule.findOne({ type: 'terms' });
    if (isExistTerms) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Terms and conditions already exist!');
    }
    else {
        const result = yield rule_model_1.Rule.create(Object.assign(Object.assign({}, payload), { type: 'terms' }));
        return result;
    }
});
const getTermsAndConditionFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield rule_model_1.Rule.findOne({ type: 'terms' });
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Terms and conditions doesn't  exist!");
    }
    return result;
});
const updateTermsAndConditionToDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistTerms = yield rule_model_1.Rule.findOne({ type: 'terms' });
    if (!isExistTerms) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Terms and conditions doesn't  exist!");
    }
    const result = yield rule_model_1.Rule.findOneAndUpdate({ type: 'terms' }, payload, {
        new: true,
    });
    return result;
});
//disclaimer
const createDisclaimerToDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistDisclaimer = yield rule_model_1.Rule.findOne({ type: 'disclaimer' });
    if (isExistDisclaimer) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Disclaimer already exist!');
    }
    else {
        const result = yield rule_model_1.Rule.create(Object.assign(Object.assign({}, payload), { type: 'disclaimer' }));
        return result;
    }
});
const getDisclaimerFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield rule_model_1.Rule.findOne({ type: 'disclaimer' });
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Disclaimer doesn't exist!");
    }
    return result;
});
const updateDisclaimerToDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistDisclaimer = yield rule_model_1.Rule.findOne({ type: 'disclaimer' });
    if (!isExistDisclaimer) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Disclaimer doesn't exist!");
    }
    const result = yield rule_model_1.Rule.findOneAndUpdate({ type: 'disclaimer' }, payload, {
        new: true,
    });
    return result;
});
exports.RuleService = {
    createDisclaimerToDB,
    getDisclaimerFromDB,
    updateDisclaimerToDB,
    createTermsAndConditionToDB,
    getTermsAndConditionFromDB,
    updateTermsAndConditionToDB
};
