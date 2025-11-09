import { z } from 'zod';

export const createFlightSchema = z.object({
    body: z.object({
        flightNumber: z.string(),
        origin: z.string(),
        destination: z.string(),
        departureTime: z.iso.datetime({ precision: 0 }),
        arrivalTime: z.iso.datetime({ precision: 0 }),
    }),
});

export type CreateFlightInput = z.infer<typeof createFlightSchema>['body'];