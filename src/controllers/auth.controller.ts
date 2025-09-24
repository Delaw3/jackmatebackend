import { NextFunction, Request, Response } from "express";
import logger from "../utils/logger";

// Your sign-up logic here
export const signUpUser = async (req: Request, res: Response, next: NextFunction) => {
    res.status(201).json({ message: "User signed up successfully" });
}