import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import logger from "../utils/logger";
import { config } from "../config/config";

const transporter = nodemailer.createTransport({
  host: config.smtphost,
  port: config.smtpport,
  secure: false, // SSL
  auth: {
    user: config.email,
    pass: config.emailPassword,
  },
} as SMTPTransport.Options);

export const sendMail = async (to: string, subject: string, text: string): Promise<void> => {
  const mailOptions = {
    from: config.email,
    to,
    subject,
    text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info("Email sent: " + info.response);
  } catch (error) {
    logger.error("Error sending email:", error);
    throw error; // so the controller can handle it
  }
};
