import type mongoose from 'mongoose';
import type { TErrorSources, TGenericErrorResponse } from './handleZodError.js';

const handleCastError = (
  err: mongoose.Error.CastError
): TGenericErrorResponse => {
  const errorSources: TErrorSources = [
    {
      path: err.path,
      message: err.message,
    },
  ];

  const statusCode = 400;

  return {
    statusCode,
    message: 'Invalid ID format',
    errorSources,
  };
};

export default handleCastError;
