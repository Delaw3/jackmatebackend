import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { Request } from "express";

// IPv6-safe key generator
const getClientIp = (req: Request): string => {
  const ip =
    req.ip ||
    (Array.isArray(req.headers["x-forwarded-for"])
      ? req.headers["x-forwarded-for"][0]
      : req.headers["x-forwarded-for"]) ||
    req.socket?.remoteAddress ||
    "unknown";

  return ipKeyGenerator(ip);
};

export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  keyGenerator: getClientIp,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    title: "Too many requests",
    message: "You have exceeded the request limit. Please try again later.",
  },
});

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  keyGenerator: getClientIp,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    title: "Too many login attempts",
    message: "Too many failed login attempts, please try again later.",
  },
});
