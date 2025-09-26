import crypto from "crypto";
import redis from "../utils/redis.client";

class OtpService {
  private prefix = "otp:";         // email → otp
  private lookupPrefix = "otp:lookup:"; // otp → email

  // Generate random 6-digit OTP
  generateOtp(): string {
    return crypto.randomInt(100000, 999999).toString();
  }

  // Save OTP in Redis with expiry (e.g. 5 minutes)
  async setOtp(email: string, otp: string, ttlSeconds = 300): Promise<void> {
    const emailKey = this.prefix + email;
    const otpKey = this.lookupPrefix + otp;

    await redis.setEx(emailKey, ttlSeconds, otp);
    await redis.setEx(otpKey, ttlSeconds, email);
  }

  // Get OTP from email (optional helper)
  async getOtp(email: string): Promise<string | null> {
    return redis.get(this.prefix + email);
  }

  // Lookup email from OTP
  async getEmailFromOtp(otp: string): Promise<string | null> {
    return redis.get(this.lookupPrefix + otp);
  }

  // Verify OTP using only the OTP code
  async verifyOtp(otp: string): Promise<string | null> {
    const otpKey = this.lookupPrefix + otp;
    const email = await redis.get(otpKey);

    if (!email) return null;

    const emailKey = this.prefix + email;
    const storedOtp = await redis.get(emailKey);

    if (storedOtp !== otp) return null;

    // Delete both mappings after success
    await redis.del(emailKey);
    await redis.del(otpKey);

    return email; // return email for chaining (e.g. reset password flow)
  }

  // Delete OTP manually
  async deleteOtp(email: string, otp?: string): Promise<void> {
    await redis.del(this.prefix + email);
    if (otp) {
      await redis.del(this.lookupPrefix + otp);
    }
  }
}

export const otpService = new OtpService();
