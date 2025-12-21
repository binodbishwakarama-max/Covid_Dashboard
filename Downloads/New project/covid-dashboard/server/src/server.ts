import app from './app';
import { config } from './config/env';

const server = app.listen(config.port, () => {
    console.log(`
    ################################################
    🛡️  Server listening on port: ${config.port} 🛡️
    ################################################
    `);
});

process.on('unhandledRejection', (reason: Error | any) => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(reason.name, reason.message);
    server.close(() => {
        process.exit(1);
    });
});

process.on('uncaughtException', (error: Error) => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.log(error.name, error.message);
    process.exit(1);
});
