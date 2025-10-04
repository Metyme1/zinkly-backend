"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LessonRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_1 = require("../../../enums/user");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const lesson_controller_1 = require("./lesson.controller");
const lesson_validation_1 = require("./lesson.validation");
const fileUploadHandler_1 = __importDefault(require("../../middlewares/fileUploadHandler"));
const router = express_1.default.Router();
router.post('/create', (0, auth_1.default)(user_1.USER_ROLES.ARTIST), (0, fileUploadHandler_1.default)(), (0, validateRequest_1.default)(lesson_validation_1.LessonValidation.createLessonZodSchema), lesson_controller_1.LessonController.createLesson);
router.patch('/update-lesson', (0, auth_1.default)(user_1.USER_ROLES.ARTIST), (0, fileUploadHandler_1.default)(), lesson_controller_1.LessonController.updateLesson);
exports.LessonRoutes = router;
