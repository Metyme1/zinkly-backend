"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvailabilityRoutes = void 0;
// availability.routes.ts
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enums/user");
const avaliablity_controller_1 = require("./avaliablity.controller");
const router = express_1.default.Router();
// Musician sets availability
router.post('/set', (0, auth_1.default)(user_1.USER_ROLES.ARTIST), avaliablity_controller_1.AvailabilityController.setAvailability);
// Client fetches availability
router.get('/get', avaliablity_controller_1.AvailabilityController.getAvailability);
exports.AvailabilityRoutes = router;
