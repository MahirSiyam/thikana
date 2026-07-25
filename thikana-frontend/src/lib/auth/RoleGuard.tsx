"use client";

import { useEffect, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { routes } from "@/config/routes";
import type { AppRole } from "@/lib/api/auth";
import { useAdminAuth } from "@/lib/auth/AdminAuthProvider";
import { useAuth } from "@/lib/auth/AuthProvider";
import { ROLE_DASHBOARD_ROUTES } from "@/lib/auth/role-routes";
import { resolvePostLoginRoute } from "@/lib/auth/resolve-post-login-route";

type RoleGuardProps = {
  children: ReactNode;
  allowedRoles: AppRole[];
};

function roleLabel(role: AppRole) {
  return role.replace(/_/g, " ");
}

export function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const isAdminRoute = allowedRoles.includes("admin");
  if (isAdminRoute) {
    return <AdminRoleGuard>{children}</AdminRoleGuard>;
  }
  return <UserRoleGuard allowedRoles={allowedRoles}>{children}</UserRoleGuard>;
}

function UserRoleGuard({
  children,
  allowedRoles,
}: {
  children: ReactNode;
  allowedRoles: AppRole[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { firebaseUser, profile, loading } = useAuth();

  const hasRoleAccess =
    Boolean(firebaseUser) &&
    Boolean(profile?.canAccessDashboard) &&
    profile?.role !== null &&
    profile?.role !== undefined &&
    allowedRoles.includes(profile.role) &&
    profile.role !== "admin";

  const signInHref = `${routes.signIn}?next=${encodeURIComponent(pathname)}`;

  const wrongRoleForRoute =
    Boolean(profile?.canAccessDashboard) &&
    Boolean(profile?.role) &&
    profile?.role !== "admin" &&
    !allowedRoles.includes(profile!.role!);

  useEffect(() => {
    if (loading || hasRoleAccess) return;

    if (!firebaseUser) {
      router.replace(signInHref);
      return;
    }

    if (!profile) return;

    // Admin accounts must use the separate admin portal.
    if (profile.role === "admin") {
      router.replace(routes.adminSignIn);
      return;
    }

    if (wrongRoleForRoute) return;

    const destination = resolvePostLoginRoute(profile);
    if (destination !== pathname) {
      router.replace(destination);
    }
  }, [
    firebaseUser,
    hasRoleAccess,
    loading,
    pathname,
    profile,
    router,
    signInHref,
    wrongRoleForRoute,
  ]);

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-surface">
        <p className="font-inter text-sm text-brand-dark/60">Checking access…</p>
      </div>
    );
  }

  if (hasRoleAccess) {
    return <>{children}</>;
  }

  if (!firebaseUser) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-surface px-4 text-center">
        <p className="font-inter text-sm text-brand-dark/70">
          Sign in required to open this dashboard.
        </p>
        <Link
          href={signInHref}
          className="rounded-lg bg-brand-dark px-4 py-2 font-inter text-sm font-semibold text-white"
        >
          Go to Sign In
        </Link>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-surface px-4 text-center">
        <p className="font-inter text-sm text-brand-dark/70">
          Could not load your account profile from the API. Check that the backend is
          running on port 5000 and try signing in again.
        </p>
        <Link
          href={routes.signIn}
          className="rounded-lg bg-brand-dark px-4 py-2 font-inter text-sm font-semibold text-white"
        >
          Back to Sign In
        </Link>
      </div>
    );
  }

  if (profile.role === "admin") {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-surface px-4 text-center">
        <p className="font-inter text-base font-semibold text-brand-dark">
          Use the admin portal
        </p>
        <p className="max-w-md font-inter text-sm text-brand-dark/70">
          Admin accounts are separate from user dashboards. Sign in at the admin portal.
        </p>
        <Link
          href={routes.adminSignIn}
          className="rounded-lg bg-brand-dark px-4 py-2 font-inter text-sm font-semibold text-white"
        >
          Admin Sign In
        </Link>
      </div>
    );
  }

  const ownDashboard =
    profile.role && profile.canAccessDashboard
      ? profile.dashboardRoute || ROLE_DASHBOARD_ROUTES[profile.role]
      : null;

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-surface px-4 text-center">
      <p className="font-inter text-base font-semibold text-brand-dark">
        You cannot open this dashboard
      </p>
      <p className="max-w-md font-inter text-sm text-brand-dark/70">
        Signed in as <span className="font-medium">{profile.email}</span>
        {profile.role ? ` (${roleLabel(profile.role)})` : ""}.{" "}
        {wrongRoleForRoute
          ? `This page is only for ${allowedRoles.map(roleLabel).join(" / ")} accounts.`
          : `Status: ${profile.approvalStatus || "n/a"} / ${profile.accountStatus || "n/a"}.`}
      </p>
      <Link
        href={ownDashboard || resolvePostLoginRoute(profile)}
        className="rounded-lg bg-brand-dark px-4 py-2 font-inter text-sm font-semibold text-white"
      >
        {ownDashboard ? "Go to my dashboard" : "Continue"}
      </Link>
    </div>
  );
}

function AdminRoleGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { firebaseUser, profile, loading } = useAdminAuth();

  const hasAdminAccess =
    Boolean(firebaseUser) &&
    Boolean(profile?.canAccessDashboard) &&
    profile?.role === "admin";

  const signInHref = `${routes.adminSignIn}?next=${encodeURIComponent(pathname)}`;

  useEffect(() => {
    if (loading || hasAdminAccess) return;

    if (!firebaseUser) {
      router.replace(signInHref);
    }
  }, [firebaseUser, hasAdminAccess, loading, router, signInHref]);

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-surface">
        <p className="font-inter text-sm text-brand-dark/60">Checking admin access…</p>
      </div>
    );
  }

  if (hasAdminAccess) {
    return <>{children}</>;
  }

  if (!firebaseUser) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-surface px-4 text-center">
        <p className="font-inter text-sm text-brand-dark/70">
          Admin sign in required.
        </p>
        <Link
          href={signInHref}
          className="rounded-lg bg-brand-dark px-4 py-2 font-inter text-sm font-semibold text-white"
        >
          Go to Admin Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-surface px-4 text-center">
      <p className="font-inter text-base font-semibold text-brand-dark">
        Admin access required
      </p>
      <p className="max-w-md font-inter text-sm text-brand-dark/70">
        Signed in as <span className="font-medium">{profile?.email || "unknown"}</span>
        {profile?.role ? ` (${roleLabel(profile.role)})` : ""}. This portal is for
        approved admin accounts only.
      </p>
      <Link
        href={routes.adminSignIn}
        className="rounded-lg bg-brand-dark px-4 py-2 font-inter text-sm font-semibold text-white"
      >
        Admin Sign In
      </Link>
    </div>
  );
}
