// availability.routes.ts
import express from 'express';

import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { AvailabilityController } from './avaliablity.controller';

const router = express.Router();

// Musician sets availability
router.post(
  '/set',
  auth(USER_ROLES.ARTIST),
  AvailabilityController.setAvailability
);

// Client fetches availability
router.get('/get', AvailabilityController.getAvailability);

export const AvailabilityRoutes = router;
