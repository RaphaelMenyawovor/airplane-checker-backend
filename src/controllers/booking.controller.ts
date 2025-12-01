import type { Request, Response } from 'express';
import { PrismaClient, Prisma } from '../generated/prisma/client.js';
import logger from '../config/logger.js';

const prisma = new PrismaClient();

export const createBookingHandler = async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { flightId } = req.body;

    if (typeof flightId !== 'number') {
        return res.status(400).json({ message: 'Invalid flightId provided' });
    }

    try {
        const flight = await prisma.flight.findUnique({
            where: { id: flightId },
        });

        if (!flight) {
            return res.status(404).json({ message: 'Flight not found' });
        }

        const booking = await prisma.booking.create({
            data: {
                userId: userId,
                flightId: flightId,
            },
        });

        res.status(201).json(booking);
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                return res.status(409).json({ message: 'You have already booked this flight' });    
            }
        }

        logger.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};