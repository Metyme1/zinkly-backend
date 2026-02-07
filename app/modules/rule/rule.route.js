"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuleRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_1 = require("../../../enums/user");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const rule_controller_1 = require("./rule.controller");
const router = express_1.default.Router();
//terms and conditions
router
    .route('/terms-and-conditions')
    .post(
// auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
rule_controller_1.RuleController.createTermsAndCondition)
    .patch((0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN, user_1.USER_ROLES.ADMIN), rule_controller_1.RuleController.updateTermsAndCondition)
    .get(
// auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.USER,  USER_ROLES.ARTIST),
rule_controller_1.RuleController.getTermsAndCondition);
//disclaimer
router
    .route('/disclaimer')
    .post(
// auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
rule_controller_1.RuleController.createDisclaimer)
    .patch((0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN, user_1.USER_ROLES.ADMIN), rule_controller_1.RuleController.updateDisclaimer)
    .get(
// auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.USER,  USER_ROLES.ARTIST),
rule_controller_1.RuleController.getDisclaimer);
exports.RuleRoutes = router;
