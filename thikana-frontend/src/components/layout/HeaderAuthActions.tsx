"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { ProfileAvatar } from "@/components/ui/ProfileAvatar";
import { headerAuthActions } from "@/config/navigation";
import { routes } from "@/config/routes";
import type { AppRole, MeUser } from "@/lib/api/auth";
import { useAuth } from "@/lib/auth/AuthProvider";
import { resolvePostLoginRoute } from "@/lib/auth/resolve-post-login-route";
import { ROLE_DASHBOARD_ROUTES } from "@/lib/auth/role-routes";
import { useDashboardSignOut } from "@/lib/auth/use-dashboard-sign-out";

function roleLabel(role: AppRole | null | undefined) {
  if (role === "tenant") return "Tenant";
  if (role === "owner") return "Owner";
  if (role === "service_provider") return "Service Provider";
  if (role === "admin") return "Admin";
  return "Member";
}

function statusLabel(profile: MeUser) {
  if (!profile.emailVerified) return "Verify email";
  if (!profile.registrationComplete) return "Complete signup";
  if (profile.approvalStatus === "pending") return "Pending approval";
  if (profile.approvalStatus === "rejected") return "Rejected";
  if (profile.accountStatus === "suspended") return "Suspended";
  if (profile.accountStatus === "disabled") return "Disabled";
  if (profile.canAccessDashboard) return "Active";
  return "Pending";
}

function primaryAccountHref(profile: MeUser) {
  if (profile.canAccessDashboard && profile.role && profile.role !== "admin") {
    return profile.dashboardRoute || ROLE_DASHBOARD_ROUTES[profile.role];
  }
  return resolvePostLoginRoute(profile);
}

function primaryAccountLabel(profile: MeUser) {
  if (profile.canAccessDashboard && profile.role && profile.role !== "admin") {
    return "Go to Dashboard";
  }
  if (!profile.emailVerified) return "Verify email";
  if (!profile.registrationComplete) return "Continue signup";
  if (profile.approvalStatus === "pending") return "View approval status";
  if (profile.approvalStatus === "rejected") return "View account status";
  if (profile.accountStatus === "suspended") return "View account status";
  if (profile.accountStatus === "disabled") return "View account status";
  return "Open account";
}

type HeaderAuthActionsProps = {
  className?: string;
  onActionClick?: () => void;
  compact?: boolean;
};

function GuestAuthActions({
  className = "",
  onActionClick,
  compact = false,
}: HeaderAuthActionsProps) {
  return (
    <div className={`flex shrink-0 items-center justify-end gap-1.5 sm:gap-2 ${className}`}>
      {headerAuthActions.map((action) => {
        const textClassName = `whitespace-nowrap px-1.5 font-semibold text-brand-dark transition-colors hover:text-brand-dark/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 ${
          compact ? "py-2 text-sm" : "py-2 text-sm md:py-3 md:text-[15px] lg:py-5 lg:text-base"
        }`;
        const primaryClassName = `inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-(--nav-pill-radius) bg-brand-dark font-bold text-brand-light-text transition-colors hover:bg-brand-dark/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 ${
          compact
            ? "h-11 min-w-[88px] px-3 text-sm"
            : "h-11 min-w-[88px] px-3 text-sm md:h-[52px] md:min-w-[92px] md:text-[15px] lg:h-[59px] lg:min-w-[100px] lg:px-5 lg:text-base"
        }`;

        if (action.variant === "text") {
          return (
            <Link
              key={action.label}
              href={action.href || routes.signIn}
              onClick={onActionClick}
              className={textClassName}
            >
              {action.label}
            </Link>
          );
        }

        return (
          <Link
            key={action.label}
            href={action.href || routes.signUpTenant}
            onClick={onActionClick}
            className={primaryClassName}
          >
            {action.label}
          </Link>
        );
      })}
    </div>
  );
}

