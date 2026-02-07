import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { LessonAdminController } from './lesson.admin.controller';
import validateRequest from '../../middlewares/validateRequest';
import { LessonValidation } from './lesson.validation';

const router = express.Router();

router.patch(
  '/move-lesson/:id',
  auth(USER_ROLES.ADMIN),
  validateRequest(LessonValidation.moveLessonZodSchema),
  LessonAdminController.moveLesson
);

router.post(
  '/create-lesson',
  auth(USER_ROLES.ADMIN),
  validateRequest(LessonValidation.createLessonZodSchema),
  LessonAdminController.createLessonByAdmin
);

router.patch(
  '/update-lesson/:id',
  auth(USER_ROLES.ADMIN),
  LessonAdminController.updateLessonByAdmin
);

export const LessonAdminRoutes = router;
