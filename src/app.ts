import express, { type Express, type Request, type Response} from 'express';
import "dotenv/config";
import morgan from 'morgan';
import logger from './config/logger.js';
import userRoutes from './routes/user.routes.js';
import flightRoutes from './routes/flight.routes.js';
import bookingRoutes from './routes/booking.routes.js';



const app: Express = express();

app.use(express.json());


app.use(morgan('combined', {
    stream: {
        write: (message) => logger.info(message.trim()),
    },
}));


app.use('/api/users', userRoutes);
app.use('/api/flights', flightRoutes);
app.use('/api/bookings', bookingRoutes);



app.get('/healthcheck', (req: Request, res: Response) => {
    res.status(200).send('Server is healthy');
});


export default app;