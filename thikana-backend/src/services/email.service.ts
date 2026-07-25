import { mailTransporter } from "../config/mailer";
import type { SignupRole, UserRole } from "../types/domain";

interface SendOtpEmailInput {
  email: string;
  otp: string;
  name?: string;
}

const roleLabel = (role: UserRole | SignupRole): string => {
  switch (role) {
    case "tenant":
      return "Tenant";
    case "owner":
      return "Property Owner";
    case "service_provider":
      return "Service Provider";
    case "admin":
      return "Admin";
    default:
      return role;
  }
};

const wrapHtml = (title: string, body: string) => `
  <div style="max-width:520px;margin:0 auto;padding:32px;font-family:Arial,sans-serif;color:#111827;">
    <h2 style="margin:0 0 16px;">${title}</h2>
    ${body}
  </div>
`;

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
    html: wrapHtml(
      "Verify your email address",
      `
        <p>Hello ${name || "there"},</p>
        <p>Use this verification code to finish setting up your Thikana account:</p>
        <div style="padding:18px;margin:24px 0;background:#f3f4f6;border-radius:8px;text-align:center;font-size:32px;font-weight:700;letter-spacing:8px;">
          ${otp}
        </div>
        <p>This code will expire in 5 minutes.</p>
        <p style="font-size:14px;color:#6b7280;">If you did not create this account, you can safely ignore this email.</p>
      `
    ),
  });
};

export const sendRegistrationReceivedEmail = async (input: {
  email: string;
  name: string;
  role: SignupRole;
}): Promise<void> => {
  const label = roleLabel(input.role);
  await mailTransporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: input.email,
    subject: "Registration Received – Account Under Review",
    text: [
      `Hello ${input.name},`,
      "",
      `Your registration as a ${label} has been completed successfully.`,
      "Your account is currently under admin review.",
      "Please verify your email if you have not already done so.",
      "You will receive another email after your account is approved.",
      "",
      "— Thikana",
    ].join("\n"),
    html: wrapHtml(
      "Registration received",
      `
        <p>Hello ${input.name},</p>
        <p>Your registration as a <strong>${label}</strong> has been completed successfully.</p>
        <p>Your account is currently under admin review. Please verify your email if you have not already done so.</p>
        <p>You will receive another email after your account is approved.</p>
        <p style="font-size:14px;color:#6b7280;">— Thikana</p>
      `
    ),
  });
};

export const sendAccountApprovedEmail = async (input: {
  email: string;
  name: string;
  role: UserRole;
  loginUrl: string;
}): Promise<void> => {
  const label = roleLabel(input.role);
  await mailTransporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: input.email,
    subject: "Your Account Has Been Approved",
    text: [
      `Hello ${input.name},`,
      "",
      `Your Thikana ${label} account has been approved successfully.`,
      "You can now log in and access your dashboard.",
      `Login: ${input.loginUrl}`,
      "",
      "— Thikana",
    ].join("\n"),
    html: wrapHtml(
      "Account approved",
      `
        <p>Hello ${input.name},</p>
        <p>Your Thikana <strong>${label}</strong> account has been approved successfully.</p>
        <p>You can now log in and access your dashboard.</p>
        <p><a href="${input.loginUrl}">Go to login</a></p>
        <p style="font-size:14px;color:#6b7280;">— Thikana</p>
      `
    ),
  });
};

export const sendAccountRejectedEmail = async (input: {
  email: string;
  name: string;
  reason?: string;
}): Promise<void> => {
  await mailTransporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: input.email,
    subject: "Registration Update – Account Not Approved",
    text: [
      `Hello ${input.name},`,
      "",
      "Unfortunately, your Thikana registration was not approved at this time.",
      input.reason ? `Reason: ${input.reason}` : "",
      "",
      "If you believe this was a mistake, please contact support.",
      "",
      "— Thikana",
    ]
      .filter(Boolean)
      .join("\n"),
    html: wrapHtml(
      "Registration not approved",
      `
        <p>Hello ${input.name},</p>
        <p>Unfortunately, your Thikana registration was not approved at this time.</p>
        ${input.reason ? `<p><strong>Reason:</strong> ${input.reason}</p>` : ""}
        <p>If you believe this was a mistake, please contact support.</p>
        <p style="font-size:14px;color:#6b7280;">— Thikana</p>
      `
    ),
  });
};

export const sendAccountSuspendedEmail = async (input: {
  email: string;
  name: string;
  reason?: string;
}): Promise<void> => {
  await mailTransporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: input.email,
    subject: "Account Suspended – Thikana",
    text: [
      `Hello ${input.name},`,
      "",
      "Your Thikana account has been suspended.",
      input.reason ? `Reason: ${input.reason}` : "",
      "",
      "Please contact support if you need help.",
      "",
      "— Thikana",
    ]
      .filter(Boolean)
      .join("\n"),
    html: wrapHtml(
      "Account suspended",
      `
        <p>Hello ${input.name},</p>
        <p>Your Thikana account has been suspended.</p>
        ${input.reason ? `<p><strong>Reason:</strong> ${input.reason}</p>` : ""}
        <p>Please contact support if you need help.</p>
        <p style="font-size:14px;color:#6b7280;">— Thikana</p>
      `
    ),
  });
};

export const sendAccountReactivatedEmail = async (input: {
  email: string;
  name: string;
  loginUrl: string;
}): Promise<void> => {
  await mailTransporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: input.email,
    subject: "Account Reactivated – Thikana",
    text: [
      `Hello ${input.name},`,
      "",
      "Your Thikana account has been reactivated. You can log in again.",
      `Login: ${input.loginUrl}`,
      "",
      "— Thikana",
    ].join("\n"),
    html: wrapHtml(
      "Account reactivated",
      `
        <p>Hello ${input.name},</p>
        <p>Your Thikana account has been reactivated. You can log in again.</p>
        <p><a href="${input.loginUrl}">Go to login</a></p>
        <p style="font-size:14px;color:#6b7280;">— Thikana</p>
      `
    ),
  });
};

/** Fire-and-forget email helper that never throws to the caller. */
export const safeSendEmail = async (
  label: string,
  send: () => Promise<void>
): Promise<void> => {
  try {
    await send();
  } catch (error) {
    console.error(`[email] Failed to send ${label}:`, error);
  }
};
