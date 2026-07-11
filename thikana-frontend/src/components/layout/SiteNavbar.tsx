"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  HeaderAuthActions,
  NavPill,
  NavPillList,
} from "@/components/layout/NavPill";
import { headerNavigation } from "@/config/navigation";
import { routes } from "@/config/routes";

function useHeaderNavItems() {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const renderNavItem = (item: (typeof headerNavigation)[number], onNavigate?: () => void) => {
    const isActive =
      item.variant === "link" && item.href !== undefined && pathname === item.href;

    if (item.variant === "link" && item.href) {
      return (
        <NavPill
          label={item.label}
          href={item.href}
          isActive={isActive}
          onClick={onNavigate}
          className={onNavigate ? "w-full justify-center" : undefined}
        />
      );
    }

    if (item.variant === "dropdown") {
      return (
        <NavPill
          label={item.label}
          hasChevron
          isChevronOpen={openDropdown === item.label}
          onClick={() =>
            setOpenDropdown((current) => (current === item.label ? null : item.label))
          }
          className={
            onNavigate
              ? "w-full justify-center"
              : item.label === "Browse Houses"
                ? "min-w-[7.5rem] justify-center md:min-w-[8.75rem] lg:min-w-[168px]"
                : undefined
          }
        />
      );
    }

    return (
      <NavPill
        label={item.label}
        onClick={onNavigate}
        className={onNavigate ? "w-full justify-center" : undefined}
      />
    );
  };

  return { openDropdown, setOpenDropdown, renderNavItem };
}

export function DesktopNav() {
  const { renderNavItem } = useHeaderNavItems();

  return (
    <div className="hidden min-w-0 md:flex md:w-full md:items-center md:justify-between md:gap-3 lg:gap-4 xl:gap-6">
      <nav aria-label="Main" className="min-w-0 flex-1">
        <div className="overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] md:overflow-visible md:pb-0 [&::-webkit-scrollbar]:hidden">
          <NavPillList className="w-max md:w-auto md:flex-wrap">
            {headerNavigation.map((item) => (
              <li key={item.label}>{renderNavItem(item)}</li>
            ))}
          </NavPillList>
        </div>
      </nav>
      <HeaderAuthActions className="ml-2 lg:ml-4" />
    </div>
  );
}

export function MobileNavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const { renderNavItem, setOpenDropdown } = useHeaderNavItems();

  const closeMenu = () => {
    setIsOpen(false);
    setOpenDropdown(null);
  };

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <div className="flex w-full items-center justify-between gap-3 md:hidden">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls="mobile-nav-menu"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        onClick={() => setIsOpen((prev) => !prev)}
        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-(--nav-pill-radius) border border-brand-dark text-brand-dark transition-colors hover:bg-brand-dark/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
      >
        <svg
          aria-hidden="true"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>
      <HeaderAuthActions compact onActionClick={closeMenu} />
      {isOpen ? (
        <>
          <button
            type="button"
            aria-label="Close menu backdrop"
            className="fixed inset-0 z-40 bg-brand-dark/20"
            onClick={closeMenu}
          />
          <nav
            id="mobile-nav-menu"
            aria-label="Main"
            className="absolute inset-x-0 top-full z-50 max-h-[min(28rem,calc(100dvh-5rem))] overflow-y-auto border-b border-white/70 bg-surface/85 px-4 py-4 shadow-[0_8px_32px_rgba(10,10,10,0.06)] backdrop-blur-md sm:px-6"
          >
            <ul className="flex flex-col gap-3">
              {headerNavigation.map((item) => (
                <li key={item.label}>{renderNavItem(item, closeMenu)}</li>
              ))}
            </ul>
          </nav>
        </>
      ) : null}
    </div>
  );
}

export function SiteLogoLink() {
  return (
    <Link
      href={routes.home}
      className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-(--nav-pill-radius) focus:bg-brand-dark focus:px-4 focus:py-2 focus:text-white"
    >
      Thikana
    </Link>
  );
}
