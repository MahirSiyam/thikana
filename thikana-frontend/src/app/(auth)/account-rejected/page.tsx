import type { Metadata } from "next";
import { AccountRejectedPage } from "@/features/account-status/components/AccountRejectedPage";

export const metadata: Metadata = {
  title: "Account Rejected | Thikana",
  description: "Your Thikana registration was not approved.",
};

export default function AccountRejectedRoutePage() {
  return <AccountRejectedPage />;
}
