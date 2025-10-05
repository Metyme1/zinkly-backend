import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import Stripe from 'stripe';
import config from '../../../config';
import { Booking } from '../booking/booking.model';
import { User } from '../user/user.model';
import unlinkFile from '../../../shared/unlinkFile';
import { JwtPayload } from 'jsonwebtoken';
const fs = require('fs');

// Stripe instance
const stripe = new Stripe(config.stripe_api_secret as string);

// ---------------- CREATE PAYMENT INTENT ----------------const stripe = new Stripe(config.stripe_api_secret as string);

// ---------------- CREATE PAYMENT INTENT ----------------
const createPaymentIntentToStripe = async (user: JwtPayload, payload: any) => {
  const { price, musicianStripeAccountId } = payload;

  if (typeof price !== 'number' || price <= 0) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid price amount');
  }
  if (!musicianStripeAccountId) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Musician account ID required');
  }

  const amount = Math.trunc(price * 100);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Music Lesson',
          },
          unit_amount: amount,
        },
        quantity: 1,
      },
    ],
    customer_email: user?.email,
    payment_intent_data: {
      application_fee_amount: Math.round(amount * 0.1), // 10% fee for platform
      transfer_data: {
        destination: musicianStripeAccountId,
      },
    },
    success_url: 'http://192.168.43.238:5000/success',
    cancel_url: 'http://192.168.43.238:5000/cancel',
  });

  if (!session) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Failed to create Payment Checkout'
    );
  }

  const date = new Date();
  const txid =
    'Txid' +
    date.getTime() +
    date.getDate() +
    date.getMonth() +
    date.getFullYear();

  return { txid, url: session?.url };
};

// ---------------- CREATE EXPRESS ACCOUNT ----------------
const createExpressAccount = async (user: JwtPayload) => {
  // Ensure user exists in DB
  const dbUser: any = await User.findById(user.id);
  if (!dbUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  // Create a new Stripe Express account
  const account = await stripe.accounts.create({
    type: 'express',
    country: 'US', // or dynamic, e.g., dbUser.country
    capabilities: {
      transfers: { requested: true },
    },
  });

  // Save accountId in DB
  await User.findByIdAndUpdate(dbUser._id, {
    $set: { 'accountInformation.stripeAccountId': account.id },
  });

  const accountLink = await stripe.accountLinks.create({
    account: account.id,
    refresh_url: 'https://168.231.65.180:5000/reauth',
    return_url: 'https://168.231.65.180:5000/return',
    type: 'account_onboarding',
  });

  return accountLink;
};

const verifyStripeAccountStatus = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user || !user.accountInformation?.stripeAccountId) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Stripe account not found');
  }

  const account = await stripe.accounts.retrieve(
    user.accountInformation.stripeAccountId
  );

  // Check if the account is active
  const isActive = account.charges_enabled && account.payouts_enabled;

  await User.findByIdAndUpdate(userId, {
    $set: {
      'accountInformation.status': isActive,
      'accountInformation.detailsSubmitted': account.details_submitted,
      'accountInformation.chargesEnabled': account.charges_enabled,
      'accountInformation.payoutsEnabled': account.payouts_enabled,
    },
  });

  return {
    isActive,
    account,
  };
};
// ---------------- CREATE CONNECTED ACCOUNT ----------------
const createAccountToStripe = async (payload: any) => {
  const { user } = payload;

  // user check
  const isExistUser: any = await User.findById(user.id);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Artist doesn't exist!");
  }

  // already has account?
  if (await User.isAccountCreated(user.id)) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Your account already exists, please skip this step'
    );
  }

  // ✅ Create Express account
  const account = await stripe.accounts.create({
    type: 'express',
    country: 'US', // or detect dynamically
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
  });

  // ✅ Create onboarding link
  const accountLink = await stripe.accountLinks.create({
    account: account.id,
    refresh_url: 'https://192.168.43.238:5000/reauth',
    return_url: 'https://192.168.43.238:5000/return',
    type: 'account_onboarding',
  });

  // Save Stripe account ID to user
  await User.findByIdAndUpdate(
    isExistUser._id,
    {
      $set: {
        'accountInformation.stripeAccountId': account.id,
        'accountInformation.status': false,
        'accountInformation.accountUrl': accountLink.url,
      },
    },
    { new: true }
  );

  return accountLink;
};

//

export const PaymentService = {
  createPaymentIntentToStripe,
  createAccountToStripe,
  createExpressAccount,
  verifyStripeAccountStatus,
};

// ---------------- TRANSFER AND PAYOUT ----------------
// const transferAndPayoutToArtist = async (id: string) => {
//   const isExistBooking: any = await Booking.findById(id);
//   if (!isExistBooking) {
//     throw new ApiError(StatusCodes.BAD_REQUEST, "Booking doesn't exist!");
//   }

//   const artist = isExistBooking.artist as unknown as string;
//   const isExistArtist = await User.isAccountCreated(artist);
//   if (!isExistArtist) {
//     throw new ApiError(
//       StatusCodes.BAD_REQUEST,
//       'You have not provided bank info. Please create a bank account'
//     );
//   }

//   if (isExistBooking.status === 'Complete') {
//     throw new ApiError(
//       StatusCodes.BAD_REQUEST,
//       'Payment already transferred to your account.'
//     );
//   }

//   const { stripeAccountId, externalAccountId } =
//     isExistArtist.accountInformation;
//   const { price } = isExistBooking;

