import { signInUser, signUpUser } from "../controllers/auth.controller";
import { validate } from "../middleware/validate";
import { loginLimiter } from "../utils/rate.limiter";
import { loginSchema, signupSchema } from "../validators/auth.schema";

const route = require("express").Router();

route.post("/signup", validate(signupSchema), signUpUser);
route.post("/signin", validate(loginSchema), loginLimiter, signInUser);

export default route;