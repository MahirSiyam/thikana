import type { Metadata } from "next";
import { SignupTenantVerifyIdentityPage } from "@/features/signup/components/SignupTenantVerifyIdentityPage";

export const metadata: Metadata = {
  title: "Verify Identity | Thikana",
  description:
    "Upload your NID and selfie to verify your identity and continue creating your Thikana tenant account.",
};

export default function SignupTenantVerifyIdentityRoutePage() {
  return <SignupTenantVerifyIdentityPage />;
}