function SignedInAuthMenu({
  profile,
  photoURL,
  className = "",
  onActionClick,
  compact = false,
}: HeaderAuthActionsProps & {
  profile: MeUser;
  photoURL?: string | null;
}) {
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const { signingOut, signOutUser } = useDashboardSignOut({
    scope: "user",
    redirectTo: routes.home,
  });

  const displayName = profile.fullName || profile.email.split("@")[0] || "Account";
  const avatarSrc =
    (!imageFailed && (profile.avatarUrl || photoURL)) || null;
  const accountHref = primaryAccountHref(profile);
  const accountLabel = primaryAccountLabel(profile);
  const status = statusLabel(profile);

  useEffect(() => {
    setImageFailed(false);
  }, [profile.avatarUrl, photoURL]);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div
      ref={rootRef}
      className={`relative flex shrink-0 items-center justify-end ${className}`}
    >
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={`${displayName} account menu`}
        onClick={() => setOpen((value) => !value)}
        className={`inline-flex items-center justify-center rounded-full transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 ${
          compact ? "size-11" : "size-11 md:size-[52px] lg:size-[59px]"
        }`}
      >
        <ProfileAvatar
          src={avatarSrc}
          size="sm"
          className={
            compact
              ? "size-10!"
              : "size-10! md:size-12! lg:size-14!"
          }
          onError={() => setImageFailed(true)}
        />
      </button>

      {open ? (
        <div
          id={menuId}
          role="menu"
          aria-label="Account menu"
          className="absolute top-[calc(100%+0.5rem)] right-0 z-50 w-[min(18.5rem,calc(100vw-1.5rem))] overflow-hidden rounded-xl border border-[#e8e8e4] bg-white shadow-[0_12px_40px_rgba(10,10,10,0.12)]"
        >
          <div className="border-b border-[#f0f0ec] px-4 py-3.5">
            <div className="flex items-start gap-3">
              <ProfileAvatar
                src={avatarSrc}
                size="md"
                onError={() => setImageFailed(true)}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate font-inter text-sm font-bold text-brand-dark">
                  {displayName}
                </p>
                <p className="mt-0.5 truncate font-inter text-xs text-brand-dark/55">
                  {profile.email}
                </p>
              </div>
            </div>
            <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
              <span className="rounded-full bg-brand-dark/8 px-2 py-0.5 font-inter text-[10px] font-semibold text-brand-dark">
                {roleLabel(profile.role)}
              </span>
              <span
                className={`rounded-full px-2 py-0.5 font-inter text-[10px] font-semibold ${
                  profile.canAccessDashboard
                    ? "bg-emerald-50 text-emerald-800"
                    : "bg-amber-50 text-amber-900"
                }`}
              >
                {status}
              </span>
            </div>
            {profile.phone ? (
              <p className="mt-2 font-inter text-xs text-brand-dark/55">
                {profile.phone}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col p-2">
            <Link
              href={accountHref}
              role="menuitem"
              onClick={() => {
                close();
                onActionClick?.();
              }}
              className="rounded-lg px-3 py-2.5 font-inter text-sm font-semibold text-brand-dark transition-colors hover:bg-brand-dark/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark"
            >
              {accountLabel}
            </Link>

            <button
              type="button"
              role="menuitem"
              disabled={signingOut}
              onClick={() => {
                close();
                onActionClick?.();
                void signOutUser();
              }}
              className="rounded-lg px-3 py-2.5 text-left font-inter text-sm font-semibold text-[#b91c1c] transition-colors hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:opacity-60"
            >
              {signingOut ? "Signing out…" : "Sign out"}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function HeaderAuthActions({
  className = "",
  onActionClick,
  compact = false,
}: HeaderAuthActionsProps) {
  const { firebaseUser, profile, loading } = useAuth();

  if (loading) {
    return (
      <div
        className={`flex shrink-0 items-center justify-end ${className}`}
        aria-hidden="true"
      >
        <div
          className={`animate-pulse rounded-(--nav-pill-radius) bg-brand-dark/10 ${
            compact ? "h-11 w-24" : "h-11 w-28 md:h-[52px] lg:h-[59px]"
          }`}
        />
      </div>
    );
  }

  if (firebaseUser && profile) {
    return (
      <SignedInAuthMenu
        profile={profile}
        photoURL={firebaseUser.photoURL}
        className={className}
        onActionClick={onActionClick}
        compact={compact}
      />
    );
  }

  if (firebaseUser && !profile) {
    // Firebase session exists but profile not loaded / incomplete — still show avatar menu from Firebase basics.
    const fallbackProfile: MeUser = {
      id: null,
      firebaseUid: firebaseUser.uid,
      fullName: firebaseUser.displayName || undefined,
      email: firebaseUser.email || "",
      role: null,
      emailVerified: firebaseUser.emailVerified,
      approvalStatus: null,
      accountStatus: null,
      canAccessDashboard: false,
      dashboardRoute: null,
      avatarUrl: null,
      registrationComplete: false,
    };
    return (
      <SignedInAuthMenu
        profile={fallbackProfile}
        photoURL={firebaseUser.photoURL}
        className={className}
        onActionClick={onActionClick}
        compact={compact}
      />
    );
  }

  return (
    <GuestAuthActions
      className={className}
      onActionClick={onActionClick}
      compact={compact}
    />
  );
}
