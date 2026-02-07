"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const auth_service_1 = require("./auth.service");
// const verifyEmail = catchAsync(async (req: Request, res: Response) => {
//   const { ...verifyData } = req.body;
//   const result = await AuthService.verifyEmailToDB(verifyData);
//   sendResponse(res, {
//     success: true,
//     statusCode: StatusCodes.OK,
//     message: result.message,
//     data: result.data,
//   });
// });
const verifyEmail = (0, catchAsync_1.default)(async (req, res) => {
    const result = await auth_service_1.AuthService.verifyEmailToDB(req.body);
    (0, sendResponse_1.default)(res, {
        success: result.success,
        statusCode: result.success ? http_status_codes_1.StatusCodes.OK : http_status_codes_1.StatusCodes.BAD_REQUEST,
        message: result.message,
        data: result.data || null,
    });
});
const loginUser = (0, catchAsync_1.default)(async (req, res) => {
    const { ...loginData } = req.body;
    const result = await auth_service_1.AuthService.loginUserFromDB(loginData);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'User login successfully',
        data: result,
    });
});
const forgetPassword = (0, catchAsync_1.default)(async (req, res) => {
    const email = req.body.email;
    const result = await auth_service_1.AuthService.forgetPasswordToDB(email);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Please check your email, we send a OTP!',
        data: result,
    });
});
const resetPassword = (0, catchAsync_1.default)(async (req, res) => {
    const token = req.headers.authorization;
    const { ...resetData } = req.body;
    const result = await auth_service_1.AuthService.resetPasswordToDB(token, resetData);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Password reset successfully',
        data: result,
    });
});
const changePassword = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    const { ...passwordData } = req.body;
    await auth_service_1.AuthService.changePasswordToDB(user, passwordData);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Password changed successfully',
    });
});
const issueNewAccess = (0, catchAsync_1.default)(async (req, res) => {
    const { token } = req.body;
    const result = await auth_service_1.AuthService.issueNewAccessToken(token);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Access token Retrieved successfully',
        data: result,
    });
});
const socialLogin = (0, catchAsync_1.default)(async (req, res) => {
    const result = await auth_service_1.AuthService.socialLoginFromDB(req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Logged in Successfully',
        data: result,
    });
});
exports.AuthController = {
    verifyEmail,
    loginUser,
    forgetPassword,
    resetPassword,
    changePassword,
    issueNewAccess,
    socialLogin,
    testAccess: (0, catchAsync_1.default)(async (req, res) => {
        (0, sendResponse_1.default)(res, {
            success: true,
            statusCode: http_status_codes_1.StatusCodes.OK,
            message: 'Access test successful!',
            data: null,
        });
    }),
};
