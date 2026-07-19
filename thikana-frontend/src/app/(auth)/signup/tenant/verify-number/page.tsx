 import type { Metadata } from "next";
import { SignupTenantVerifyOtpPage } from "@/features/signup/components/SignupTenantVerifyOtpPage";

export const metadata: Metadata = {
  title: "Verify Number | Thikana",
  description: "Enter the OTP sent to your mobile number to continue signing up on Thikana.",
};

export default function SignupTenantVerifyNumberRoutePage() {
  return <SignupTenantVerifyOtpPage />;
}
