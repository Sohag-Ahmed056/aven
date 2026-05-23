import { Server } from 'http';
import app from './app.js';
import { connectDB, disconnectDB } from './app/utils/db.js';
import config from './config/index.js';

async function bootstrap() {
    let server: Server;
    const port = config.port || 5000;

    try {
        // Connect to MongoDB Database
        await connectDB();

        // Start the server
        server = app.listen(port, () => {
            console.log(`🚀 Server is running on http://localhost:${port}`);
        });

        // Function to gracefully shut down the server
        const exitHandler = async () => {
            console.log('Received termination signal. Shutting down gracefully...');
            if (server) {
                server.close(async () => {
                    console.log('HTTP Server closed.');
                    await disconnectDB();
                    process.exit(0);
                });
            } else {
                await disconnectDB();
                process.exit(0);
            }
        };

        // Handle termination signals
        process.on('SIGTERM', exitHandler);
        process.on('SIGINT', exitHandler);

        // Handle unhandled promise rejections
        process.on('unhandledRejection', (error) => {
            console.error('Unhandled Rejection detected:', error);
            if (server) {
                server.close(() => {
                    disconnectDB().finally(() => process.exit(1));
                });
            } else {
                disconnectDB().finally(() => process.exit(1));
            }
        });
    } catch (error) {
        console.error('Error during server startup:', error);
        process.exit(1);
    }
}

bootstrap();