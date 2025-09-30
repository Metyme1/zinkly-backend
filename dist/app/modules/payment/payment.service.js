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
exports.PaymentService = void 0;
const http_status_codes_1 = require("http-status-codes");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const stripe_1 = __importDefault(require("stripe"));
const config_1 = __importDefault(require("../../../config"));
const booking_model_1 = require("../booking/booking.model");
const user_model_1 = require("../user/user.model");
const unlinkFile_1 = __importDefault(require("../../../shared/unlinkFile"));
const fs = require("fs");
//create stripe instance
const stripe = new stripe_1.default(config_1.default.stripe_api_secret);
// create payment intent;
const createPaymentIntentToStripe = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { price } = payload;
    if (typeof price !== "number" || price <= 0) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Invalid price amount");
    }
    // Stripe expects amounts in cents
    const amount = Math.trunc(price * 100);
    // Create a checkout session
    const session = yield stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment", // Use "subscription" if you're setting up recurring payments
        line_items: [
            {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: "E-learning Subscription", // Replace with your product/service name
                    },
                    unit_amount: amount,
                },
                quantity: 1,
            },
        ],
        customer_email: user === null || user === void 0 ? void 0 : user.email,
        success_url: "http://192.168.10.102:6001/api/v1/success", // URL to redirect upon successful payment
        cancel_url: "http://192.168.10.102:6001/api/v1/errors", // URL to redirect upon cancellation
    });
    if (!session) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Failed to create Payment Checkout");
    }
    const date = new Date();
    const txid = "Txid" + date.getTime() + date.getDate() + date.getMonth() + date.getFullYear();
    return { txid, url: session === null || session === void 0 ? void 0 : session.url };
});
// create account
const createAccountToStripe = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    const { user, bodyData, files } = payload;
    //user check
    const isExistUser = yield user_model_1.User.findById(user.id);
    if (!isExistUser) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Artist does't exist!");
    }
    //check already account exist;
    if (yield user_model_1.User.isAccountCreated(user.id)) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Your account already exist,Please skip this");
    }
    if (!files || (files === null || files === void 0 ? void 0 : files.length) < 2) {
        files === null || files === void 0 ? void 0 : files.forEach((element) => {
            const removeFileFromUploads = `/docs/${element.filename}`;
            (0, unlinkFile_1.default)(removeFileFromUploads);
        });
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Two kyc files are required!");
    }
    const { dateOfBirth, phoneNumber, address, bank_info, business_profile } = bodyData;
    const dob = new Date(dateOfBirth);
    if (!dateOfBirth && !phoneNumber && !address && !bank_info && !business_profile) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Please provide the required information: date of birth, phone number, address, bank information, and business profile.");
    }
    //process of kyc
    const frontFilePart = yield stripe.files.create({
        purpose: "identity_document",
        file: {
            data: fs.readFileSync(files[0].path),
            name: files[0].filename,
            type: files[0].mimetype,
        }
    });
    const backFilePart = yield stripe.files.create({
        purpose: "identity_document",
        file: {
            data: fs.readFileSync(files[0].path),
            name: files[0].filename,
            type: files[0].mimetype,
        }
    });
    //create token
    const token = yield stripe.tokens.create({
        account: {
            individual: {
                dob: {
                    day: dob.getDate(),
                    month: dob.getMonth() + 1,
                    year: dob.getFullYear(),
                },
                first_name: (_a = isExistUser === null || isExistUser === void 0 ? void 0 : isExistUser.name) === null || _a === void 0 ? void 0 : _a.split(" ")[0],
                last_name: ((_b = isExistUser === null || isExistUser === void 0 ? void 0 : isExistUser.name) === null || _b === void 0 ? void 0 : _b.split(" ")[1]) || "dummy Last Name",
                email: isExistUser === null || isExistUser === void 0 ? void 0 : isExistUser.email,
                phone: phoneNumber,
                address: {
                    city: address.city,
                    country: address.country,
                    line1: address.line1,
                    postal_code: address.postal_code,
                },
                verification: {
                    document: {
                        front: frontFilePart.id,
                        back: backFilePart.id,
                    },
                },
            },
            business_type: "individual",
            tos_shown_and_accepted: true,
        }
    });
    //account created
    const account = yield stripe.accounts.create({
        type: "custom",
        account_token: token.id,
        capabilities: {
            card_payments: { requested: true },
            transfers: { requested: true },
        },
        business_profile: {
            mcc: "5970",
            name: business_profile.business_name || (isExistUser === null || isExistUser === void 0 ? void 0 : isExistUser.firstName),
            url: business_profile.website || "www.example.com",
        },
        external_account: {
            object: "bank_account",
            account_holder_name: bank_info.account_holder_name,
            account_holder_type: bank_info.account_holder_type,
            account_number: bank_info.account_number,
            country: "US",
            currency: "usd",
            routing_number: bank_info.routing_number
        }
    });
    //save to the DB
    if (account.id && ((_d = (_c = account.external_accounts) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.length)) {
        yield user_model_1.User.findByIdAndUpdate(isExistUser._id, {
            $set: {
                "accountInformation.stripeAccountId": account.id,
                "accountInformation.externalAccountId": (_e = account.external_accounts) === null || _e === void 0 ? void 0 : _e.data[0].id,
                "accountInformation.status": true,
                "accountInformation.accountUrl": (_f = account.external_accounts) === null || _f === void 0 ? void 0 : _f.data[0].id,
                "bank_account": bank_info.account_number
            }
        }, { new: true });
    }
    // Create account link for onboarding
    const accountLink = yield stripe.accountLinks.create({
        account: account.id,
        refresh_url: "https://example.com/reauth",
        return_url: "https://example.com/return",
        type: "account_onboarding",
        collect: "eventually_due",
    });
    if (accountLink === null || accountLink === void 0 ? void 0 : accountLink.url) {
        yield user_model_1.User.findByIdAndUpdate(isExistUser._id, {
            $set: {
                "accountInformation.accountUrl": accountLink === null || accountLink === void 0 ? void 0 : accountLink.url
            }
        }, { new: true });
    }
    return accountLink;
});
// transfer and payout credit
const transferAndPayoutToArtist = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistBooking = yield booking_model_1.Booking.findById(id);
    if (!isExistBooking) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Booking doesn't exist!");
    }
    //check bank account
    const artist = isExistBooking.artist;
    const isExistArtist = yield user_model_1.User.isAccountCreated(artist);
    if (!isExistArtist) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Sorry, you are didn't provide bank information. Please create a bank account");
    }
    //check completed payment and artist transfer
    if (isExistBooking.status === "Complete") {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "The payment has already been transferred to your account.");
    }
    const { stripeAccountId, externalAccountId } = isExistArtist.accountInformation;
    const { price } = isExistBooking;
    const charge = (parseInt(price.toString()) * 10) / 100;
    const amount = parseInt(price.toString()) - charge;
    const transfer = yield stripe.transfers.create({
        amount: amount * 100,
        currency: "usd",
        destination: stripeAccountId,
    });
    const payouts = yield stripe.payouts.create({
        amount: amount * 100,
        currency: "usd",
        destination: externalAccountId,
    }, {
        stripeAccount: stripeAccountId,
    });
    if (transfer.id && payouts.id) {
        yield booking_model_1.Booking.findByIdAndUpdate({ _id: id }, { status: "Complete" }, { new: true });
    }
    return;
});
exports.PaymentService = {
    createPaymentIntentToStripe,
    createAccountToStripe,
    transferAndPayoutToArtist
};
