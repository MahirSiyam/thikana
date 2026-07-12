import type { Metadata } from "next";
import { SignupServiceProviderVerifyIdentityPage } from "@/features/signup/components/SignupServiceProviderVerifyIdentityPage";

export const metadata: Metadata = {
  title: "Verify Identity | Thikana",
  description:
    "Upload your NID and selfie to verify your identity and continue creating your Thikana service provider account.",
};

export default function SignupServiceProviderVerifyIdentityRoutePage() {
  return <SignupServiceProviderVerifyIdentityPage />;
}
