"use client";

import Image from "next/image";
import { useAuth } from "@/lib/auth/AuthProvider";

type ProviderTopbarProps = {
  title: string;
  searchId: string;
  searchLabel: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
};

export function ProviderTopbar({
  title,
  searchId,
  searchLabel,
  searchValue,
  onSearchChange,
}: ProviderTopbarProps) {
  const { profile } = useAuth();
  const avatarUrl = profile?.avatarUrl || null;
  const initial = (profile?.fullName || profile?.email || "P")
    .slice(0, 1)
    .toUpperCase();

  return (
    <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <h1 className="font-inter text-lg font-bold text-brand-dark sm:text-xl">
        {title}
      </h1>

      <div className="flex h-10 w-full max-w-[360px] items-center gap-2 rounded-[20px] bg-[#f5f5f3] px-4">
        <Image
          src="/images/service-provider/icon-search.svg"
          alt=""
          width={14}
          height={14}
          aria-hidden="true"
          className="size-3.5 shrink-0"
        />
        <label className="sr-only" htmlFor={searchId}>
          {searchLabel}
        </label>
        <input
          id={searchId}
          type="search"
          value={searchValue}
          onChange={(event) => onSearchChange?.(event.target.value)}
          placeholder={`${searchLabel}...`}
          className="min-w-0 flex-1 bg-transparent font-inter text-[13px] text-brand-dark outline-none placeholder:text-[#6b7280]"
        />
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          aria-label="Notifications"
          className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
        >
          <Image
            src="/images/service-provider/icon-bell.svg"
            alt=""
            width={24}
            height={20}
            aria-hidden="true"
            className="h-5 w-6"
          />
        </button>
        <button
          type="button"
          aria-label="Settings"
          className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
        >
          <Image
            src="/images/service-provider/icon-settings.svg"
            alt=""
            width={20}
            height={20}
            aria-hidden="true"
            className="size-5"
          />
        </button>
        {avatarUrl ? (
          <div className="relative size-9 overflow-hidden rounded-full">
            <Image
              src={avatarUrl}
              alt=""
              fill
              className="object-cover"
              sizes="36px"
            />
          </div>
        ) : (
          <div className="flex size-9 items-center justify-center rounded-full bg-brand-dark font-inter text-sm font-bold text-white">
            {initial}
          </div>
        )}
      </div>
    </header>
  );
}
