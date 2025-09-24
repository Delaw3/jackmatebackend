import express from "express";
import cors from "cors";
import helmet from "helmet";
import morganLogger from "./utils/morgan.logger";
import { globalRateLimiter, loginLimiter } from "./utils/rate.limiter";
import authRoutes from "./router/auth.route";
import errorHandler from "./middleware/error.handler";



export const createApp = () => {
  const app = express();
  

  // Middleware
  app.use(express.json({ limit: "5mb" }));
  app.use(express.urlencoded({ extended: true, limit: "5mb" }));

  app.use(cors());
  app.use(helmet());

  app.set("trust proxy", 1);

  // Morgan + Winston
  app.use(morganLogger);
  // app.use( loginLimiter, globalRateLimiter );

  app.use((req, res, next) => {
    console.log("Headers:", req.headers);
    console.log("Content-Length:", req.headers["content-length"]);
    console.log("Method:", req.method, "URL:", req.url);
    next();
  });


  // Routes
  app.use("/api/auth", authRoutes);


  app.use(errorHandler)
 

  return app;
};
