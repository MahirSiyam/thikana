"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminNavItems, adminUser } from "@/features/admin/data/admin.mock";

type AdminSidebarProps = {
  mobileOpen?: boolean;
  onClose?: () => void;
};

function ThikanaAdminWordmark() {
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

export function AdminSidebar({ mobileOpen = false, onClose }: AdminSidebarProps) {
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
        aria-label="Admin navigation"
      >
        <div className="flex flex-col gap-6">
          <ThikanaAdminWordmark />

          <nav aria-label="Admin">
            <ul className="flex flex-col gap-1">
              {adminNavItems.map((item) => {
                const isActive = Boolean(item.href && pathname === item.href);
                const className = `flex w-full items-center gap-3 rounded-lg px-4 py-2.5 font-inter text-sm transition-colors ${
                  isActive
                    ? "bg-white font-semibold text-black"
                    : "bg-transparent font-normal text-white/50 hover:bg-white/5 hover:text-white/80"
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

        <div className="mt-auto flex flex-col gap-2 pt-10">
          <span className="w-fit rounded bg-[#ef4444] px-2.5 py-1 font-inter text-[10px] font-bold uppercase text-white">
            {adminUser.badge}
          </span>
          <div className="flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white">
              <span className="font-inter text-sm font-semibold text-black">
                {adminUser.initials}
              </span>
            </div>
            <div className="min-w-0">
              <p className="truncate font-inter text-sm font-semibold text-white">
                {adminUser.name}
              </p>
              <p className="truncate font-inter text-[11px] text-white">
                {adminUser.role}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
