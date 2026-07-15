"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { routes } from "@/config/routes";
import {
  ownerMyListings,
  ownerMyListingsTabs,
  ownerReviewBanner,
} from "@/features/owner-my-listings/data/owner-my-listings.mock";
import type {
  OwnerListingCardStatus,
  OwnerMyListing,
  OwnerMyListingsTabId,
} from "@/features/owner-my-listings/types/owner-my-listings.types";

const statusStyles: Record<OwnerListingCardStatus, string> = {
  "Verified & Live": "bg-[#dcfce7] text-[#16a34a]",
  "Under Review": "bg-[#fef3c7] text-[#f59e0b]",
  Draft: "bg-[#f3f4f6] text-[#6b7280]",
};

function formatPrice(priceBdt: number): string {
  return priceBdt.toLocaleString("en-US");
}

function formatSqft(sqft: number): string {
  return sqft.toLocaleString("en-US");
}

function matchesTab(listing: OwnerMyListing, tab: OwnerMyListingsTabId): boolean {
  if (tab === "all") return true;
  if (tab === "live") return listing.status === "Verified & Live";
  if (tab === "under-review") return listing.status === "Under Review";
  return listing.status === "Draft";
}

function getTabCount(tab: OwnerMyListingsTabId): number {
  return ownerMyListings.filter((listing) => matchesTab(listing, tab)).length;
}

function ViewsTrendIcon({ trend }: { trend: OwnerMyListing["viewsTrend"] }) {
  if (trend === "up") {
    return <span aria-hidden="true">↑</span>;
  }
  if (trend === "flat") {
    return <span aria-hidden="true">→</span>;
  }
  return null;
}

function ListingCard({ listing }: { listing: OwnerMyListing }) {
  return (
    <article className="flex flex-col gap-4 rounded-xl border border-[#e5e5e2] bg-white p-4 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
      <div className="flex min-w-0 flex-1 items-start gap-4">
        <div className="relative size-20 shrink-0 overflow-hidden rounded-lg">
          <Image
            src={listing.imageSrc}
            alt=""
            fill
            className="object-cover"
            sizes="80px"
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex flex-col gap-0.5">
            <h2 className="font-inter text-[15px] font-bold text-brand-dark">
              {listing.title}
            </h2>
            <p className="font-inter text-[13px] text-[#6b7280]">{listing.address}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex rounded-full bg-[#f5f5f3] px-2.5 py-1 font-inter text-[11px] font-medium text-[#6b7280]">
              🛏 {listing.beds} Bed
            </span>
            <span className="inline-flex rounded-full bg-[#f5f5f3] px-2.5 py-1 font-inter text-[11px] font-medium text-[#6b7280]">
              🚿 {listing.baths} Bath
            </span>
            <span className="inline-flex rounded-full bg-[#f5f5f3] px-2.5 py-1 font-inter text-[11px] font-medium text-[#6b7280]">
              {formatSqft(listing.sqft)} sqft
            </span>
          </div>

          <p className="font-inter text-sm font-bold text-brand-dark">
            BDT {formatPrice(listing.priceBdt)} /mo
          </p>
        </div>
      </div>

      <div className="flex w-full flex-col gap-4 border-t border-[#e5e5e2] pt-4 lg:w-auto lg:shrink-0 lg:items-end lg:border-t-0 lg:pt-0">
        <span
          className={`inline-flex w-fit rounded-full px-2.5 py-1 font-inter text-[11px] font-semibold ${statusStyles[listing.status]}`}
        >
          {listing.status}
        </span>

        <div className="flex flex-wrap items-center gap-4 font-inter text-xs text-[#6b7280] lg:justify-end">
          <span className="inline-flex items-center gap-1">
            Views: {listing.views} <ViewsTrendIcon trend={listing.viewsTrend} />
          </span>
          <span>Bookings: {listing.bookings}</span>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            className="font-inter text-[13px] font-semibold text-black underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
          >
            Edit
          </button>
          {listing.status === "Verified & Live" ? (
            <button
              type="button"
              className="font-inter text-[13px] font-semibold text-black underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
            >
              Pause
            </button>
          ) : null}
          <button
            type="button"
            className="font-inter text-[13px] font-semibold text-[#dc2626] underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dc2626] focus-visible:ring-offset-2"
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}

export function OwnerMyListingsPage() {
  const [activeTab, setActiveTab] = useState<OwnerMyListingsTabId>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const visibleListings = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return ownerMyListings.filter((listing) => {
      if (!matchesTab(listing, activeTab)) return false;
      if (!normalizedQuery) return true;

      return (
        listing.title.toLowerCase().includes(normalizedQuery) ||
        listing.address.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [activeTab, searchQuery]);

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-[50px] lg:py-[30px]">
      <div className="flex w-full flex-col gap-6">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h1 className="font-inter text-xl font-bold text-brand-dark">My Listings</h1>

          <div className="flex h-10 w-full max-w-[309px] items-center gap-2 rounded-[20px] bg-[#f5f5f3] px-4">
            <Image
              src="/images/owner/icon-search.svg"
              alt=""
              width={14}
              height={14}
              aria-hidden="true"
              className="size-3.5 shrink-0"
            />
            <label className="sr-only" htmlFor="owner-listings-search">
              Search listings, tenants, messages
            </label>
            <input
              id="owner-listings-search"
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search listings, tenants, messages..."
              className="min-w-0 flex-1 bg-transparent font-inter text-[13px] text-brand-dark outline-none placeholder:text-[#6b7280]"
            />
          </div>

          <Link
            href={routes.ownerAddNewListing}
            className="inline-flex h-10 shrink-0 items-center justify-center rounded-md bg-brand-dark px-4 font-inter text-[13px] font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
          >
            + Add New Listing
          </Link>
        </header>

        <div className="flex items-start gap-3 rounded-lg border-l-[3px] border-l-[#f59e0b] bg-[#fffbeb] px-4 py-3">
          <Image
            src="/images/owner/icon-alert.svg"
            alt=""
            width={16}
            height={16}
            aria-hidden="true"
            className="mt-0.5 size-4 shrink-0"
          />
          <div className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <p className="font-inter text-[13px] text-brand-dark">{ownerReviewBanner.message}</p>
            <button
              type="button"
              onClick={() => setActiveTab("under-review")}
              className="shrink-0 font-inter text-[13px] font-semibold text-[#f59e0b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f59e0b] focus-visible:ring-offset-2"
            >
              View Status →
            </button>
          </div>
        </div>

        <div
          role="tablist"
          aria-label="Listing status filters"
          className="flex gap-8 overflow-x-auto border-b border-[#e5e5e2]"
        >
          {ownerMyListingsTabs.map((tab) => {
            const isActive = tab.id === activeTab;
            const count = getTabCount(tab.id);

            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.id)}
                className={`shrink-0 border-b-2 pb-3 font-inter text-sm whitespace-nowrap transition-colors ${
                  isActive
                    ? "border-brand-dark font-bold text-brand-dark"
                    : "border-transparent font-medium text-[#6b7280]"
                }`}
              >
                {tab.label} ({count})
              </button>
            );
          })}
        </div>

        {visibleListings.length > 0 ? (
          <div className="flex flex-col gap-4">
            {visibleListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <p className="font-inter text-sm text-[#6b7280]">No listings match your filters.</p>
        )}
      </div>
    </div>
  );
}
