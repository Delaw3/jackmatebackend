import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morganLogger from "./utils/morgan.logger";
import { globalRateLimiter, loginLimiter } from "./utils/rate.limiter";
import authRoutes from "./router/auth.route";
import errorHandler from "./middleware/error.handler";
import { dbConnect } from "./config/db.config";
import rawBody from "raw-body";

let cachedDb: any = null;

export const createApp = () => {
  const app = express();

  // ----------------------
  // Body parsing middleware
  // ----------------------
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // Raw-body fallback (serverless-safe, handles mismatched Content-Length)
  app.use(async (req: Request, res: Response, next: NextFunction) => {
    if (req.body === undefined && (req.is("application/json") || req.is("application/octet-stream"))) {
      try {
        const buf = await rawBody(req);
        req.body = buf.length ? JSON.parse(buf.toString()) : {};
      } catch (err) {
        return next(err);
      }
    }
    next();
  });

  // ----------------------
  // Security & logging
  // ----------------------
  app.use(cors());
  app.use(helmet());
  app.set("trust proxy", 1); // needed for rate limiting behind proxies

  app.use(morganLogger);

  // ----------------------
  // Rate limiting
  // ----------------------
  // Login limiter only on login route
  app.use("/api/auth/login", loginLimiter);
  // Global limiter for all routes
  app.use(globalRateLimiter);

  // ----------------------
  // DB connection middleware (reuses connection)
  // ----------------------
  app.use(async (req: Request, res: Response, next: NextFunction) => {
    if (!cachedDb) {
      cachedDb = await dbConnect();
    }
    next();
  });

  // ----------------------
  // Debugging request headers
  // ----------------------
  app.use((req, res, next) => {
    console.log("Headers:", req.headers);
    console.log("Content-Length:", req.headers["content-length"]);
    console.log("Method:", req.method, "URL:", req.url);
    next();
  });

  // ----------------------
  // Routes
  // ----------------------
  app.use("/api/auth", authRoutes);

  // ----------------------
  // Error handler
  // ----------------------
  app.use(errorHandler);

  return app;
};
