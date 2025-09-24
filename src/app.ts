import express from "express";
import cors from "cors";
import helmet from "helmet";
import morganLogger from "./utils/morgan.logger";
import { globalRateLimiter, loginLimiter } from "./utils/rate.limiter";
import authRoutes from "./router/auth.route";



export const createApp = () => {
  const app = express();

  // Middleware
  app.use(express.json());
  app.use(cors());
  app.use(helmet());

  // Morgan + Winston
  app.use(morganLogger);
  app.use( loginLimiter, globalRateLimiter );

  // Routes
  app.use("/api/auth", authRoutes);




  return app;
};
