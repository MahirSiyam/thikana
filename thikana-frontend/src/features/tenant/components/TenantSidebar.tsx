"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { tenantNavItems } from "@/features/tenant/data/tenant.mock";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useDashboardSignOut } from "@/lib/auth/use-dashboard-sign-out";

type TenantSidebarProps = {
  mobileOpen?: boolean;
  onClose?: () => void;
};

function ThikanaTenantWordmark() {
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

export function TenantSidebar({ mobileOpen = false, onClose }: TenantSidebarProps) {
  const pathname = usePathname();
  const { profile } = useAuth();
  const { signingOut, signOutUser } = useDashboardSignOut({ scope: "user" });
  const displayName = profile?.fullName || profile?.email || "Tenant";

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
        aria-label="Tenant navigation"
      >
        <div className="flex flex-col gap-6">
          <ThikanaTenantWordmark />

          <nav aria-label="Tenant">
            <ul className="flex flex-col gap-1">
              {tenantNavItems.map((item) => {
                const isActive = Boolean(item.href && pathname === item.href);
                const className = `flex h-10 w-full items-center gap-3 rounded-lg px-4 font-inter text-[13px] transition-colors ${
                  isActive
                    ? "bg-white font-semibold text-brand-dark"
                    : "bg-transparent font-medium text-white/50 hover:bg-white/5 hover:text-white/80"
                }`;

                const content = (
                  <>
                    <Image
                      src={item.iconSrc}
                      alt=""
                      width={16}
                      height={16}
                      aria-hidden="true"
                      className={`size-4 shrink-0 ${
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
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white/10 font-inter text-sm font-bold text-white">
              {displayName.slice(0, 1).toUpperCase()}
            </div>
            <div className="flex min-w-0 flex-col gap-1">
              <p className="truncate font-inter text-sm font-semibold text-white">
                {displayName}
              </p>
              <span className="inline-flex w-fit items-center rounded-full bg-[#f3f4f6] px-2 py-1 font-inter text-[11px] font-semibold text-[#6b7280]">
                Tenant
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
