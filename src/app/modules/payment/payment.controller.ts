// import { Request, Response } from 'express';
// import catchAsync from '../../../shared/catchAsync';
// import { PaymentService } from './payment.service';
// import sendResponse from '../../../shared/sendResponse';
// import { StatusCodes } from 'http-status-codes';

// const createPaymentIntentToStripe = catchAsync(
//   async (req: Request, res: Response) => {
//     const payload = req.body;
//     const result = await PaymentService.createPaymentIntentToStripe(
//       req.user,
//       payload
//     );
//     sendResponse(res, {
//       statusCode: StatusCodes.OK,
//       success: true,
//       message: 'Payment Intent Created Successfully',
//       data: result,
//     });
//   }
// );

// const createAccountToStripe = catchAsync(
//   async (req: Request, res: Response) => {
//     const user = req.user;
//     const bodyData = JSON.parse(req.body?.data);
//     const files = (req?.files as any)?.KYC;

//     const payload = {
//       user,
//       bodyData,
//       files,
//     };
//     const result = await PaymentService.createAccountToStripe(payload);
//     sendResponse(res, {
//       statusCode: StatusCodes.OK,
//       success: true,
//       message: 'Connected account created successfully',
//       data: result,
//     });
//   }
// );

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

// export const PaymentController = {
//   createPaymentIntentToStripe,
//   createAccountToStripe,
//   transferAndPayoutToArtist,
// };

import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { PaymentService } from './payment.service';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import Stripe from 'stripe';
import config from '../../../config/index';

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

    // ✅ Call the updated account creation service
    const { accountLink, verification } =
      await PaymentService.createAccountToStripe(user);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Express account onboarding link created successfully',
      data: {
        url: accountLink.url, // ✅ return actual Stripe onboarding link
        verification,
      },
    });
  }
);
const verifyAccountStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentService.verifyStripeAccountStatus(req.user.id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: result.isActive
      ? 'Stripe account verified and active.'
      : 'Stripe account incomplete or not verified yet.',
    data: result.account,
  });
});
const transferAndPayoutToArtist = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await PaymentService.transferAndPayoutToArtist(id);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Booking Has Completed',
      data: result,
    });
  }
);
const stripe = new Stripe(config.stripe_api_secret as string, {
  apiVersion: '2024-06-20',
});

const stripeWebhookHandler = catchAsync(async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];

  let event: Stripe.Event;

  try {
    // Use raw body because Stripe signs the payload
    event = stripe.webhooks.constructEvent(
      req.body,
      sig as string,
      config.stripe_webhook_secret as string
    );
  } catch (err: any) {
    console.error(`⚠️ Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // ✅ Handle Stripe events
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      await PaymentService.handleCheckoutCompleted(session);
      break;
    }

    case 'account.updated': {
      const account = event.data.object as Stripe.Account;
      await PaymentService.handleAccountUpdated(account);
      break;
    }

    case 'payout.paid': {
      const payout = event.data.object as Stripe.Payout;
      await PaymentService.handlePayoutPaid(payout);
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.status(200).json({ received: true });
});

// Temporary controller function for force-linking
const forceLink = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentService.forceLinkStripeAccount();
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Account force-linked successfully!',
    data: result,
  });
});

export const PaymentController = {
  createPaymentIntentToStripe,
  createAccountToStripe,
  verifyAccountStatus,
  stripeWebhookHandler,
  transferAndPayoutToArtist,
  forceLink, // Temporarily export the new function
};
