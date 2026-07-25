"use client";

import { routes } from "@/config/routes";
import { AccountStatusPage } from "@/features/account-status/components/AccountStatusPage";

export function AccountDisabledPage() {
  return (
    <AccountStatusPage
      title="Account disabled"
      description="This Thikana account is disabled and cannot access the dashboard."
      tone="danger"
      primaryHref={routes.signIn}
      primaryLabel="Back to Sign In"
    />
  );
}
