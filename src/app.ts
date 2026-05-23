import cookieParser from 'cookie-parser';
import cors from 'cors';
import type { Application, Request, Response } from 'express';
import express from 'express';
import router from './app/routes/index.js';
import globalErrorHandler from './app/middlewares/globalErrorHandler.js';
import notFound from './app/middlewares/notFound.js';

const app: Application = express();

app.use(
  cors({
    origin: true, // Allow all origins for dev/testing, or set a specific origin
    credentials: true,
  })
);

// Parsers
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/v1', router);

app.get('/', (req: Request, res: Response) => {
  res.send({
    message: 'Server is running..',
    uptime: process.uptime().toFixed(2) + ' sec',
    timeStamp: new Date().toISOString(),
  });
});

// Error handling
app.use(globalErrorHandler);
app.use(notFound);

export default app;