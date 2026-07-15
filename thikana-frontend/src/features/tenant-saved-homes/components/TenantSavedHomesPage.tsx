"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { routes } from "@/config/routes";
import { tenantUser } from "@/features/tenant/data/tenant.mock";
import { savedHomes as initialSavedHomes } from "@/features/tenant-saved-homes/data/tenant-saved-homes.mock";
import type { SavedHome } from "@/features/tenant-saved-homes/types/tenant-saved-homes.types";

function SavedHomeCard({
  home,
  onRemove,
}: {
  home: SavedHome;
  onRemove: (id: string) => void;
}) {
  return (
    <article className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-[#e5e5e2] bg-white">
      <div className="relative h-40 w-full">
        <Image
          src={home.imageSrc}
          alt={home.title}
          fill
          className="object-cover"
          sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
        />
        <span className="absolute left-3 top-3 rounded-md bg-brand-dark px-2 py-1.5 font-inter text-[11px] font-bold text-white">
          {home.price}
        </span>
        <button
          type="button"
          aria-label={`Saved ${home.title}`}
          className="absolute right-3 top-3 flex size-7 items-center justify-center rounded-[14px] bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
        >
          <Image
            src="/images/tenant/icon-bookmark-card.svg"
            alt=""
            width={14}
            height={14}
            aria-hidden="true"
            className="size-3.5"
          />
        </button>
        <span className="absolute bottom-3 left-3 rounded bg-[#dcfce7] px-2 py-1 font-inter text-[10px] font-semibold text-[#16a34a]">
          ✓ Verified
        </span>
      </div>

      <div className="flex flex-col gap-3 p-4">
        <div className="flex flex-col gap-1">
          <h2 className="font-inter text-sm font-bold text-brand-dark">{home.title}</h2>
          <p className="font-inter text-xs text-[#6b7280]">{home.location}</p>
        </div>

        <div className="flex items-center gap-3 font-inter text-xs text-[#6b7280]">
          <span className="inline-flex items-center gap-1">
            <Image
              src="/images/tenant/icon-bed.svg"
              alt=""
              width={14}
              height={14}
              aria-hidden="true"
              className="size-3.5"
            />
            {home.beds}
          </span>
          <span className="inline-flex items-center gap-1">
            <Image
              src="/images/tenant/icon-bath.svg"
              alt=""
              width={14}
              height={14}
              aria-hidden="true"
              className="size-3.5"
            />
            {home.baths}
          </span>
          <span className="inline-flex items-center gap-1">
            <Image
              src="/images/tenant/icon-sqft.svg"
              alt=""
              width={14}
              height={14}
              aria-hidden="true"
              className="size-3.5"
            />
            {home.sqft}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={routes.homeDetails}
            className="inline-flex h-9 min-w-0 flex-1 items-center justify-center rounded-md border border-brand-dark font-inter text-[13px] font-semibold text-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
          >
            View Details
          </Link>
          <button
            type="button"
            onClick={() => onRemove(home.id)}
            className="shrink-0 font-inter text-xs font-medium text-[#dc2626] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dc2626] focus-visible:ring-offset-2"
          >
            Remove
          </button>
        </div>
      </div>
    </article>
  );
}

function SavedHomesEmptyState() {
  return (
    <div className="mx-auto flex w-full max-w-[400px] flex-col items-center gap-5 rounded-2xl border border-dashed border-brand-dark/50 p-10">
      <div className="flex size-10 items-center justify-center rounded-[20px] bg-[#f5f5f3]">
        <Image
          src="/images/tenant/icon-stat-bookmark.svg"
          alt=""
          width={20}
          height={20}
          aria-hidden="true"
          className="size-5"
        />
      </div>
      <p className="font-inter text-[15px] text-brand-dark">No saved homes yet</p>
      <Link
        href={routes.browseHome}
        className="inline-flex items-center rounded-md bg-brand-dark px-5 py-2.5 font-inter text-[13px] font-bold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
      >
        Browse Houses
      </Link>
    </div>
  );
}

export function TenantSavedHomesPage() {
  const [homes, setHomes] = useState(initialSavedHomes);

  function handleRemove(id: string) {
    setHomes((current) => current.filter((home) => home.id !== id));
  }

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-[50px] lg:py-[30px]">
      <div className="flex w-full flex-col gap-6">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h1 className="font-inter text-xl font-bold text-brand-dark">Saved Homes</h1>

          <div className="flex h-10 w-full max-w-[360px] items-center gap-2 rounded-[20px] bg-[#f5f5f3] px-4">
            <Image
              src="/images/tenant/icon-search.svg"
              alt=""
              width={16}
              height={16}
              aria-hidden="true"
              className="size-4 shrink-0"
            />
            <label className="sr-only" htmlFor="tenant-saved-homes-search">
              Search houses, services
            </label>
            <input
              id="tenant-saved-homes-search"
              type="search"
              placeholder="Search houses, services..."
              className="min-w-0 flex-1 bg-transparent font-inter text-[13px] text-brand-dark outline-none placeholder:text-[#6b7280]"
            />
          </div>

          <div className="flex items-center gap-5">
            <button
              type="button"
              aria-label="Notifications"
              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
            >
              <Image
                src="/images/tenant/icon-bell.svg"
                alt=""
                width={24}
                height={24}
                aria-hidden="true"
                className="size-6"
              />
            </button>
            <button
              type="button"
              aria-label="Settings"
              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
            >
              <Image
                src="/images/tenant/icon-settings.svg"
                alt=""
                width={20}
                height={20}
                aria-hidden="true"
                className="size-5"
              />
            </button>
            <div className="relative size-8 overflow-hidden rounded-2xl">
              <Image
                src={tenantUser.topbarAvatarSrc}
                alt=""
                fill
                className="object-cover"
                sizes="32px"
              />
            </div>
          </div>
        </header>

        <div className="flex h-[60px] items-center justify-between rounded-2xl border border-[rgba(107,114,128,0.5)] bg-[#f5f5f3] px-4">
          <p className="font-inter text-base font-bold text-brand-dark">
            {homes.length} Saved Homes
          </p>
          <button
            type="button"
            className="rounded-lg border border-[#e5e5e2] bg-transparent px-3 py-2 font-inter text-[13px] text-[#6b7280] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
          >
            Sort by:{" "}
            <span className="font-semibold text-brand-dark">Recently Saved ▾</span>
          </button>
        </div>

        {homes.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {homes.map((home) => (
              <SavedHomeCard key={home.id} home={home} onRemove={handleRemove} />
            ))}
          </div>
        ) : (
          <SavedHomesEmptyState />
        )}
      </div>
    </div>
  );
}
