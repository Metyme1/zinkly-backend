"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const http_status_codes_1 = require("http-status-codes");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const emailHelper_1 = require("../../../helpers/emailHelper");
const emailTemplate_1 = require("../../../shared/emailTemplate");
const unlinkFile_1 = __importDefault(require("../../../shared/unlinkFile"));
const generateOTP_1 = __importDefault(require("../../../util/generateOTP"));
const user_model_1 = require("./user.model");
const node_cron_1 = __importDefault(require("node-cron"));
// Separate cron job logic to delete unverified users
const deleteUnverifiedUsers = async () => {
    const now = new Date();
    const unverifiedUsers = await user_model_1.User.find({
        'authentication.expireAt': { $lt: now },
        verified: false,
    });
    for (const user of unverifiedUsers) {
        await user_model_1.User.findByIdAndDelete(user._id);
    }
};
// Schedule cron job (do this once during server startup)
node_cron_1.default.schedule("*/5 * * * *", deleteUnverifiedUsers);
const createUserToDB = async (payload) => {
    const createUser = await user_model_1.User.create(payload);
    if (!createUser) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Failed to create user');
    }
    //send email
    const otp = (0, generateOTP_1.default)();
    const values = {
        name: createUser.name,
        otp: otp,
        email: createUser.email,
    };
    const createAccountTemplate = emailTemplate_1.emailTemplate.createAccount(values);
    emailHelper_1.emailHelper.sendEmail(createAccountTemplate);
    //save to DB
    const authentication = {
        oneTimeCode: otp,
        expireAt: new Date(Date.now() + 3 * 60000),
    };
    await user_model_1.User.findOneAndUpdate({ _id: createUser._id }, { $set: { authentication } });
    return createUser;
};
const getUserProfileFromDB = async (user) => {
    const { id } = user;
    const isExistUser = await user_model_1.User.findById(id).select("name profile contact accountInformation  role location email");
    if (!isExistUser) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "User doesn't exist!");
    }
    return isExistUser;
};
const updateProfileToDB = async (user, payload) => {
    const { id } = user;
    const isExistUser = await user_model_1.User.isExistUserById(id);
    if (!isExistUser) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User doesn't exist!");
    }
    //unlink file here
    if (payload.profile) {
        (0, unlinkFile_1.default)(isExistUser.profile);
    }
    const updateDoc = await user_model_1.User.findOneAndUpdate({ _id: id }, payload, {
        new: true,
    });
    return updateDoc;
};
// delete user
const deleteUserFromDB = async (user, password) => {
    const isExistUser = await user_model_1.User.findById(user.id).select('+password');
    if (!isExistUser) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User doesn't exist!");
    }
    //check match password
    if (password && !(await user_model_1.User.isMatchPassword(password, isExistUser.password))) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Password is incorrect');
    }
    await user_model_1.User.findByIdAndDelete(user.id);
    return;
};
exports.UserService = {
    createUserToDB,
    getUserProfileFromDB,
    updateProfileToDB,
    deleteUserFromDB
};
