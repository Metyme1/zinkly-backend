import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ArtistService } from './artist.service';
import { Lesson } from '../lesson/lesson.model';

const artistProfileFromDB = catchAsync(async (req: Request, res: Response) => {
  const user = req.params.id;
  const result = await ArtistService.artistProfileFromDB(user);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Artist Profile Retrieved Successfully',
    data: result,
  });
});

const popularArtistFromDB = catchAsync(async (req: Request, res: Response) => {
  const result = await ArtistService.popularArtistFromDB();
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Popular Available Artist Retrieved Successfully',
    data: result,
  });
});

const artistByCategoryFromDB = catchAsync(
  async (req: Request, res: Response) => {
    const category = req.params.category;
    const result = await ArtistService.artistByCategoryFromDB(category);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: ' Artist By Category Retrieved Successfully',
      data: result,
    });
  }
);

const availableArtistFromDB = catchAsync(
  async (req: Request, res: Response) => {
    const result = await ArtistService.availableArtistFromDB();
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Available Artist Retrieved Successfully',
      data: result,
    });
  }
);
const artistListFromDB = catchAsync(async (req: Request, res: Response) => {
  const query = req.query; // Get query parameters directly from the request
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
  if (typeof gender === 'string' && gender.toLowerCase() !== 'all') {
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
    const ratingNumber =
      typeof rating === 'string'
        ? Number(rating)
        : Array.isArray(rating)
        ? Number(rating[0])
        : Number(rating);
    if (!isNaN(ratingNumber)) {
      anyConditions.push({
        rating: {
          $gte: ratingNumber,
          $lt: ratingNumber + 1,
        },
      });
    }
  }

  const whereConditions =
    anyConditions.length > 0 ? { $and: anyConditions } : {};

  const results = await Lesson.find(whereConditions)
    .populate({
      path: 'user',
      select: 'name profile email contact',
    })
    .select('rating totalRating gallery title price lessonTitle');

  const availableArtist = results.map((item: { toObject: () => any }) => {
    const artist = item.toObject();
    const { user, ...otherData } = artist;

    return {
      ...user,
      lesson: {
        ...otherData,
      },
    };
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Artist List Retrieved Successfully',
    data: availableArtist,
  });
});

export const ArtistController = {
  artistProfileFromDB,
  popularArtistFromDB,
  artistByCategoryFromDB,
  availableArtistFromDB,
  artistListFromDB,
};