//   const charge = (parseInt(price.toString()) * 10) / 100;
//   const amount = parseInt(price.toString()) - charge;

//   const transfer = await stripe.transfers.create({
//     amount: amount * 100,
//     currency: 'usd',
//     destination: stripeAccountId,
//   });

//   const payouts = await stripe.payouts.create(
//     {
//       amount: amount * 100,
//       currency: 'usd',
//       destination: externalAccountId,
//     },
//     {
//       stripeAccount: stripeAccountId,
//     }
//   );

//   if (transfer.id && payouts.id) {
//     await Booking.findByIdAndUpdate(
//       { _id: id },
//       { status: 'Complete' },
//       { new: true }
//     );
//   }

//   return;
// };
// // ---------------- CREATE CONNECTED ACCOUNT ----------------
// const createAccountToStripe = async (payload: any) => {
//   const { user, bodyData, files } = payload;

//   // user check
//   const isExistUser: any = await User.findById(user.id);
//   if (!isExistUser) {
//     throw new ApiError(StatusCodes.BAD_REQUEST, "Artist doesn't exist!");
//   }

//   // already has account?
//   if (await User.isAccountCreated(user.id)) {
//     throw new ApiError(
//       StatusCodes.BAD_REQUEST,
//       'Your account already exists, please skip this step'
//     );
//   }

//   // need 2 files
//   if (!files || files?.length < 2) {
//     files?.forEach((element: any) => {
//       const removeFileFromUploads = `/docs/${element.filename}`;
//       unlinkFile(removeFileFromUploads);
//     });
//     throw new ApiError(StatusCodes.BAD_REQUEST, 'Two KYC files are required!');
//   }

//   const { dateOfBirth, phoneNumber, address, bank_info, business_profile } =
//     bodyData;
//   const dob = new Date(dateOfBirth);

//   if (
//     !dateOfBirth ||
//     !phoneNumber ||
//     !address ||
//     !bank_info ||
//     !business_profile
//   ) {
//     throw new ApiError(
//       StatusCodes.BAD_REQUEST,
//       'Please provide date of birth, phone, address, bank info and business profile'
//     );
//   }

//   // upload front & back files
//   const frontFilePart = await stripe.files.create({
//     purpose: 'identity_document',
//     file: {
//       data: fs.readFileSync(files[0].path),
//       name: files[0].filename,
//       type: files[0].mimetype,
//     },
//   });

//   const backFilePart = await stripe.files.create({
//     purpose: 'identity_document',
//     file: {
//       data: fs.readFileSync(files[1].path), // ✅ FIXED
//       name: files[1].filename,
//       type: files[1].mimetype,
//     },
//   });

//   // create connected account directly
//   const account: any = await stripe.accounts.create({
//     type: 'express',
//     country: bank_info.country || 'US', // ✅ dynamic
//     business_type: 'individual',
//     capabilities: {
//       card_payments: { requested: true },
//       transfers: { requested: true },
//     },
//     individual: {
//       dob: {
//         day: dob.getDate(),
//         month: dob.getMonth() + 1,
//         year: dob.getFullYear(),
//       },
//       first_name: isExistUser?.name?.split(' ')[0],
//       last_name: isExistUser?.name?.split(' ')[1] || 'dummy Last Name',
//       email: isExistUser?.email,
//       phone: phoneNumber,
//       address: {
//         city: address.city,
//         country: address.country,
//         line1: address.line1,
//         postal_code: address.postal_code,
//       },
//       verification: {
//         document: {
//           front: frontFilePart.id,
//           back: backFilePart.id,
//         },
//       },
//     },
//     external_account: {
//       object: 'bank_account',
//       account_holder_name: bank_info.account_holder_name,
//       account_holder_type: bank_info.account_holder_type,
//       account_number: bank_info.account_number,
//       country: bank_info.country || 'US',
//       currency: bank_info.currency || 'usd',
//       routing_number: bank_info.routing_number,
//     },
//     business_profile: {
//       mcc: '5970',
//       name: business_profile.business_name || isExistUser?.firstName,
//       url: business_profile.website || 'https://yourdomain.com',
//     },
//   });

//   // save account info
//   if (account.id && account.external_accounts?.data?.length) {
//     await User.findByIdAndUpdate(
//       isExistUser._id,
//       {
//         $set: {
//           'accountInformation.stripeAccountId': account.id,
//           'accountInformation.externalAccountId':
//             account.external_accounts?.data[0].id,
//           'accountInformation.status': true,
//           'accountInformation.accountUrl':
//             account.external_accounts?.data[0].id,
//           bank_account: bank_info.account_number,
//         },
//       },
//       { new: true }
//     );
//   }

//   // create onboarding link
//   const accountLink = await stripe.accountLinks.create({
//     account: account.id,
//     refresh_url: 'http://192.168.43.238:5000/reauth', // ✅ update with your frontend
//     return_url: 'http://192.168.43.238:5000/return', // ✅ update with your frontend
//     type: 'account_onboarding',
//     collect: 'eventually_due',
//   });

//   if (accountLink?.url) {
//     await User.findByIdAndUpdate(
//       isExistUser._id,
//       {
//         $set: {
//           'accountInformation.accountUrl': accountLink?.url,
//         },
//       },
//       { new: true }
//     );
//   }

//   return accountLink;
// };
