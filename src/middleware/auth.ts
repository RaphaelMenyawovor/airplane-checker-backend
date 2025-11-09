// src/middleware/auth.ts
import type { Request, Response, NextFunction } from 'express';
import jwt, { type JwtPayload } from 'jsonwebtoken';

export const protect = (req: Request, res: Response, next: NextFunction) => {

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1]; 

    interface JwtPayload {
        userId: number;
        email: string;
        isAdmin: boolean;
    }

    try {

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: 'Internal server error: JWT secret not configured' });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET 
        ) as JwtPayload;

        req.user = {
        userId: decoded.userId,
        email: decoded.email,
        isAdmin: decoded.isAdmin,
        };

        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};



export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.isAdmin) {
        return res.status(403).json({ message: 'Forbidden: Access is restricted to administrators' });
    }
    next();
};