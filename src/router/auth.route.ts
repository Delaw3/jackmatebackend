import { forgetPassword, resetPassword, signInUser, signUpUser, verifyOtp } from "../controllers/auth.controller";
import { validate } from "../middleware/validate";
import { loginLimiter } from "../utils/rate.limiter";
import { forgetPasswordSchema, loginSchema, resetPasswordSchema, signupSchema, verifyOtpSchema } from "../validators/schema";

const route = require("express").Router();

route.post("/signup", validate(signupSchema), signUpUser);
route.post("/signin", validate(loginSchema), loginLimiter, signInUser);
route.post("/forget-password", validate(forgetPasswordSchema), forgetPassword);
route.post("/verify-otp", validate(verifyOtpSchema), verifyOtp);
route.post("/reset-password", validate(resetPasswordSchema), resetPassword);

export default route;