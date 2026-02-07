"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enums/user");
const payment_controller_1 = require("./payment.controller");
const router = express_1.default.Router();
router.post('/create-payment-intent', (0, auth_1.default)(user_1.USER_ROLES.USER), 
//fileUploadHandler(),
payment_controller_1.PaymentController.createPaymentIntentToStripe);
router.post('/create-account', (0, auth_1.default)(user_1.USER_ROLES.ARTIST), 
//fileUploadHandler(),
payment_controller_1.PaymentController.createAccountToStripe);
router.patch('/transfer-payouts/:id', (0, auth_1.default)(user_1.USER_ROLES.USER), payment_controller_1.PaymentController.transferAndPayoutToArtist);
router.post('/webhook', express_1.default.raw({ type: 'application/json' }), payment_controller_1.PaymentController.stripeWebhookHandler);
router.get('/verify-account', (0, auth_1.default)(user_1.USER_ROLES.ARTIST), payment_controller_1.PaymentController.verifyAccountStatus);
// Temporary route for force-linking
router.get('/force-link', payment_controller_1.PaymentController.forceLink);
exports.PaymentRoutes = router;
// router.patch("/transfer-payouts/:id", auth(USER_ROLES.USER), PaymentController.transferAndPayoutToArtist);
