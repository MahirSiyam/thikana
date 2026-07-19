import nodemailer from "nodemailer";

const smtpPort = Number(process.env.SMTP_PORT || 587);

export const mailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: smtpPort,
  secure: smtpPort === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const verifyMailConnection = async (): Promise<void> => {
  try {
    await mailTransporter.verify();
    console.log("Email server connected successfully");
  } catch (error) {
    console.error("Email server connection failed:", error);
  }
};
