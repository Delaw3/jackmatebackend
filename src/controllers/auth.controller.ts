import { NextFunction, Request, Response } from "express";
import logger from "../utils/logger";
import { asyncHandler } from "../utils/async.handler";
import { AuthService } from "../services/auth.service";
import { request } from "http";
import { successResponse } from "../utils/response";

// Your sign-up logic here
export const signUpUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    const { email, password } = req.body;

    const authService = new AuthService();
    const user = await authService.signUp(email, password);
    
    successResponse(res, "User registered successfully", user, 201);
   
})