// middleware/auth.middleware.ts
import { NextFunction, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "../config/config";
import constants from "../utils/constants";
import logger from "../utils/logger";
import { errorResponse } from "../utils/response";
import UserModel from "../model/auth.model";
import { asyncHandler } from "../utils/async.handler";
import { IUser, URequest } from "../interfaces/user.interface";
import { verifyToken } from "../utils/jwt.util";


export const validateToken = asyncHandler(
  async (req: URequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      logger.warn("Unauthorized request: No token provided");
      return errorResponse(res, "No token provided, authorization denied!", constants.UNAUTHORIIZE);
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = verifyToken(token) as JwtPayload;

      if (!decoded || !decoded._id) {
        logger.warn("Unauthorized request: Invalid token payload");
        return errorResponse(res, "Invalid token payload", constants.UNAUTHORIIZE);
      }

      const user = await UserModel.findById(decoded._id);
      if (!user) {
        return errorResponse(res, "User not found, authorization denied!", constants.UNAUTHORIIZE);
      }

      req.user = user as IUser;
      logger.info(`User authenticated: ${user.email}`);
      next();
      
    } catch (err: any) {
      logger.error(`JWT verification failed: ${err.message}`);
      return errorResponse(res, "Invalid or expired token", constants.UNAUTHORIIZE);
    }
  }
);
