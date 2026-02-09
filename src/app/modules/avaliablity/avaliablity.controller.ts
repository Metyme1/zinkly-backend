// availability.controller.ts
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { AvailabilityService } from './avaliablity.service';
import { Booking } from '../booking/booking.model'; // ✅ make sure path matches your project

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

  // 1. Get base availability slots (from Availability collection)
  const baseSlots = await AvailabilityService.getAvailability(
    artistId as string,
    date as string
  );

  if (!baseSlots) {
    return sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'No availability found',
      data: [],
    });
  }

  // 2. Merge availability slots with booking info
  const slotsWithStatus = await Promise.all(
    baseSlots.slots.map(async (slot: any) => {
      const booking = await Booking.findOne({
        artist: artistId,
        booking_date: date, // ✅ use your schema field (watch snake/camel case!)
        booking_time: slot.time,
      }).populate('users', 'name profile');

      if (booking) {
        return {
          time: slot.time,
          isBooked: !booking.allowMultiple, // 🔑 only block if allowMultiple = false
          allowMultiple: booking.allowMultiple || false,
          users: booking.users || [],
        };
      }

      return {
        time: slot.time,
        isBooked: false,
        allowMultiple: false,
        users: [],
      };
    })
  );

  console.log(
    '[AVAILABILITY] artistId:',
    artistId,
    'date:',
    date,
    'slots:',
    JSON.stringify(slotsWithStatus, null, 2)
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Availability fetched successfully',
    data: slotsWithStatus,
  });
});

export const AvailabilityController = {
  setAvailability,
  getAvailability,
};
