import type { Metadata } from "next";
import { AccountSuspendedPage } from "@/features/account-status/components/AccountSuspendedPage";

export const metadata: Metadata = {
  title: "Account Suspended | Thikana",
  description: "Your Thikana account is suspended.",
};

export default function AccountSuspendedRoutePage() {
  return <AccountSuspendedPage />;
}
