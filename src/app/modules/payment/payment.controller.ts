import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { PaymentService } from './payment.service';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import Stripe from 'stripe';
import stripe from 'stripe';
import { config } from 'dotenv';

const createPaymentIntentToStripe = catchAsync(
  async (req: Request, res: Response) => {
    const payload = req.body;
    const result = await PaymentService.createPaymentIntentToStripe(
      req.user,
      payload
    );
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Payment Intent Created Successfully',
      data: result,
    });
  }
);
const createAccountToStripe = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.user;

    // ✅ Call the Express account creation service (no bodyData/files needed)
    const result = await PaymentService.createExpressAccount(user);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Express account onboarding link created successfully',
      data: {
        url: result.url, // ✅ return actual Stripe onboarding link
      },
    });
  }
);

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

export const PaymentController = {
  createPaymentIntentToStripe,
  createAccountToStripe,
  // stripeWebhook,
  //transferAndPayoutToArtist,
};
