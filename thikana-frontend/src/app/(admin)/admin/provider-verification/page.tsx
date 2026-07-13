import type { Metadata } from "next";
import { AdminProviderVerificationPage } from "@/features/admin-provider-verification/components/AdminProviderVerificationPage";

export const metadata: Metadata = {
  title: "Provider Verification | Thikana Admin",
  description: "Review and approve service provider verification requests in Thikana admin.",
};

export default function AdminProviderVerificationRoutePage() {
  return <AdminProviderVerificationPage />;
}
