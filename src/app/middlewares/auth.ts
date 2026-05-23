import type { NextFunction, Request, Response } from 'express';
import ApiError from '../error/AppError.js';
import { jwtHelper } from '../helper/jwtHelper.js';
import config from '../../config/index.js';

const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(' ')[1] || req.cookies?.accessToken;

      if (!token) {
        throw new ApiError(401, 'You are not authorized!');
      }

      let verifyUser;
      try {
        verifyUser = jwtHelper.verifyToken(token, config.jwt_secret) as {
          id: string;
          email: string;
          role: string;
        };
      } catch (err) {
        throw new ApiError(401, 'Token is invalid or expired!');
      }

      req.user = verifyUser;

      if (roles.length && !roles.includes(verifyUser.role)) {
        throw new ApiError(403, 'You do not have the required permissions to access this resource!');
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};

export default auth;