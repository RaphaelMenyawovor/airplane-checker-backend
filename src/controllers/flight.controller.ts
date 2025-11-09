import type { Request, Response } from 'express';
import { PrismaClient } from '../generated/prisma/client.js';
import type { CreateFlightInput } from './flight.schema.js';
import logger from '../config/logger.js';

const prisma = new PrismaClient();

export const createFlightHandler = async (
    req: Request<{}, {}, CreateFlightInput>,
    res: Response
) => {
    try {
        const flight = await prisma.flight.create({
            data: req.body,
        });
        res.status(201).json(flight);
    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};



export const getAllFlightsHandler = async (req: Request, res: Response) => {
    try {
        const flights = await prisma.flight.findMany();
        res.status(200).json(flights);
    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};