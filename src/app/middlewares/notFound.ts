import type { Request, Response } from 'express';
import httpStatus from 'http-status';

const notFound = (req: Request, res: Response) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'API route not found!',
    errorSources: [
      {
        path: req.originalUrl,
        message: `Route not found for method ${req.method}`,
      },
    ],
  });
};

export default notFound;
