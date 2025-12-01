import express, { type Express, type Request, type Response} from 'express';
import "dotenv/config";
import morgan from 'morgan';
import logger from './config/logger.js';
import userRoutes from './routes/user.routes.js';
import flightRoutes from './routes/flight.routes.js';
import bookingRoutes from './routes/booking.routes.js';
import { PrismaClient, Prisma } from './generated/prisma/client.js';
const prisma = new PrismaClient();



const app: Express = express();

app.use(express.json());


app.use(morgan('combined', {
    stream: {
        write: (message) => logger.info(message.trim()),
    },
}));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/flights', flightRoutes);
app.use('/api/bookings', bookingRoutes);


// Healthcheck for server and database
app.get('/healthcheck', (req: Request, res: Response) => {
    res.status(200).send('Server is healthy');
});

app.get('/dbcheck', async (req: Request, res: Response) => {
    try {
        // The most lightweight query to check database connection
        await prisma.$queryRaw(Prisma.sql`SELECT 1`);
        res.status(200).send('Database connection is healthy');
    } catch (error) {
        logger.error('Database connection failed:', error);
        res.status(500).send('Database connection failed');
    }
});


export default app;