"use client";

import { routes } from "@/config/routes";
import { AccountStatusPage } from "@/features/account-status/components/AccountStatusPage";
import { useAuth } from "@/lib/auth/AuthProvider";

export function AccountRejectedPage() {
  const { profile } = useAuth();
  const reason = profile?.rejectionReason
    ? ` Reason shared with you: ${profile.rejectionReason}`
    : "";

  return (
    <AccountStatusPage
      title="Registration not approved"
      description={`Your Thikana registration was not approved at this time.${reason} You can contact support if you believe this was a mistake.`}
      tone="danger"
      primaryHref={routes.signIn}
      primaryLabel="Back to Sign In"
    />
  );
}
