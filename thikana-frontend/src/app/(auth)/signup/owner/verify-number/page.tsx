import type { Metadata } from "next";
import { SignupOwnerVerifyNumberPage } from "@/features/signup/components/SignupOwnerVerifyNumberPage";

export const metadata: Metadata = {
  title: "Verify Number | Thikana",
  description:
    "Enter the OTP sent to your mobile number to continue creating your Thikana owner account.",
};

export default function SignupOwnerVerifyNumberRoutePage() {
  return <SignupOwnerVerifyNumberPage />;
}
