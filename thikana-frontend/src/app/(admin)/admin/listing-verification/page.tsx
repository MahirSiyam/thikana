import type { Metadata } from "next";
import { AdminListingVerificationPage } from "@/features/admin-listing-verification/components/AdminListingVerificationPage";

export const metadata: Metadata = {
  title: "Listing Verification | Thikana Admin",
  description: "Review and approve property listings in the Thikana verification queue.",
};

export default function AdminListingVerificationRoutePage() {
  return <AdminListingVerificationPage />;
}
