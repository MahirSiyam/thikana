import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { headerAuthActions } from "@/config/navigation";

const navPillBaseClasses =
  "inline-flex h-11 shrink-0 items-center justify-center gap-1 rounded-(--nav-pill-radius) border border-brand-dark px-3 text-sm font-medium leading-normal whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 md:h-[52px] md:px-3.5 md:text-[15px] lg:h-[59px] lg:px-4 lg:text-base";

type NavPillProps = {
  label: string;
  isActive?: boolean;
  hasChevron?: boolean;
  isChevronOpen?: boolean;
  href?: string;
  onClick?: () => void;
  className?: string;
};

export function NavPill({
  label,
  isActive = false,
  hasChevron = false,
  isChevronOpen = false,
  href,
  onClick,
  className = "",
}: NavPillProps) {
  const stateClasses = isActive
    ? "bg-brand-dark text-white"
    : "bg-transparent text-brand-dark hover:bg-brand-dark/5";

  const content = (
    <>
      <span>{label}</span>
      {hasChevron ? (
        <Image
          src="/images/home/icon-chevron-down.svg"
          alt=""
          width={14}
          height={14}
          aria-hidden="true"
          className={`shrink-0 transition-transform ${isChevronOpen ? "rotate-180" : ""}`}
        />
      ) : null}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        onClick={onClick}
        className={`${navPillBaseClasses} ${stateClasses} ${className}`}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-haspopup={hasChevron ? "true" : undefined}
      aria-expanded={hasChevron ? isChevronOpen : undefined}
      className={`${navPillBaseClasses} ${stateClasses} ${className}`}
    >
      {content}
    </button>
  );
}

type HeaderAuthActionsProps = {
  className?: string;
  onActionClick?: () => void;
  compact?: boolean;
};

export function HeaderAuthActions({
  className = "",
  onActionClick,
  compact = false,
}: HeaderAuthActionsProps) {
  return (
    <div className={`flex shrink-0 items-center justify-end gap-1.5 sm:gap-2 ${className}`}>
      {headerAuthActions.map((action) =>
        action.variant === "text" ? (
          <button
            key={action.label}
            type="button"
            onClick={onActionClick}
            className={`whitespace-nowrap px-1.5 font-semibold text-brand-dark transition-colors hover:text-brand-dark/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 ${
              compact ? "py-2 text-sm" : "py-2 text-sm md:py-3 md:text-[15px] lg:py-5 lg:text-base"
            }`}
          >
            {action.label}
          </button>
        ) : (
          <button
            key={action.label}
            type="button"
            onClick={onActionClick}
            className={`inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-(--nav-pill-radius) bg-brand-dark font-bold text-brand-light-text transition-colors hover:bg-brand-dark/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 ${
              compact
                ? "h-11 min-w-[88px] px-3 text-sm"
                : "h-11 min-w-[88px] px-3 text-sm md:h-[52px] md:min-w-[92px] md:text-[15px] lg:h-[59px] lg:min-w-[100px] lg:px-5 lg:text-base"
            }`}
          >
            {action.label}
          </button>
        ),
      )}
    </div>
  );
}

export function NavPillList({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <ul className={`flex flex-wrap items-center gap-2 md:gap-3 lg:gap-4 xl:gap-6 ${className}`}>
      {children}
    </ul>
  );
}
