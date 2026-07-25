"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ProfileAvatar } from "@/components/ui/ProfileAvatar";
import { routes } from "@/config/routes";
import { ownerNavItems } from "@/features/owner/data/owner.mock";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useDashboardSignOut } from "@/lib/auth/use-dashboard-sign-out";

type OwnerSidebarProps = {
  mobileOpen?: boolean;
  onClose?: () => void;
};

function ThikanaOwnerWordmark() {
  return (
    <p className="font-outfit text-[40px] font-extrabold leading-[0.8] text-white">
      T
      <span className="font-instrument italic">h</span>
      i
      <span className="font-instrument italic">k</span>
      ana
    </p>
  );
}

export function OwnerSidebar({ mobileOpen = false, onClose }: OwnerSidebarProps) {
  const pathname = usePathname();
  const { profile } = useAuth();
  const { signingOut, signOutUser } = useDashboardSignOut({ scope: "user" });
  const [imageFailed, setImageFailed] = useState(false);
  const displayName = profile?.fullName || profile?.email || "Owner";
  const avatarSrc =
    !imageFailed && profile?.avatarUrl ? profile.avatarUrl : null;

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity lg:hidden ${
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!mobileOpen}
        onClick={onClose}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-dvh w-[min(100%,300px)] flex-col overflow-y-auto bg-brand-dark px-[50px] py-[30px] transition-transform lg:w-[300px] lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Owner navigation"
      >
        <div className="flex flex-col gap-6">
          <Link
            href={routes.home}
            onClick={onClose}
            aria-label="Thikana home"
            className="block w-fit transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark"
          >
            <ThikanaOwnerWordmark />
          </Link>

          <nav aria-label="Owner">
            <ul className="flex flex-col gap-1">
              {ownerNavItems.map((item) => {
                const isActive = Boolean(item.href && pathname === item.href);
                const className = `flex h-8 w-full items-center gap-2 rounded-lg px-3 font-inter text-[13px] transition-colors ${
                  isActive
                    ? "bg-white font-semibold text-brand-dark"
                    : "bg-transparent font-medium text-white/50 hover:bg-white/5 hover:text-white/80"
                }`;

                const content = (
                  <>
                    <Image
                      src={item.iconSrc}
                      alt=""
                      width={14}
                      height={14}
                      aria-hidden="true"
                      className={`size-3.5 shrink-0 ${
                        isActive ? "brightness-0" : "brightness-0 invert opacity-50"
                      }`}
                    />
                    <span className="min-w-0 flex-1 text-left">{item.label}</span>
                  </>
                );

                return (
                  <li key={item.id}>
                    {item.href ? (
                      <Link
                        href={item.href}
                        className={className}
                        aria-current={isActive ? "page" : undefined}
                        onClick={onClose}
                      >
                        {content}
                      </Link>
                    ) : (
                      <button type="button" className={className} disabled>
                        {content}
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        <div className="mt-auto flex flex-col gap-3 border-t border-[#e5e5e2] pt-4">
          <div className="flex items-center gap-2">
            <ProfileAvatar
              src={avatarSrc}
              size="lg"
              className="ring-1 ring-white/20"
              onError={() => setImageFailed(true)}
            />
            <div className="flex min-w-0 flex-col gap-1">
              <p className="truncate font-inter text-sm font-semibold text-white">
                {displayName}
              </p>
              <span className="inline-flex w-fit items-center rounded-full bg-[#f3f4f6] px-2 py-1 font-inter text-[11px] font-semibold text-[#6b7280]">
                Property Owner
              </span>
            </div>
          </div>
          <button
            type="button"
            disabled={signingOut}
            onClick={() => {
              onClose?.();
              void signOutUser();
            }}
            className="inline-flex h-10 w-full items-center justify-center rounded-lg border border-white/30 font-inter text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {signingOut ? "Signing out…" : "Sign out"}
          </button>
        </div>
      </aside>
    </>
  );
}
