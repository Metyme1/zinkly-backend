"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuleController = void 0;
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const rule_service_1 = require("./rule.service");
//terms and conditions
const createTermsAndCondition = (0, catchAsync_1.default)(async (req, res) => {
    const { ...termsData } = req.body;
    const result = await rule_service_1.RuleService.createTermsAndConditionToDB(termsData);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Terms and conditions created successfully',
        data: result,
    });
});
const getTermsAndCondition = (0, catchAsync_1.default)(async (req, res) => {
    const result = await rule_service_1.RuleService.getTermsAndConditionFromDB();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Terms and conditions retrieved successfully',
        data: result,
    });
});
const updateTermsAndCondition = (0, catchAsync_1.default)(async (req, res) => {
    const { ...termsData } = req.body;
    const result = await rule_service_1.RuleService.updateTermsAndConditionToDB(termsData);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Terms and conditions updated successfully',
        data: result,
    });
});
//disclaimer
const createDisclaimer = (0, catchAsync_1.default)(async (req, res) => {
    const { ...disclaimerData } = req.body;
    const result = await rule_service_1.RuleService.createDisclaimerToDB(disclaimerData);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Disclaimer created successfully',
        data: result,
    });
});
const getDisclaimer = (0, catchAsync_1.default)(async (req, res) => {
    const result = await rule_service_1.RuleService.getDisclaimerFromDB();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Disclaimer retrieved successfully',
        data: result,
    });
});
const updateDisclaimer = (0, catchAsync_1.default)(async (req, res) => {
    const { ...disclaimerData } = req.body;
    const result = await rule_service_1.RuleService.updateDisclaimerToDB(disclaimerData);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Disclaimer updated successfully',
        data: result,
    });
});
exports.RuleController = {
    createDisclaimer,
    getDisclaimer,
    updateDisclaimer,
    createTermsAndCondition,
    getTermsAndCondition,
    updateTermsAndCondition,
};
