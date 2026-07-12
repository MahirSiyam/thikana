import type { Metadata } from "next";
import { SignupTenantFormPage } from "@/features/signup/components/SignupTenantFormPage";

export const metadata: Metadata = {
  title: "Tenant Sign Up | Thikana",
  description: "Enter your basic information to continue creating your Thikana tenant account.",
};

export default function SignupTenantFormRoutePage() {
  return <SignupTenantFormPage />;
}
