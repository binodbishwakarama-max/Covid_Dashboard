import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/env';
import apiRoutes from './routes/api';
import { errorHandler } from './middleware/errorHandler';
import { AppError } from './utils/AppError';

const app = express();

// Security Middleware
app.use(helmet());
app.use(cors({
    origin: config.corsOrigin
}));

// Body Parsing
app.use(express.json());

// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Server is healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Routes
app.use('/api', apiRoutes);

// 404 Handler
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handler
app.use(errorHandler);

export default app;
