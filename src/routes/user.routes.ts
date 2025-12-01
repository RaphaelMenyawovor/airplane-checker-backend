import { Router } from 'express';
import { validate } from '../middleware/validate.js'; 
import { registerUserSchema, loginUserSchema } from '../controllers/user.schema.js'; 
import { registerUserHandler, loginUserHandler, getMeHandler } from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.post('/register', validate(registerUserSchema), registerUserHandler);

router.post('/login', validate(loginUserSchema), loginUserHandler);

router.get('/me', protect, getMeHandler);

export default router;