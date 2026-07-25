import { routes } from "@/config/routes";
import type { MeUser } from "@/lib/api/auth";
import { ROLE_DASHBOARD_ROUTES } from "@/lib/auth/role-routes";

/**
 * Centralized post-login / session-restore redirect resolver.
 * Priority: unauthenticated → verify email → incomplete registration →
 * pending → rejected → suspended → disabled → role dashboard.
 */
export function resolvePostLoginRoute(
  user: MeUser | null | undefined,
  options: { fallbackSignupRoute?: string } = {}
): string {
  if (!user) {
    return routes.signIn;
  }

  if (!user.emailVerified) {
    const next = user.registrationComplete
      ? resolvePostLoginRoute({ ...user, emailVerified: true }, options)
      : options.fallbackSignupRoute || routes.home;
    return `${routes.verifyEmail}?next=${encodeURIComponent(next)}`;
  }

  if (!user.registrationComplete || !user.role) {
    return options.fallbackSignupRoute || routes.signUpTenant;
  }

  // Admin portal is a separate auth surface.
  if (user.role === "admin") {
    return routes.adminSignIn;
  }

  if (user.approvalStatus === "pending") {
    return routes.pendingApproval;
  }

  if (user.approvalStatus === "rejected") {
    return routes.accountRejected;
  }

  if (user.accountStatus === "suspended") {
    return routes.accountSuspended;
  }

  if (user.accountStatus === "disabled") {
    return routes.accountDisabled;
  }

  if (user.canAccessDashboard && user.role) {
    return user.dashboardRoute || ROLE_DASHBOARD_ROUTES[user.role];
  }

  return routes.pendingApproval;
}
