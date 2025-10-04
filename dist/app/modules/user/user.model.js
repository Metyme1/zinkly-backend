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
exports.User = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_status_codes_1 = require("http-status-codes");
const mongoose_1 = require("mongoose");
const config_1 = __importDefault(require("../../../config"));
const user_1 = require("../../../enums/user");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: false },
    appId: { type: String, required: false },
    role: {
        type: String,
        enum: Object.values(user_1.USER_ROLES),
        required: true,
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
    },
    contact: {
        type: String,
        default: '',
    },
    password: {
        type: String,
        select: 0,
        minlength: 8,
    },
    location: {
        type: String,
        default: '',
    },
    gender: {
        type: String,
        default: '',
    },
    profile: {
        type: String,
        default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGh5WFH8TOIfRKxUrIgJZoDCs1yvQ4hIcppw&s',
    },
    status: {
        type: String,
        enum: ['active', 'delete'],
        default: 'active',
    },
    verified: {
        type: Boolean,
        default: false,
    },
    lesson: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Lesson',
        required: false,
    },
    authentication: {
        type: {
            isResetPassword: {
                type: Boolean,
                default: false,
            },
            oneTimeCode: {
                type: Number,
                default: null,
            },
            expireAt: {
                type: Date,
                default: null,
            },
        },
        select: 0,
    },
    accountInformation: {
        status: {
            type: Boolean,
            default: false,
        },
        stripeAccountId: {
            type: String,
        },
        externalAccountId: {
            type: String,
        },
        accountUrl: {
            type: String,
        },
        currency: {
            type: String,
        },
    },
}, { timestamps: true });
//exist user check
userSchema.statics.isExistUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield exports.User.findById(id);
    return isExist;
});
//account check
userSchema.statics.isAccountCreated = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield exports.User.findById(id);
    return isUserExist.accountInformation.status;
});
userSchema.statics.isExistUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield exports.User.findOne({ email });
    return isExist;
});
//is match password
userSchema.statics.isMatchPassword = (password, hashPassword) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcrypt_1.default.compare(password, hashPassword);
});
//check user
userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        //check user
        if (this.email) {
            const isExist = yield exports.User.findOne({ email: this.email });
            if (isExist) {
                throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Email already exist!');
            }
        }
        //password hash
        if (this.password) {
            this.password = yield bcrypt_1.default.hash(this.password, Number(config_1.default.bcrypt_salt_rounds));
        }
        next();
    });
});
exports.User = (0, mongoose_1.model)('User', userSchema);
