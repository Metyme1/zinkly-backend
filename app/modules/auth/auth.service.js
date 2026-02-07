"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_status_codes_1 = require("http-status-codes");
const config_1 = __importDefault(require("../../../config"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const emailHelper_1 = require("../../../helpers/emailHelper");
const jwtHelper_1 = require("../../../helpers/jwtHelper");
const emailTemplate_1 = require("../../../shared/emailTemplate");
const cryptoToken_1 = __importDefault(require("../../../util/cryptoToken"));
const generateOTP_1 = __importDefault(require("../../../util/generateOTP"));
const resetToken_model_1 = require("../resetToken/resetToken.model");
const user_model_1 = require("../user/user.model");
//login
const loginUserFromDB = async (payload) => {
    const { email, password } = payload;
    const isExistUser = await user_model_1.User.findOne({ email }).select('+password');
    if (!isExistUser) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User doesn't exist!");
    }
    //check verified and status
    if (!isExistUser.verified) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Please verify your account, then try to login again');
    }
    //check user status
    if (isExistUser.status === 'delete') {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'You don’t have permission to access this content.It looks like your account has been deactivated.');
    }
    //check match password
    if (password &&
        !(await user_model_1.User.isMatchPassword(password, isExistUser.password))) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Password is incorrect!');
    }
    //create token
    const createToken = jwtHelper_1.jwtHelper.createToken({ id: isExistUser._id, role: isExistUser.role, email: isExistUser.email }, config_1.default.jwt.jwt_secret, 86400);
    //Create refresh token
    const refreshToken = jwtHelper_1.jwtHelper.createToken({ id: isExistUser._id, role: isExistUser.role, email: isExistUser.email }, config_1.default.jwt.refresh_secret, 31536000);
    return { token: createToken, role: isExistUser?.role, refreshToken };
};
//forget password
const forgetPasswordToDB = async (email) => {
    const isExistUser = await user_model_1.User.isExistUserByEmail(email);
    if (!isExistUser) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User doesn't exist!");
    }
    //send mail
    const otp = (0, generateOTP_1.default)();
    const value = {
        otp,
        email: isExistUser.email,
    };
    const forgetPassword = emailTemplate_1.emailTemplate.resetPassword(value);
    emailHelper_1.emailHelper.sendEmail(forgetPassword);
    //save to DB
    const authentication = {
        oneTimeCode: otp,
        expireAt: new Date(Date.now() + 3 * 60000),
    };
    await user_model_1.User.findOneAndUpdate({ email }, { $set: { authentication } });
};
//verify email
const verifyEmailToDB = async (payload) => {
    const { email, oneTimeCode } = payload;
    const isExistUser = await user_model_1.User.findOne({ email }).select('+authentication');
    if (!isExistUser) {
        return { success: false, message: "User doesn't exist!" };
    }
    if (!oneTimeCode) {
        return {
            success: false,
            message: 'Please provide the OTP, check your email.',
        };
    }
    if (isExistUser.authentication?.oneTimeCode !== oneTimeCode) {
        return { success: false, message: 'Invalid OTP' };
    }
    const date = new Date();
    if (date > isExistUser.authentication?.expireAt) {
        return { success: false, message: 'OTP already expired, please try again' };
    }
    let message;
    let data;
    if (!isExistUser.verified) {
        await user_model_1.User.findOneAndUpdate({ _id: isExistUser._id }, { verified: true, authentication: { oneTimeCode: null, expireAt: null } });
        message = 'Email verified successfully';
    }
    else {
        await user_model_1.User.findOneAndUpdate({ _id: isExistUser._id }, {
            authentication: {
                isResetPassword: true,
                oneTimeCode: null,
                expireAt: null,
            },
        });
        const createToken = (0, cryptoToken_1.default)();
        await resetToken_model_1.ResetToken.create({
            user: isExistUser._id,
            token: createToken,
            expireAt: new Date(Date.now() + 5 * 60000),
        });
        message = 'Verification successful. Use this code for password reset.';
        data = createToken;
    }
    return { success: true, message, data };
};
//forget password
const resetPasswordToDB = async (token, payload) => {
    const { newPassword, confirmPassword } = payload;
    //isExist token
    const isExistToken = await resetToken_model_1.ResetToken.isExistToken(token);
    if (!isExistToken) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'You are not authorized');
    }
    //user permission check
    const isExistUser = await user_model_1.User.findById(isExistToken.user).select('+authentication');
    if (!isExistUser?.authentication?.isResetPassword) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "You don't have permission to change the password. Please click again to 'Forgot Password'");
    }
    //validity check
    const isValid = await resetToken_model_1.ResetToken.isExpireToken(token);
    if (!isValid) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Token expired, Please click again to the forget password');
    }
    //check password
    if (newPassword !== confirmPassword) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "New password and Confirm password doesn't match!");
    }
    const hashPassword = await bcrypt_1.default.hash(newPassword, Number(config_1.default.bcrypt_salt_rounds));
    const updateData = {
        password: hashPassword,
        authentication: {
            isResetPassword: false,
        },
    };
    await user_model_1.User.findOneAndUpdate({ _id: isExistToken.user }, updateData, {
        new: true,
    });
};
// const changePasswordToDB = async (
//   user: JwtPayload,
//   payload: IChangePassword
// ) => {
//   const { currentPassword, newPassword, confirmPassword } = payload;
//   const isExistUser = await User.findById(user.id).select('+password');
//   if (!isExistUser) {
//     throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
//   }
//   //current password match
//   if (
//     currentPassword &&
//     (await !User.isMatchPassword(currentPassword, isExistUser.password))
//   ) {
//     throw new ApiError(StatusCodes.BAD_REQUEST, 'Password is incorrect');
//   }
//   //newPassword and current password
//   if (currentPassword === newPassword) {
//     throw new ApiError(
//       StatusCodes.BAD_REQUEST,
//       'Please give different password from current password'
//     );
//   }
//   //new password and confirm password check
//   if (newPassword !== confirmPassword) {
//     throw new ApiError(
//       StatusCodes.BAD_REQUEST,
//       "Password and Confirm password doesn't matched"
//     );
//   }
//   //hash password
//   const hashPassword = await bcrypt.hash(
//     newPassword,
//     Number(config.bcrypt_salt_rounds)
//   );
//   const updateData = {
//     password: hashPassword,
//   };
//   await User.findOneAndUpdate({ _id: user.id }, updateData, { new: true });
// };
const changePasswordToDB = async (user, payload) => {
    const { currentPassword, newPassword, confirmPassword } = payload;
    const isExistUser = await user_model_1.User.findById(user.id).select('+password');
    if (!isExistUser) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User doesn't exist!");
    }
    // ✅ current password match
    const isMatch = await user_model_1.User.isMatchPassword(currentPassword, isExistUser.password);
    if (!isMatch) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Current password is incorrect');
    }
    // newPassword and current password
    if (currentPassword === newPassword) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Please give a different password from current password');
    }
    // new password and confirm password check
    if (newPassword !== confirmPassword) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Password and Confirm password don't match");
    }
    // hash password
    const hashPassword = await bcrypt_1.default.hash(newPassword, Number(config_1.default.bcrypt_salt_rounds));
    await user_model_1.User.findOneAndUpdate({ _id: user.id }, { password: hashPassword }, { new: true });
};
const issueNewAccessToken = async (token) => {
    // Check if the token is provided
    if (!token) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Token is required!');
    }
    //verify token
    const verifyUser = jwtHelper_1.jwtHelper.verifyToken(token, config_1.default.jwt.refresh_secret);
    // Check if a user with the provided email exists in the database
    const existingUser = await user_model_1.User.findById(verifyUser?.id);
    // Handle case where no User is found
    if (!existingUser) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, `User Not found`);
    }
    // If the user is blocked, throw a FORBIDDEN error.
    if (!existingUser?.verified) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'User account is Not Verified!');
    }
    //create token
    const accessToken = jwtHelper_1.jwtHelper.createToken({
        id: existingUser._id,
        role: existingUser.role,
        email: existingUser.email,
    }, config_1.default.jwt.jwt_secret, 86400);
    return accessToken;
};
// social authentication
const socialLoginFromDB = async (payload) => {
    const { appId, role, email } = payload;
    const isExistUser = await user_model_1.User.findOne({ appId });
    if (isExistUser) {
        //create token
        const accessToken = jwtHelper_1.jwtHelper.createToken({ id: isExistUser._id, role: isExistUser.role, email: isExistUser.email }, config_1.default.jwt.jwt_secret, 86400);
        //create token
        const refreshToken = jwtHelper_1.jwtHelper.createToken({ id: isExistUser._id, role: isExistUser.role, email: isExistUser.email }, config_1.default.jwt.jwt_secret, 31536000);
        return { token: accessToken, role: isExistUser.role, refreshToken };
    }
    else {
        // Workaround for unique index on email. Generate a placeholder if email is null.
        const userEmail = email ? email : `${appId}@apple-placeholder.com`;
        const user = await user_model_1.User.create({
            appId,
            role,
            email: userEmail,
            verified: true,
            name: role.toLowerCase() + Math.floor(1000 + Math.random() * 9000),
        });
        if (!user) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Failed to created User');
        }
        //create token
        const accessToken = jwtHelper_1.jwtHelper.createToken({ id: user._id, role: user.role, email: user.email }, config_1.default.jwt.jwt_secret, 86400);
        //create token
        const refreshToken = jwtHelper_1.jwtHelper.createToken({ id: user._id, role: user.role, email: user.email }, config_1.default.jwt.jwt_secret, 31536000);
        return { token: accessToken, role: user.role, refreshToken };
    }
};
exports.AuthService = {
    verifyEmailToDB,
    loginUserFromDB,
    forgetPasswordToDB,
    resetPasswordToDB,
    changePasswordToDB,
    issueNewAccessToken,
    socialLoginFromDB,
};
