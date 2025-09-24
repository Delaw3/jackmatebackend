// utils/jwt.util.ts
import jwt, { JwtPayload, SignOptions, Secret } from "jsonwebtoken";
import { config } from "../config/config";

/**
 * Ensure these variables use the types the jsonwebtoken types expect.
 * - Secret is a union type jsonwebtoken uses (string | Buffer | KeyObject ...)
 * - expiresIn is allowed to be string | number
 */
const JWT_SECRET: Secret = (config.jwtSecret as unknown) as Secret;

const rawExpires = config.jwtExpiresIn;
const JWT_EXPIRES_IN: string | number =
  typeof rawExpires === "string" || typeof rawExpires === "number"
    ? rawExpires
    : "1h";

/**
 * Generate JWT (explicit SignOptions so TS chooses the correct overload)
 */
export const generateToken = (payload: object): string => {
  if (!JWT_SECRET) {
    throw new Error("JWT secret is not defined");
  }

  const options: SignOptions = {
    expiresIn: JWT_EXPIRES_IN as SignOptions["expiresIn"], // explicit
  };

  // cast payload to allowed union so TS resolves the right overload
  return jwt.sign(payload as string | object | Buffer, JWT_SECRET, options);
};

/**
 * Verify and return a typed payload (JwtPayload)
 */
export const verifyToken = (token: string): JwtPayload => {
  if (!JWT_SECRET) {
    throw new Error("JWT secret is not defined");
  }

  const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
  return decoded;
};
