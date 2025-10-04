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
exports.PaymentController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const payment_service_1 = require("./payment.service");
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_codes_1 = require("http-status-codes");
const createPaymentIntentToStripe = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    const result = yield payment_service_1.PaymentService.createPaymentIntentToStripe(req.user, payload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Payment Intent Created Successfully',
        data: result,
    });
}));
const createAccountToStripe = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    // ✅ Call the Express account creation service (no bodyData/files needed)
    const result = yield payment_service_1.PaymentService.createExpressAccount(user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Express account onboarding link created successfully',
        data: {
            url: result.url, // ✅ return actual Stripe onboarding link
        },
    });
}));
// export const stripeWebhook = async (req: Request, res: Response) => {
//   let event: Stripe.Event;
//   try {
//     // Stripe requires the raw body, not parsed JSON
//     const sig = req.headers['stripe-signature'] as string;
//     event = stripe.webhooks.constructEvent(
//       req.body, // must be raw body
//       sig,
//       config.stripe_webhook_secret as string
//     );
//   } catch (err: any) {
//     console.error('⚠️ Webhook signature verification failed.', err.message);
//     return res.status(400).send(`Webhook Error: ${err.message}`);
//   }
//   // ✅ Handle events
//   switch (event.type) {
//     case 'checkout.session.completed':
//       const session = event.data.object as Stripe.Checkout.Session;
//       console.log('✅ Payment completed for session:', session.id);
//       // 👉 Update your booking or order in DB
//       break;
//     case 'account.updated':
//       const account = event.data.object as Stripe.Account;
//       console.log('✅ Account updated:', account.id);
//       // 👉 Check if requirements are complete and update DB: status = true
//       break;
//     default:
//       console.log(`Unhandled event type ${event.type}`);
//   }
//   res.json({ received: true });
// };
// const transferAndPayoutToArtist = catchAsync(
//   async (req: Request, res: Response) => {
//     const id = req.params.id;
//     const result = await PaymentService.transferAndPayoutToArtist(id);
//     sendResponse(res, {
//       statusCode: StatusCodes.OK,
//       success: true,
//       message: 'Booking Has Completed',
//       data: result,
//     });
//   }
// );
exports.PaymentController = {
    createPaymentIntentToStripe,
    createAccountToStripe,
    // stripeWebhook,
    //transferAndPayoutToArtist,
};
