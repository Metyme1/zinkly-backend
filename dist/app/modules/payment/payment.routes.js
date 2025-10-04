"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const fileUploadHandler_1 = __importDefault(require("../../middlewares/fileUploadHandler"));
const user_1 = require("../../../enums/user");
const payment_controller_1 = require("./payment.controller");
const router = express_1.default.Router();
router.post('/create-payment-intent', (0, auth_1.default)(user_1.USER_ROLES.USER), (0, fileUploadHandler_1.default)(), payment_controller_1.PaymentController.createPaymentIntentToStripe);
router.post('/create-account', (0, auth_1.default)(user_1.USER_ROLES.ARTIST), (0, fileUploadHandler_1.default)(), payment_controller_1.PaymentController.createAccountToStripe);
// router.post(
//   "/webhook",
//   express.raw({ type: "application/json" }),
//   PaymentController.stripeWebhook
// );
// router.patch("/transfer-payouts/:id", auth(USER_ROLES.USER), PaymentController.transferAndPayoutToArtist);
exports.PaymentRoutes = router;
