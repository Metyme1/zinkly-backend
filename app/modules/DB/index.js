"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const colors_1 = __importDefault(require("colors"));
const user_model_1 = require("../user/user.model");
const logger_1 = require("../../../shared/logger");
const user_1 = require("../../../enums/user");
const config_1 = __importDefault(require("../../../config"));
const superUser = {
    name: 'Pasqual Alen',
    role: user_1.USER_ROLES.SUPER_ADMIN,
    email: config_1.default.super_admin.email,
    password: config_1.default.super_admin.password,
    verified: true,
};
const seedSuperAdmin = async () => {
    const isExistSuperAdmin = await user_model_1.User.findOne({
        role: user_1.USER_ROLES.SUPER_ADMIN,
    });
    if (!isExistSuperAdmin) {
        await user_model_1.User.create(superUser);
        logger_1.logger.info(colors_1.default.green('✔ Super admin created successfully!'));
    }
};
exports.default = seedSuperAdmin;
