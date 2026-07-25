import type { Metadata } from "next";
import { AccountDisabledPage } from "@/features/account-status/components/AccountDisabledPage";

export const metadata: Metadata = {
  title: "Account Disabled | Thikana",
  description: "Your Thikana account is disabled.",
};

export default function AccountDisabledRoutePage() {
  return <AccountDisabledPage />;
}
