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

type ChecklistEmailItem = {
  label: string;
  status: "ok" | "issue" | "pending";
  note?: string;
};

const checklistTextBlock = (items: ChecklistEmailItem[]) => {
  const ok = items.filter((item) => item.status === "ok");
  const issue = items.filter((item) => item.status === "issue");
  const lines: string[] = [];
  if (ok.length) {
    lines.push("Looks good:");
    ok.forEach((item) => lines.push(`  ✓ ${item.label}`));
  }
  if (issue.length) {
    if (lines.length) lines.push("");
    lines.push("Needs attention:");
    issue.forEach((item) =>
      lines.push(
        `  ✗ ${item.label}${item.note ? ` — ${item.note}` : ""}`
      )
    );
  }
  return lines.join("\n");
};

const checklistHtmlBlock = (items: ChecklistEmailItem[]) => {
  const ok = items.filter((item) => item.status === "ok");
  const issue = items.filter((item) => item.status === "issue");
  return `
    ${
      ok.length
        ? `
      <p style="margin:16px 0 8px;font-weight:700;">Looks good</p>
      <ul style="margin:0;padding-left:18px;">
        ${ok
          .map(
            (item) =>
              `<li style="margin:4px 0;color:#15803d;">✓ ${item.label}</li>`
          )
          .join("")}
      </ul>`
        : ""
    }
    ${
      issue.length
        ? `
      <p style="margin:16px 0 8px;font-weight:700;">Needs attention</p>
      <ul style="margin:0;padding-left:18px;">
        ${issue
          .map(
            (item) =>
              `<li style="margin:4px 0;color:#b91c1c;">✗ ${item.label}${
                item.note
                  ? ` <span style="color:#6b7280;">— ${item.note}</span>`
                  : ""
              }</li>`
          )
          .join("")}
      </ul>`
        : ""
    }
  `;
};

export const sendListingApprovedEmail = async (input: {
  email: string;
  name: string;
  listingTitle: string;
  dashboardUrl: string;
  checklist: ChecklistEmailItem[];
}): Promise<void> => {
  const checklistText = checklistTextBlock(input.checklist);
  await mailTransporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: input.email,
    subject: `Listing approved – ${input.listingTitle}`,
    text: [
      `Hello ${input.name},`,
      "",
      `Your listing "${input.listingTitle}" has been approved and is now live on Thikana.`,
      "",
      checklistText,
      "",
      `Manage your listing: ${input.dashboardUrl}`,
      "",
      "— Thikana",
    ]
      .filter(Boolean)
      .join("\n"),
    html: wrapHtml(
      "Listing approved",
      `
        <p>Hello ${input.name},</p>
        <p>Your listing <strong>${input.listingTitle}</strong> has been approved and is now live on Thikana.</p>
        ${checklistHtmlBlock(input.checklist)}
        <p style="margin-top:20px;"><a href="${input.dashboardUrl}">Open My Listings</a></p>
        <p style="font-size:14px;color:#6b7280;">— Thikana</p>
      `
    ),
  });
};

export const sendListingRejectedEmail = async (input: {
  email: string;
  name: string;
  listingTitle: string;
  reason?: string;
  checklist: ChecklistEmailItem[];
  dashboardUrl: string;
}): Promise<void> => {
  const checklistText = checklistTextBlock(input.checklist);
  await mailTransporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: input.email,
    subject: `Listing needs changes – ${input.listingTitle}`,
    text: [
      `Hello ${input.name},`,
      "",
      `Your listing "${input.listingTitle}" was not approved yet.`,
      input.reason ? `Admin note: ${input.reason}` : "",
      "",
      checklistText,
      "",
      "Please update the listing and submit it again for review.",
      `My Listings: ${input.dashboardUrl}`,
      "",
      "— Thikana",
    ]
      .filter(Boolean)
      .join("\n"),
    html: wrapHtml(
      "Listing needs changes",
      `
        <p>Hello ${input.name},</p>
        <p>Your listing <strong>${input.listingTitle}</strong> was not approved yet.</p>
        ${
          input.reason
            ? `<p><strong>Admin note:</strong> ${input.reason}</p>`
            : ""
        }
        ${checklistHtmlBlock(input.checklist)}
        <p style="margin-top:16px;">Please update the listing and submit it again for review.</p>
        <p><a href="${input.dashboardUrl}">Open My Listings</a></p>
        <p style="font-size:14px;color:#6b7280;">— Thikana</p>
      `
    ),
  });
};

export const sendSupportTicketStatusEmail = async (input: {
  email: string;
  name: string;
  ticketNumber: string;
  subject: string;
  status: "open" | "in_progress" | "resolved";
  adminReply?: string;
}): Promise<void> => {
  const statusText =
    input.status === "in_progress"
      ? "In Progress"
      : input.status === "resolved"
      ? "Resolved"
      : "Open";

  const statusDescription =
    input.status === "in_progress"
      ? "Our support team is now actively reviewing and working on your issue."
      : input.status === "resolved"
      ? "Your support ticket has been marked as resolved by our support team."
      : "Your support ticket status has been updated to open.";

  const statusBadgeBg =
    input.status === "in_progress"
      ? "#2563eb"
      : input.status === "resolved"
      ? "#16a34a"
      : "#d97706";

  const replySection = input.adminReply
    ? `
      <div style="margin:20px 0;padding:16px;background:#f8fafc;border-left:4px solid #111827;border-radius:6px;">
        <p style="margin:0 0 6px;font-size:12px;font-weight:700;color:#475569;text-transform:uppercase;">Admin Response:</p>
        <p style="margin:0;font-size:14px;color:#0f172a;line-height:1.5;">${input.adminReply}</p>
      </div>
    `
    : "";

  await mailTransporter.sendMail({
    from: process.env.EMAIL_FROM || "Thikana Support <support@thikana.com>",
    to: input.email,
    subject: `[${input.ticketNumber}] Support Ticket Status: ${statusText}`,
    text: [
      `Hello ${input.name},`,
      "",
      `Your support ticket #${input.ticketNumber} ("${input.subject}") status has been updated to "${statusText}".`,
      "",
      statusDescription,
      input.adminReply ? `\nAdmin Response:\n${input.adminReply}` : "",
      "",
      "— Thikana Support Team",
    ].join("\n"),
    html: wrapHtml(
      `Support Ticket Updated: ${statusText}`,
      `
        <p>Hello <strong>${input.name}</strong>,</p>
        <p>Your support ticket <strong>#${input.ticketNumber}</strong> (<em>${input.subject}</em>) has been updated.</p>
        <div style="display:inline-block;padding:8px 16px;margin:12px 0;background:${statusBadgeBg};color:#ffffff;border-radius:20px;font-size:13px;font-weight:700;">
          Status: ${statusText}
        </div>
        <p>${statusDescription}</p>
        ${replySection}
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;" />
        <p style="font-size:13px;color:#64748b;">Thank you for reaching out to Thikana Support.</p>
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
