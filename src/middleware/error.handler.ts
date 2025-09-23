import { NextFunction, Request, Response } from "express";
import logger from "../utils/logger";
import constants from "../utils/constants";


const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  switch (statusCode) {
    case constants.VALIDATION_ERROR:
      res.status(statusCode).json({
        title: "Validation error",
        message: err.message,
      });
      break;

    case constants.UNAUTHORIIZE:
      res.status(statusCode).json({
        title: "Unauthorized",
        message: err.message,
      });
      break;

    case constants.FORBIDDEN:
      res.status(statusCode).json({
        title: "Forbidden",
        message: err.message,
      });
      break;

    case constants.NOT_FOUND:
      res.status(statusCode).json({
        title: "Not found",
        message: err.message,
      });
      break;

    case constants.SERVER_ERROR:
      res.status(statusCode).json({
        title: "Server error",
        message: err.message,
      });
      break;

    default:
      logger.error(err.stack || err.message); // ✅ log details
      res.status(500).json({
        title: "An error occurred",
        message: err.message,
      });
      break;
  }
};

export default errorHandler;
