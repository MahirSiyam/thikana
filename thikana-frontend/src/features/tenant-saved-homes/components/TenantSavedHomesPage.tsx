"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ProfileAvatar } from "@/components/ui/ProfileAvatar";
import { routes } from "@/config/routes";
import type { SavedHome } from "@/features/tenant-saved-homes/types/tenant-saved-homes.types";
import { ApiError } from "@/lib/api/client";
import {
  listSavedHomes,
  removeSavedHome,
  type SavedHomeDto,
} from "@/lib/api/saved-homes";
import { useAuth } from "@/lib/auth/AuthProvider";

const FALLBACK_IMAGE = "/images/tenant/property-dhanmondi.png";

function dtoToSavedHome(item: SavedHomeDto): SavedHome {
  return {
    id: item.id,
    listingId: item.listingId,
    slug: item.slug,
    title: item.title,
    location: item.location ? `📍 ${item.location}` : "📍 Bangladesh",
    price: `BDT ${item.monthlyRent.toLocaleString("en-US")}`,
    imageSrc: item.imageUrl || FALLBACK_IMAGE,
    beds: item.beds,
    baths: item.baths,
    sqft: `${item.sizeSqft.toLocaleString("en-US")} sqft`,
  };
}

function SavedHomeCard({
  home,
  removing,
  onRemove,
}: {
  home: SavedHome;
  removing: boolean;
  onRemove: (listingId: string) => void;
}) {
  return (
    <article className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-[#e5e5e2] bg-white">
      <div className="relative h-40 w-full bg-[#f5f5f3]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={home.imageSrc}
          alt={home.title}
          className="size-full object-cover"
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
          <h2 className="font-inter text-sm font-bold text-brand-dark">
            {home.title}
          </h2>
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
            href={
              home.slug ? routes.homeDetailsFor(home.slug) : routes.browseHome
            }
            className="inline-flex h-9 min-w-0 flex-1 items-center justify-center rounded-md border border-brand-dark font-inter text-[13px] font-semibold text-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
          >
            View Details
          </Link>
          <button
            type="button"
            disabled={removing}
            onClick={() => onRemove(home.listingId)}
            className="shrink-0 font-inter text-xs font-medium text-[#dc2626] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dc2626] focus-visible:ring-offset-2 disabled:opacity-60"
          >
            {removing ? "Removing…" : "Remove"}
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
  const { loading: authLoading, profile } = useAuth();
  const [homes, setHomes] = useState<SavedHome[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const items = await listSavedHomes();
      setHomes(items.map(dtoToSavedHome));
    } catch (err) {
      setError(
        err instanceof ApiError || err instanceof Error
          ? err.message
          : "Could not load saved homes"
      );
      setHomes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;
    const timeout = window.setTimeout(() => {
      void load();
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [authLoading, load]);

  const handleRemove = async (listingId: string) => {
    setRemovingId(listingId);
    setError(null);
    try {
      await removeSavedHome(listingId);
      setHomes((current) =>
        current.filter((home) => home.listingId !== listingId)
      );
    } catch (err) {
      setError(
        err instanceof ApiError || err instanceof Error
          ? err.message
          : "Could not remove saved home"
      );
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-[50px] lg:py-[30px]">
      <div className="flex w-full flex-col gap-6">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h1 className="font-inter text-xl font-bold text-brand-dark">
            Saved Homes
          </h1>

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
            <ProfileAvatar
              src={profile?.avatarUrl}
              size="sm"
              className="!size-8 !rounded-2xl"
            />
          </div>
        </header>

        {error ? (
          <p
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 font-inter text-[13px] text-red-700"
          >
            {error}
          </p>
        ) : null}

        <div className="flex h-[60px] items-center justify-between rounded-2xl border border-[rgba(107,114,128,0.5)] bg-[#f5f5f3] px-4">
          <p className="font-inter text-base font-bold text-brand-dark">
            {homes.length} Saved Homes
          </p>
          <button
            type="button"
            className="rounded-lg border border-[#e5e5e2] bg-transparent px-3 py-2 font-inter text-[13px] text-[#6b7280] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
          >
            Sort by:{" "}
            <span className="font-semibold text-brand-dark">
              Recently Saved ▾
            </span>
          </button>
        </div>

        {authLoading || loading ? (
          <p className="font-inter text-sm text-brand-dark/60">
            Loading saved homes…
          </p>
        ) : homes.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {homes.map((home) => (
              <SavedHomeCard
                key={home.id}
                home={home}
                removing={removingId === home.listingId}
                onRemove={(listingId) => void handleRemove(listingId)}
              />
            ))}
          </div>
        ) : (
          <SavedHomesEmptyState />
        )}
      </div>
    </div>
  );
}
