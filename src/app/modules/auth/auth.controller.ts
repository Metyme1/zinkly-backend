import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { AuthService } from './auth.service';
import { Lesson } from '../lesson/lesson.model';

// const verifyEmail = catchAsync(async (req: Request, res: Response) => {
//   const { ...verifyData } = req.body;
//   const result = await AuthService.verifyEmailToDB(verifyData);

//   sendResponse(res, {
//     success: true,
//     statusCode: StatusCodes.OK,
//     message: result.message,
//     data: result.data,
//   });
// });
const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.verifyEmailToDB(req.body);

  sendResponse(res, {
    success: result.success,
    statusCode: result.success ? StatusCodes.OK : StatusCodes.BAD_REQUEST,
    message: result.message,
    data: result.data || null,
  });
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const { ...loginData } = req.body;
  const result = await AuthService.loginUserFromDB(loginData);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'User login successfully',
    data: result,
  });
});

const forgetPassword = catchAsync(async (req: Request, res: Response) => {
  const email = req.body.email;
  const result = await AuthService.forgetPasswordToDB(email);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Please check your email, we send a OTP!',
    data: result,
  });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers.authorization;
  const { ...resetData } = req.body;
  const result = await AuthService.resetPasswordToDB(token!, resetData);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Password reset successfully',
    data: result,
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const { ...passwordData } = req.body;
  await AuthService.changePasswordToDB(user, passwordData);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Password changed successfully',
  });
});

const issueNewAccess = catchAsync(async (req: Request, res: Response) => {
  const { token } = req.body;
  const result = await AuthService.issueNewAccessToken(token);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Access token Retrieved successfully',
    data: result,
  });
});

const socialLogin = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.socialLoginFromDB(req.body);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Logged in Successfully',
    data: result,
  });
});
const artistListFromDB = async (query: {
  [x: string]: any;
  search: any;
  rating: any;
  gender: any;
}) => {
  const { search, rating, gender, ...filterData } = query;
  const anyConditions = [];

  // Artist search handling
  if (search && typeof search === 'string' && search.trim().length > 0) {
    anyConditions.push({
      $or: ['title', 'lessonTitle', 'genre', 'instrument'].map(field => ({
        [field]: {
          $regex: new RegExp(search, 'i'),
        },
      })),
    });
  }

  // Gender filter
  if (gender && gender.toLowerCase() !== 'all') {
    anyConditions.push({ gender: gender });
  }

  // Other filters
  if (Object.keys(filterData).length) {
    anyConditions.push({
      $and: Object.entries(filterData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  // Rating filter
  if (rating) {
    anyConditions.push({
      rating: {
        $gte: rating,
        $lt: rating + 1,
      },
    });
  }

  const whereConditions =
    anyConditions.length > 0 ? { $and: anyConditions } : {};

  const results = await Lesson.find(whereConditions)
    .populate({
      path: 'user',
      select: 'name profile',
    })
    .select('rating totalRating gallery title');

  const availableArtist = results.map(item => {
    const artist = item.toObject();
    const { user, ...otherData } = artist;

    const data = {
      ...user,
      lesson: {
        ...otherData,
      },
    };
    return data;
  });

  return availableArtist;
};

export const AuthController = {
  verifyEmail,
  loginUser,
  forgetPassword,
  resetPassword,
  changePassword,
  issueNewAccess,
  socialLogin,
  artistListFromDB,
};
