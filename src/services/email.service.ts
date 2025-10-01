import sgMail from "@sendgrid/mail";
import logger from "../utils/logger";
import { config } from "../config/config";

sgMail.setApiKey(config.emailPassword || ""); // API key

export const sendMail = async (to: string, subject: string, text: string) => {
  try {
    await sgMail.send({
      to,
      from: config.email || "", // must be verified sender in SendGrid
      subject,
      text,
    });
    logger.info(`Email sent to ${to}`);
  } catch (error) {
    logger.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};
