import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

export const errorHandler = (err: Error | AppError, req: Request, res: Response, next: NextFunction) => {
    let error: AppError;

    if (err instanceof AppError) {
        error = err;
    } else {
        error = new AppError('Internal Server Error', 500);
        // Log the original error for debugging
        console.error('Unexpected Error:', err);
    }

    // In production, we don't want to leak error details
    if (process.env.NODE_ENV === 'production' && !error.isOperational) {
        error.message = 'Something went wrong!';
    }

    res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    });
};
