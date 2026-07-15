import type { Metadata } from "next";
import { OwnerProfilePage } from "@/features/owner-profile/components/OwnerProfilePage";

export const metadata: Metadata = {
  title: "Profile | Thikana Owner",
  description:
    "Manage your owner profile, account security, verification status, and listed properties.",
};

export default function OwnerProfileRoutePage() {
  return <OwnerProfilePage />;
}
