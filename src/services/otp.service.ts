import crypto from "crypto";
import redis from "../utils/redis.client";


class OtpService {
  private prefix = "otp:"; // to avoid key collisions

  // Generate random 6-digit OTP
  generateOtp(): string {
    return crypto.randomInt(100000, 999999).toString();
  }

  // Save OTP in Redis with expiry (e.g. 5 minutes)
  async setOtp(email: string, otp: string, ttlSeconds = 300): Promise<void> {
    const key = this.prefix + email;
    await redis.setEx(key, ttlSeconds, otp);
  }

  // Get OTP from Redis
  async getOtp(email: string): Promise<string | null> {
    const key = this.prefix + email;
    return redis.get(key);
  }

  // Verify OTP
  async verifyOtp(email: string, otp: string): Promise<boolean> {
    const key = this.prefix + email;
    const storedOtp = await redis.get(key);

    if (!storedOtp) return false;

    const isValid = storedOtp === otp;

    if (isValid) {
      // Delete OTP after successful verification
      await redis.del(key);
    }

    return isValid;
  }

  // Delete OTP manually (optional)
  async deleteOtp(email: string): Promise<void> {
    const key = this.prefix + email;
    await redis.del(key);
  }
}

export const otpService = new OtpService();
