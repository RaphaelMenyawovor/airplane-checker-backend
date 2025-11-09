import type { Request, Response } from 'express';
import { PrismaClient } from '../generated/prisma/client.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import type { RegisterUserInput, LoginUserInput } from './user.schema.js';
import logger from '../config/logger.js';


const prisma = new PrismaClient();

export const registerUserHandler = async (
    req: Request<{}, {}, RegisterUserInput>,
    res: Response
) => {
    try {
        const { username, email, password } = req.body;

        // Check if user with the same email already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(409).json({ message: 'User with this email already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword
            }
        });

        const { password: _, ...userWithoutPassword } = newUser;
        return res.status(201).json(userWithoutPassword);

    } catch (error) {
        logger.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};



export const loginUserHandler = async (
    req: Request<{}, {}, LoginUserInput>,
    res: Response
) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email, isAdmin: user.isAdmin }, 
            process.env.JWT_SECRET as string,       
            { expiresIn: '1d' }                      
        );

        return res.status(200).json({
            accessToken: token,
        });

    } catch (error) {
        logger.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};



export const getMeHandler = (req: Request, res: Response) => {
  const user = req.user!;

  res.status(200).json({
    id: user.userId,
    email: user.email,
  });
};