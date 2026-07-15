"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  serviceProviderNavItems,
  serviceProviderUser,
} from "@/features/service-provider/data/service-provider.mock";

type ServiceProviderSidebarProps = {
  mobileOpen?: boolean;
  onClose?: () => void;
};

function ThikanaWordmark() {
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

export function ServiceProviderSidebar({
  mobileOpen = false,
  onClose,
}: ServiceProviderSidebarProps) {
  const pathname = usePathname();

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
        aria-label="Service provider navigation"
      >
        <div className="flex flex-col gap-6">
          <ThikanaWordmark />

          <nav aria-label="Service provider">
            <ul className="flex flex-col gap-1">
              {serviceProviderNavItems.map((item) => {
                const isActive = Boolean(item.href && pathname === item.href);
                const className = `flex w-full items-center gap-3 rounded-lg px-4 py-2.5 font-inter text-sm transition-colors ${
                  isActive
                    ? "bg-white font-semibold text-brand-dark"
                    : "bg-transparent font-medium text-white/50 hover:bg-white/5 hover:text-white/80"
                }`;

                const content = (
                  <>
                    <Image
                      src={item.iconSrc}
                      alt=""
                      width={18}
                      height={18}
                      aria-hidden="true"
                      className={`size-[18px] shrink-0 ${
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

        <div className="mt-auto border-t border-[#e5e5e2] pt-4">
          <div className="flex items-center gap-2">
            <div className="relative size-12 shrink-0 overflow-hidden rounded-full">
              <Image
                src={serviceProviderUser.avatarSrc}
                alt=""
                fill
                className="object-cover"
                sizes="48px"
              />
            </div>
            <div className="flex min-w-0 flex-col gap-1">
              <p className="truncate font-inter text-[15px] font-bold text-white">
                {serviceProviderUser.name}
              </p>
              <div className="flex flex-wrap items-center gap-1">
                <span className="inline-flex items-center rounded border border-[#f59e0b]/50 bg-[#fff7ed] px-1.5 py-0.5 font-inter text-[10px] font-semibold text-[#f59e0b]">
                  {serviceProviderUser.roleBadge}
                </span>
                <span className="font-inter text-[10px] font-semibold text-[#22c55e]">
                  {serviceProviderUser.verifiedLabel}
                </span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
