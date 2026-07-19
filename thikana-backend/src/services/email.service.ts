import { mailTransporter } from "../config/mailer";

interface SendOtpEmailInput {
  email: string;
  otp: string;
  name?: string;
}

export const sendOtpEmail = async ({ email, otp, name }: SendOtpEmailInput): Promise<void> => {
  await mailTransporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Verify your email address",
    text: [
      `Hello ${name || "there"},`,
      "",
      `Your Thikana email verification code is ${otp}.`,
      "",
      "This code expires in 5 minutes.",
      "",
      "Ignore this email if you did not create this account.",
    ].join("\n"),
    html: `
      <div style="
        max-width: 520px;
        margin: 0 auto;
        padding: 32px;
        font-family: Arial, sans-serif;
        color: #111827;
      ">
        <h2>Verify your email address</h2>
        <p>Hello ${name || "there"},</p>
        <p>Use this verification code to finish setting up your Thikana account:</p>
        <div style="
          padding: 18px;
          margin: 24px 0;
          background: #f3f4f6;
          border-radius: 8px;
          text-align: center;
          font-size: 32px;
          font-weight: 700;
          letter-spacing: 8px;
        ">
          ${otp}
        </div>
        <p>This code will expire in 5 minutes.</p>
        <p style="font-size: 14px; color: #6b7280;">
          If you did not create this account, you can safely ignore this email.
        </p>
      </div>
    `,
  });
};
