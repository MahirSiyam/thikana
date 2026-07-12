import type { Metadata } from "next";
import { SignupOwnerVerifyIdentityPage } from "@/features/signup/components/SignupOwnerVerifyIdentityPage";

export const metadata: Metadata = {
  title: "Verify Identity | Thikana",
  description:
    "Upload your NID and selfie to verify your identity and continue creating your Thikana owner account.",
};

export default function SignupOwnerVerifyIdentityRoutePage() {
  return <SignupOwnerVerifyIdentityPage />;
}
