import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/async.handler";
import { authService } from "../services/auth.service";
import { successResponse } from "../utils/response";
import { IUser } from "../interfaces/user.interface";

// Your sign-up logic here
export const signUpUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const data = { email, password } as IUser;
    const user = await authService.signUp(data);
    successResponse(res, "User registered successfully", user, 201);
   
})

export const signInUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const data = { email, password } as IUser;
    const token = await authService.signIn(data);
    return successResponse(res, "User signed in successfully", { token }, 200);
})

export const forgetPassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    await authService.forgetPassword(email);
    return successResponse(res, "Password reset OTP sent to email. You can check your spam folder if you don't see it in your inbox.", {}, 200);
})

export const verifyOtp = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { otp } = req.body;
    const token = await authService.verifyOtp(otp);
    return successResponse(res, "OTP verified successfully", {token}, 200);

})

export const resetPassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { resetToken, newPassword } = req.body;
    await authService.resetPassword(resetToken, newPassword);
    return successResponse(res, "Password reset successful", {}, 200);

})