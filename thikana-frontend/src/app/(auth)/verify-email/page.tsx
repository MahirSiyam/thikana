import type { Metadata } from "next";
import { EmailVerificationPage } from "@/features/email-verification/components/EmailVerificationPage";

export const metadata: Metadata = {
  title: "Verify Email | Thikana",
  description: "Verify your email address to activate your Thikana account.",
};

export default function VerifyEmailRoutePage() {
  return <EmailVerificationPage />;
}
