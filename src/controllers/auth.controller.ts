import { NextFunction, Request, Response } from "express";
import logger from "../utils/logger";
import { asyncHandler } from "../utils/async.handler";
import { AuthService } from "../services/auth.service";
import { request } from "http";
import { successResponse } from "../utils/response";
import { IUser } from "../interfaces/user.interface";

// Your sign-up logic here
export const signUpUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    const { email, password } = req.body;
    const data = { email, password } as IUser;

    const authService = new AuthService();
    const user = await authService.signUp(data);

    successResponse(res, "User registered successfully", user, 201);
   
})

export const signInUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const data = { email, password } as IUser;

    const authService = new AuthService();
    const token = await authService.signIn(data);

    return successResponse(res, "User signed in successfully", { token }, 200);
})