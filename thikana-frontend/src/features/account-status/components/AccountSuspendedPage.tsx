"use client";

import { routes } from "@/config/routes";
import { AccountStatusPage } from "@/features/account-status/components/AccountStatusPage";
import { useAuth } from "@/lib/auth/AuthProvider";

export function AccountSuspendedPage() {
  const { profile } = useAuth();
  const reason = profile?.suspensionReason
    ? ` Reason: ${profile.suspensionReason}`
    : "";

  return (
    <AccountStatusPage
      title="Account suspended"
      description={`Your Thikana account is currently suspended.${reason} Please contact support for help.`}
      tone="danger"
      primaryHref={routes.signIn}
      primaryLabel="Back to Sign In"
    />
  );
}
