"use client";

import { routes } from "@/config/routes";
import { AccountStatusPage } from "@/features/account-status/components/AccountStatusPage";

export function PendingApprovalPage() {
  return (
    <AccountStatusPage
      title="Registration under review"
      description="Your registration is complete and your account is currently under admin review. Dashboard access will be enabled after approval. You will receive an email once a decision is made."
      tone="warning"
      primaryHref={routes.signIn}
      primaryLabel="Back to Sign In"
    />
  );
}
