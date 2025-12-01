import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import { protect, isAdmin } from '../middleware/auth.js';
import { createFlightSchema } from '../controllers/flight.schema.js';
import { createFlightHandler, getAllFlightsHandler } from '../controllers/flight.controller.js';

const router = Router();

router.get('/', protect, getAllFlightsHandler);

router.post('/', protect, isAdmin, validate(createFlightSchema), createFlightHandler);

export default router;