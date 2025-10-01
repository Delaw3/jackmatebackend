import dotenv from "dotenv";


dotenv.config();

export const config = {
  port: process.env.PORT,
  mongoUri: process.env.DB_STRING,
  jwtSecret: process.env.JWT_SECRET || " ",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ,
  nodeEnv: process.env.NODE_ENV,
  redisClientUrl: process.env.UPSTASH_REDIS_REST_URL,
  redisClientToken: process.env.UPSTASH_REDIS_REST_TOKEN,
  redisUrl: process.env.REDIS_URL,
  email: process.env.EMAIL,
  emailPassword: process.env.PASSWORD,
  smtphost: process.env.SMTP_HOST,
  smtpport: process.env.SMTP_PORT,
  universitiesApiUrl: process.env.UNIVERSITIES_API_URL,


};
