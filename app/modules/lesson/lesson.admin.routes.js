"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LessonAdminRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_1 = require("../../../enums/user");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const lesson_admin_controller_1 = require("./lesson.admin.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const lesson_validation_1 = require("./lesson.validation");
const router = express_1.default.Router();
router.patch('/move-lesson/:id', (0, auth_1.default)(user_1.USER_ROLES.ADMIN), (0, validateRequest_1.default)(lesson_validation_1.LessonValidation.moveLessonZodSchema), lesson_admin_controller_1.LessonAdminController.moveLesson);
router.post('/create-lesson', (0, auth_1.default)(user_1.USER_ROLES.ADMIN), (0, validateRequest_1.default)(lesson_validation_1.LessonValidation.createLessonZodSchema), lesson_admin_controller_1.LessonAdminController.createLessonByAdmin);
router.patch('/update-lesson/:id', (0, auth_1.default)(user_1.USER_ROLES.ADMIN), lesson_admin_controller_1.LessonAdminController.updateLessonByAdmin);
exports.LessonAdminRoutes = router;
