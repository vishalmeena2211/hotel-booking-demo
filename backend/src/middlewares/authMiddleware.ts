import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface NewAuthRequest extends Request {
    user: {
        id: number;
        name: string;
        email: string;
        role: string;
    };
}

// Middleware to check if the user is authenticated using JWT
export const isAuthenticated = (req: NewAuthRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }
        req.user = decoded as { id: number; name: string; email: string; role: string };
        next();
    });
};

// Middleware to check if the user has USER role
export const isUser = (req: NewAuthRequest, res: Response, next: NextFunction) => {
    if (req.user && req.user.role === 'USER') {
        return next();
    }
    res.status(403).json({ message: 'Forbidden: Requires USER role' });
};

// Middleware to check if the user has HOTEL_MANAGER role
export const isHotelManager = (req: NewAuthRequest, res: Response, next: NextFunction) => {
    if (req.user && req.user.role === 'HOTEL_MANAGER') {
        return next();
    }
    res.status(403).json({ message: 'Forbidden: Requires HOTEL_MANAGER role' });
};

// Middleware to check if the user has ADMIN role
export const isAdmin = (req: NewAuthRequest, res: Response, next: NextFunction) => {
    if (req.user && req.user.role === 'ADMIN') {
        return next();
    }
    res.status(403).json({ message: 'Forbidden: Requires ADMIN role' });
};