import { signUpUser } from "../controllers/auth.controller";
import { loginLimiter } from "../utils/rate.limiter";

const route = require("express").Router();

route.post("/signup", signUpUser, loginLimiter);

export default route;