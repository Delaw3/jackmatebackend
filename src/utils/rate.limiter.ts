import rateLimit from "express-rate-limit";
import { Request } from "express";

//  custom key generator to avoid Forwarded header issue
const getClientIp = (req: Request): string => {
  return (
    req.ip ||
    (Array.isArray(req.headers["x-forwarded-for"])
      ? req.headers["x-forwarded-for"][0]
      : req.headers["x-forwarded-for"]) ||
    "unknown"
  );
};

export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: getClientIp, //  fixes forwarded header warning
  message: {
    title: "Too many requests",
    message: "You have exceeded the request limit. Please try again later.",
  },
});

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: getClientIp, // same fix for login limiter
  message: {
    title: "Too many login attempts",
    message: "Too many failed login attempts, please try again later.",
  },
});
