import type { Metadata } from "next";
import { PendingApprovalPage } from "@/features/account-status/components/PendingApprovalPage";

export const metadata: Metadata = {
  title: "Pending Approval | Thikana",
  description: "Your Thikana account is under admin review.",
};

export default function PendingApprovalRoutePage() {
  return <PendingApprovalPage />;
}
