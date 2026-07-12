import type { Metadata } from "next";
import { SignupTenantPage } from "@/features/signup/components/SignupTenantPage";

export const metadata: Metadata = {
  title: "Sign Up | Thikana",
  description: "Create your Thikana account as a tenant, property owner, or service provider.",
};

export default function SignupTenantRoutePage() {
  return <SignupTenantPage />;
}
