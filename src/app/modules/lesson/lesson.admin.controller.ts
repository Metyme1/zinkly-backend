import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { LessonService } from './lesson.service';

const moveLesson = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { userId } = req.body;

  const result = await LessonService.moveLesson(id, userId);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Lesson moved successfully',
    data: result,
  });
});

const createLessonByAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await LessonService.createLessonByAdmin(req.body);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Lesson created successfully by admin',
    data: result,
  });
});

const updateLessonByAdmin = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await LessonService.updateLessonByAdmin(id, req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Lesson updated successfully by admin',
    data: result,
  });
});

export const LessonAdminController = {
  moveLesson,
  createLessonByAdmin,
  updateLessonByAdmin,
};
