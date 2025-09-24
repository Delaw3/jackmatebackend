import { signUpUser } from "../controllers/auth.controller";
import { validate } from "../middleware/validate";
import { loginLimiter } from "../utils/rate.limiter";
import { signupSchema } from "../validators/auth.schema";

const route = require("express").Router();

route.post("/signup", validate(signupSchema), signUpUser);

export default route;