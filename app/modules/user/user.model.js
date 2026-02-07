"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongoose_1 = require("mongoose");
const config_1 = __importDefault(require("../../../config"));
const user_1 = require("../../../enums/user");
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
// Add a unique index with a partial filter to allow multiple null emails
userSchema.index({ email: 1 }, { unique: true, partialFilterExpression: { email: { $type: 'string' } } });
//exist user check
userSchema.statics.isExistUserById = async (id) => {
    const isExist = await exports.User.findById(id);
    return isExist;
};
//account check
userSchema.statics.isAccountCreated = async (id) => {
    const isUserExist = await exports.User.findById(id);
    return isUserExist.accountInformation.status;
};
userSchema.statics.isExistUserByEmail = async (email) => {
    const isExist = await exports.User.findOne({ email });
    return isExist;
};
//is match password
userSchema.statics.isMatchPassword = async (password, hashPassword) => {
    return await bcrypt_1.default.compare(password, hashPassword);
};
//check user
userSchema.pre('save', async function (next) {
    //password hash
    if (this.password) {
        this.password = await bcrypt_1.default.hash(this.password, Number(config_1.default.bcrypt_salt_rounds));
    }
    next();
});
exports.User = (0, mongoose_1.model)('User', userSchema);
