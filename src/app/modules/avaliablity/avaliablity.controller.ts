// availability.controller.ts
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { AvailabilityService } from './avaliablity.service';

const setAvailability = catchAsync(async (req: Request, res: Response) => {
  const artistId = req.user.id; // must be ARTIST role
  const { date, slots } = req.body;

  const result = await AvailabilityService.setAvailability(
    artistId,
    date,
    slots
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Availability saved successfully',
    data: result,
  });
});
const getAvailability = catchAsync(async (req: Request, res: Response) => {
  const { artistId, date } = req.query;

  const result = await AvailabilityService.getAvailability(
    artistId as string,
    date as string
  );

  console.log(
    '[AVAILABILITY] artistId:',
    artistId,
    'date:',
    date,
    'result:',
    JSON.stringify(result, null, 2)
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Availability fetched successfully',
    data: result || [],
  });
});

export const AvailabilityController = {
  setAvailability,
  getAvailability,
};
