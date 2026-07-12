import type { Metadata } from "next";
import { SignupTenantDetailsPage } from "@/features/signup/components/SignupTenantDetailsPage";

export const metadata: Metadata = {
  title: "Tenant Details | Thikana",
  description:
    "Add a few more details about your home search to finish creating your Thikana tenant account.",
};

export default function SignupTenantDetailsRoutePage() {
  return <SignupTenantDetailsPage />;
}
