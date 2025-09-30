"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_1 = require("../../../enums/user");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const review_controller_1 = require("./review.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const review_validation_1 = require("./review.validation");
const router = express_1.default.Router();
router.post("/:id", (0, auth_1.default)(user_1.USER_ROLES.USER), (0, validateRequest_1.default)(review_validation_1.ReviewValidation.createReviewZodSchema), review_controller_1.ReviewController.createReview);
router.get("/:id", (0, auth_1.default)(user_1.USER_ROLES.USER, user_1.USER_ROLES.ARTIST), review_controller_1.ReviewController.getReview);
exports.ReviewRoutes = router;
