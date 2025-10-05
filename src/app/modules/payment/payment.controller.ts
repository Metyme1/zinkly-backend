import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { PaymentService } from './payment.service';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';

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
    const bodyData = JSON.parse(req.body?.data);
    const files = (req?.files as any)?.KYC;

    const payload = {
      user,
      bodyData,
      files,
    };
    const result = await PaymentService.createAccountToStripe(payload);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Connected account created successfully',
      data: result,
    });
  }
);

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

export const PaymentController = {
  createPaymentIntentToStripe,
  createAccountToStripe,
  transferAndPayoutToArtist,
};

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

//     // ✅ Call the Express account creation service (no bodyData/files needed)
//     const result = await PaymentService.createExpressAccount(user);

//     sendResponse(res, {
//       statusCode: StatusCodes.OK,
//       success: true,
//       message: 'Express account onboarding link created successfully',
//       data: {
//         url: result.url, // ✅ return actual Stripe onboarding link
//       },
//     });
//   }
// );
// const verifyAccountStatus = catchAsync(async (req: Request, res: Response) => {
//   const result = await PaymentService.verifyStripeAccountStatus(req.user.id);

//   sendResponse(res, {
//     statusCode: StatusCodes.OK,
//     success: true,
//     message: result.isActive
//       ? 'Stripe account verified and active.'
//       : 'Stripe account incomplete or not verified yet.',
//     data: result.account,
//   });
// });

// export const PaymentController = {
//   createPaymentIntentToStripe,
//   createAccountToStripe,
//   verifyAccountStatus,

//   //transferAndPayoutToArtist,
// };
