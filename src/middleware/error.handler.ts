import { NextFunction, Request, Response } from "express";
import logger from "../utils/logger";
import constants from "../utils/constants";
import { errorResponse } from "../utils/response";

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //  prioritize err.statusCode over res.statusCode
  const statusCode =
    err.statusCode && Number.isInteger(err.statusCode)
      ? err.statusCode
      : res.statusCode !== 200
      ? res.statusCode
      : 500;

  //  log error
  logger.error(err.stack || err.message);

  switch (statusCode) {
    case constants.VALIDATION_ERROR:
      return errorResponse(res, err.message || "Validation error", statusCode);

    case constants.UNAUTHORIIZE:
      return errorResponse(res, err.message || "Unauthorized", statusCode);

    case constants.FORBIDDEN:
      return errorResponse(res, err.message || "Forbidden", statusCode);

    case constants.NOT_FOUND:
      return errorResponse(res, err.message || "Not found", statusCode);

    case constants.UNPROCESSABLE_ENTITY:
      return errorResponse(
        res,
        err.message || "Unprocessable Entity",
        statusCode
      );

    default:
      return errorResponse(
        res,
        err.message || "Internal Server Error",
        statusCode
      );
  }
};

export default errorHandler;
