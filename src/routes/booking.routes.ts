import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { createBookingHandler } from '../controllers/booking.controller.js';

const router = Router();

router.post('/', protect, createBookingHandler);

export default router;