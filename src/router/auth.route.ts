import { signUpUser } from "../controllers/auth.controller";

const route = require("express").Router();

route.post("/signup", signUpUser);

export default route;