import { NextFunction, Request, Response } from "express";
import logger from "../utils/logger";

export const signUpUser = async (req: Request, res: Response, next: NextFunction) => {
    logger.info("Sign-up request received");
}
    // Your sign-up logic here