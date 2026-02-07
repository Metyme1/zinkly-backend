"use strict";
// import { Request, Response } from 'express';
// import catchAsync from '../../../shared/catchAsync';
// import { PaymentService } from './payment.service';
// import sendResponse from '../../../shared/sendResponse';
// import { StatusCodes } from 'http-status-codes';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const payment_service_1 = require("./payment.service");
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_codes_1 = require("http-status-codes");
const stripe_1 = __importDefault(require("stripe"));
const index_1 = __importDefault(require("../../../config/index"));
const createPaymentIntentToStripe = (0, catchAsync_1.default)(async (req, res) => {
    const payload = req.body;
    const result = await payment_service_1.PaymentService.createPaymentIntentToStripe(req.user, payload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Payment Intent Created Successfully',
        data: result,
    });
});
const createAccountToStripe = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    // ✅ Call the updated account creation service
    const { accountLink, verification } = await payment_service_1.PaymentService.createAccountToStripe(user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Express account onboarding link created successfully',
        data: {
            url: accountLink.url, // ✅ return actual Stripe onboarding link
            verification,
        },
    });
});
const verifyAccountStatus = (0, catchAsync_1.default)(async (req, res) => {
    const result = await payment_service_1.PaymentService.verifyStripeAccountStatus(req.user.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: result.isActive
            ? 'Stripe account verified and active.'
            : 'Stripe account incomplete or not verified yet.',
        data: result.account,
    });
});
const transferAndPayoutToArtist = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    const result = await payment_service_1.PaymentService.transferAndPayoutToArtist(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Booking Has Completed',
        data: result,
    });
});
const stripe = new stripe_1.default(index_1.default.stripe_api_secret, {
    apiVersion: '2024-06-20',
});
const stripeWebhookHandler = (0, catchAsync_1.default)(async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;
    try {
        // Use raw body because Stripe signs the payload
        event = stripe.webhooks.constructEvent(req.body, sig, index_1.default.stripe_webhook_secret);
    }
    catch (err) {
        console.error(`⚠️ Webhook signature verification failed: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    // ✅ Handle Stripe events
    switch (event.type) {
        case 'checkout.session.completed': {
            const session = event.data.object;
            await payment_service_1.PaymentService.handleCheckoutCompleted(session);
            break;
        }
        case 'account.updated': {
            const account = event.data.object;
            await payment_service_1.PaymentService.handleAccountUpdated(account);
            break;
        }
        case 'payout.paid': {
            const payout = event.data.object;
            await payment_service_1.PaymentService.handlePayoutPaid(payout);
            break;
        }
        default:
            console.log(`Unhandled event type: ${event.type}`);
    }
    res.status(200).json({ received: true });
});
// Temporary controller function for force-linking
const forceLink = (0, catchAsync_1.default)(async (req, res) => {
    const result = await payment_service_1.PaymentService.forceLinkStripeAccount();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Account force-linked successfully!',
        data: result,
    });
});
exports.PaymentController = {
    createPaymentIntentToStripe,
    createAccountToStripe,
    verifyAccountStatus,
    stripeWebhookHandler,
    transferAndPayoutToArtist,
    forceLink, // Temporarily export the new function
};
