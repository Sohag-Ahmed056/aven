import type { TErrorSources, TGenericErrorResponse } from './handleZodError.js';

const handleDuplicateError = (err: any): TGenericErrorResponse => {
  // Extract value within double quotes using regex
  const match = err.message.match(/"([^"]*)"/);
  const extractedMessage = match ? match[1] : '';

  const errorSources: TErrorSources = [
    {
      path: '',
      message: `${extractedMessage} already exists!`,
    },
  ];

  const statusCode = 409;

  return {
    statusCode,
    message: 'Duplicate key error',
    errorSources,
  };
};

export default handleDuplicateError;
