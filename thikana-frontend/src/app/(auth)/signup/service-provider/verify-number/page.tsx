import type { Metadata } from "next";
import { SignupServiceProviderVerifyNumberPage } from "@/features/signup/components/SignupServiceProviderVerifyNumberPage";

export const metadata: Metadata = {
  title: "Verify Number | Thikana",
  description:
    "Enter the OTP sent to your mobile number to continue creating your Thikana service provider account.",
};

export default function SignupServiceProviderVerifyNumberRoutePage() {
  return <SignupServiceProviderVerifyNumberPage />;
}
