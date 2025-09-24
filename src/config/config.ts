import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT,
  mongoUri: process.env.DB_STRING,
  jwtSecret: process.env.JWT_SECRET || " ",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",
  nodeEnv: process.env.NODE_ENV 
};
