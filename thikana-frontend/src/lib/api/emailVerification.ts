import { authorizedFetch } from "@/lib/api/client";

/** Ask the backend to generate and email a fresh 6-digit OTP to the signed-in Firebase user. */
export const sendEmailOtp = () =>
  authorizedFetch("/api/auth/email-verification/send-otp", { method: "POST" });

/** Submit the 6-digit OTP the user received by email for verification. */
export const verifyEmailOtp = (otp: string) =>
  authorizedFetch("/api/auth/email-verification/verify-otp", {
    method: "POST",
    body: JSON.stringify({ otp }),
  });
