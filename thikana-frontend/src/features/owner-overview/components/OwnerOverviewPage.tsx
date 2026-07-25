"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { routes } from "@/config/routes";
import type {
  OwnerListingStatus,
  OwnerStatCard,
  OwnerStatTone,
  OwnerViewBar,
} from "@/features/owner-overview/types/owner-overview.types";
import { ApiError } from "@/lib/api/client";
import {
  listMyListings,
  type ListingDto,
  type ListingStatus,
} from "@/lib/api/listings";
import { useAuth } from "@/lib/auth/AuthProvider";

const FALLBACK_IMAGE = "/images/tenant/property-dhanmondi.png";

const listingStatusStyles: Record<OwnerListingStatus, string> = {
  "Verified & Live": "bg-[#dcfce7] text-[#16a34a]",
  "Under Review": "bg-[#fef3c7] text-[#f59e0b]",
  Draft: "bg-[#f3f4f6] text-[#6b7280]",
  Paused: "bg-[#eff6ff] text-[#3b82f6]",
  Rejected: "bg-[#fee2e2] text-[#dc2626]",
};

const hintStyles: Record<OwnerStatTone, string> = {
  success: "bg-[#dcfce7] text-[#16a34a]",
  warning: "bg-[#fef3c7] text-[#f59e0b]",
  info: "bg-[#eff6ff] text-[#3b82f6]",
};

function mapStatus(status: ListingStatus): OwnerListingStatus {
  if (status === "live") return "Verified & Live";
  if (status === "under_review") return "Under Review";
  if (status === "paused") return "Paused";
  if (status === "rejected") return "Rejected";
  return "Draft";
}

function firstName(fullName?: string | null) {
  if (!fullName?.trim()) return "there";
  return fullName.trim().split(/\s+/)[0];
}

function locationLabel(listing: ListingDto) {
  const parts = [
    listing.address.area,
    listing.address.street,
    listing.address.district,
  ].filter(Boolean);
  return parts.length ? `📍 ${parts.join(", ")}` : "📍 Location pending";
}

function coverSrc(listing: ListingDto) {
  return (
    listing.coverImageUrl ||
    listing.images[0]?.secureUrl ||
    FALLBACK_IMAGE
  );
}

function MiniListingCard({ listing }: { listing: ListingDto }) {
  const status = mapStatus(listing.status);

  return (
    <article className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-[#e5e5e2] bg-white">
      <div className="relative h-[140px] w-full bg-[#f5f5f3]">
        <Image
          src={coverSrc(listing)}
          alt={listing.title}
          fill
          className="object-cover"
          sizes="(max-width: 1023px) 100vw, 220px"
        />
      </div>
      <div className="flex flex-col gap-3 p-4">
        <div className="flex flex-col gap-1">
          <h3 className="font-inter text-sm font-bold text-brand-dark">
            {listing.title}
          </h3>
          <p className="font-inter text-xs text-[#6b7280]">
            {locationLabel(listing)}
          </p>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span
            className={`inline-flex rounded-full px-2 py-1 font-inter text-[11px] font-semibold ${listingStatusStyles[status]}`}
          >
            {status}
          </span>
          <span className="inline-flex items-center gap-1 font-inter text-xs text-[#6b7280]">
            <Image
              src="/images/owner/icon-eye.svg"
              alt=""
              width={12}
              height={12}
              aria-hidden="true"
              className="size-3"
            />
            Views: {listing.views || 0}
          </span>
        </div>
        <Link
          href={routes.ownerMyListings}
          className="inline-flex h-9 w-full items-center justify-center rounded-md border border-brand-dark font-inter text-[13px] font-semibold text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
        >
          Manage
        </Link>
      </div>
    </article>
  );
}

function ViewsChart({ bars }: { bars: OwnerViewBar[] }) {
  const max = Math.max(1, ...bars.map((item) => item.value));

  return (
    <section className="flex h-full min-h-[269px] w-full flex-col gap-6 rounded-2xl border border-[#e5e5e2] bg-white p-6 xl:w-[320px] xl:shrink-0">
      <div className="flex items-start justify-between gap-2">
        <h2 className="font-inter text-sm font-bold text-brand-dark">
          Views by listing
        </h2>
        <span className="font-inter text-[11px] text-[#6b7280]">
          {bars.reduce((sum, item) => sum + item.value, 0)} total
        </span>
      </div>
      {bars.length === 0 ? (
        <div className="flex flex-1 items-center justify-center rounded-xl bg-[#fafaf8] px-4 py-8 text-center">
          <p className="font-inter text-sm text-[#6b7280]">
            Views will appear here once tenants browse your listings.
          </p>
        </div>
      ) : (
        <div className="flex h-[180px] gap-3">
          <div className="flex h-full flex-col justify-between pb-5 text-right font-inter text-[11px] text-[#6b7280]">
            <span>{max}</span>
            <span>{Math.round(max / 2)}</span>
            <span>0</span>
          </div>
          <div className="relative flex min-w-0 flex-1 items-end justify-between gap-1">
            <div className="pointer-events-none absolute inset-0 flex flex-col justify-between pb-5">
              <div className="h-px w-full bg-[#e5e5e2]" />
              <div className="h-px w-full bg-[#e5e5e2]" />
              <div className="h-px w-full bg-[#e5e5e2]" />
            </div>
            {bars.map((item) => (
              <div
                key={item.id}
                className="relative z-10 flex min-w-0 flex-1 flex-col items-center gap-2"
                title={`${item.label}: ${item.value} views`}
              >
                <div
                  className="w-[25px] max-w-full rounded-t bg-brand-dark"
                  style={{
                    height: `${Math.max(4, (item.value / max) * 152)}px`,
                  }}
                />
                <span className="max-w-full truncate font-inter text-[10px] text-[#6b7280]">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function StatCard({ card }: { card: OwnerStatCard }) {
  return (
    <div className="flex min-h-[160px] flex-col justify-between rounded-2xl border border-[#e5e5e2] bg-white p-5">
      <div className="flex flex-col gap-3">
        <Image
          src={card.iconSrc}
          alt=""
          width={20}
          height={20}
          aria-hidden="true"
          className="size-5"
        />
        <div className="flex flex-col gap-1">
          <p className="font-inter text-xs font-semibold uppercase text-[#6b7280]">
            {card.label}
          </p>
          <p className="font-inter text-[36px] font-semibold leading-none text-brand-dark">
            {card.value}
          </p>
        </div>
      </div>
      <span
        className={`inline-flex w-fit rounded-full px-2 py-1 font-inter text-[11px] font-semibold ${hintStyles[card.tone]}`}
      >
        {card.hint}
      </span>
    </div>
  );
}

function buildStats(listings: ListingDto[]): OwnerStatCard[] {
  const live = listings.filter((item) => item.status === "live").length;
  const underReview = listings.filter(
    (item) => item.status === "under_review"
  ).length;
  const drafts = listings.filter((item) => item.status === "draft").length;
  const totalViews = listings.reduce((sum, item) => sum + (item.views || 0), 0);
  const totalBookings = listings.reduce(
    (sum, item) => sum + (item.bookingsCount || 0),
    0
  );
  const verifiedHint =
    underReview > 0
      ? `${underReview} pending review`
      : live === listings.length && listings.length > 0
        ? "All listings verified"
        : drafts > 0
          ? `${drafts} draft${drafts === 1 ? "" : "s"} left`
          : "Keep listings updated";

  return [
    {
      id: "active",
      label: "Active Listings",
      value: String(live),
      hint:
        live > 0
          ? "Live on Thikana"
          : listings.length > 0
            ? "None live yet"
            : "Create your first listing",
      tone: live > 0 ? "success" : "info",
      iconSrc: "/images/owner/icon-building.svg",
    },
    {
      id: "pending",
      label: "Under Review",
      value: String(underReview),
      hint: underReview > 0 ? "Awaiting admin review" : "No listings in review",
      tone: underReview > 0 ? "warning" : "success",
      iconSrc: "/images/owner/icon-calendar.svg",
    },
    {
      id: "views",
      label: "Total Views",
      value: totalViews.toLocaleString("en-US"),
      hint:
        totalBookings > 0
          ? `${totalBookings} booking signal${totalBookings === 1 ? "" : "s"}`
          : "From public listing pages",
      tone: totalViews > 0 ? "success" : "info",
      iconSrc: "/images/owner/icon-eye-stat.svg",
    },
    {
      id: "verified",
      label: "Verified Listings",
      value: `${live} / ${Math.max(listings.length, 0)}`,
      hint: verifiedHint,
      tone: underReview > 0 ? "info" : "success",
      iconSrc: "/images/owner/icon-check-circle.svg",
    },
  ];
}

export function OwnerOverviewPage() {
  const { profile, loading: authLoading } = useAuth();
  const [listings, setListings] = useState<ListingDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await listMyListings({
        limit: 50,
        sortBy: "createdAt",
        sortOrder: "desc",
      });
      setListings(response.data || []);
    } catch (err) {
      setError(
        err instanceof ApiError || err instanceof Error
          ? err.message
          : "Could not load overview"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void load();
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [load]);

  const filteredListings = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return listings;
    return listings.filter((listing) => {
      const haystack = [
        listing.title,
        listing.address.area,
        listing.address.district,
        listing.address.street,
        listing.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(needle);
    });
  }, [listings, query]);

  const previewListings = filteredListings.slice(0, 3);
  const stats = useMemo(() => buildStats(listings), [listings]);
  const viewBars = useMemo<OwnerViewBar[]>(() => {
    return [...listings]
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 7)
      .map((listing) => ({
        id: listing.id,
        label: listing.title.split(" ")[0] || "Listing",
        value: listing.views || 0,
      }));
  }, [listings]);

  const recentActivity = useMemo(() => {
    return [...listings]
      .sort((a, b) => {
        const aTime = new Date(a.updatedAt || a.createdAt || 0).getTime();
        const bTime = new Date(b.updatedAt || b.createdAt || 0).getTime();
        return bTime - aTime;
      })
      .slice(0, 6);
  }, [listings]);

  const avatarUrl = profile?.avatarUrl || null;
  const displayName = firstName(profile?.fullName);

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-[50px] lg:py-[30px]">
      <div className="flex w-full flex-col gap-6">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h1 className="font-inter text-xl font-bold text-brand-dark">
            Welcome back, {authLoading ? "…" : displayName} 👋
          </h1>

          <div className="flex h-10 w-full max-w-[309px] items-center gap-2 rounded-[20px] bg-[#f5f5f3] px-4">
            <Image
              src="/images/owner/icon-search.svg"
              alt=""
              width={14}
              height={14}
              aria-hidden="true"
              className="size-3.5 shrink-0"
            />
            <label className="sr-only" htmlFor="owner-overview-search">
              Search listings
            </label>
            <input
              id="owner-overview-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search your listings…"
              className="min-w-0 flex-1 bg-transparent font-inter text-[13px] text-brand-dark outline-none placeholder:text-[#6b7280]"
            />
          </div>

          <div className="flex items-center gap-4">
            <Link
              href={routes.ownerMessages}
              aria-label="Messages"
              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
            >
              <Image
                src="/images/owner/icon-bell.svg"
                alt=""
                width={24}
                height={20}
                aria-hidden="true"
                className="h-5 w-6"
              />
            </Link>
            <Link
              href={routes.ownerProfile}
              aria-label="Profile settings"
              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
            >
              <Image
                src="/images/owner/icon-settings.svg"
                alt=""
                width={20}
                height={20}
                aria-hidden="true"
                className="size-5"
              />
            </Link>
            <Link
              href={routes.ownerProfile}
              className="relative size-9 overflow-hidden rounded-full bg-[#e5e5e2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
            >
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="36px"
                />
              ) : (
                <span className="flex size-full items-center justify-center font-inter text-xs font-bold text-brand-dark/60">
                  {displayName.slice(0, 1).toUpperCase()}
                </span>
              )}
            </Link>
          </div>
        </header>

        {error ? (
          <p role="alert" className="font-inter text-sm font-medium text-red-600">
            {error}
          </p>
        ) : null}

        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-stretch gap-6 xl:flex-row xl:items-end">
              <div className="flex min-w-0 flex-1 flex-col gap-4">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="font-inter text-base font-bold text-black">
                    My Listings
                  </h2>
                  <Link
                    href={routes.ownerMyListings}
                    className="font-inter text-[13px] font-medium text-[#6b7280] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
                  >
                    Manage All →
                  </Link>
                </div>

                {loading ? (
                  <p className="rounded-xl border border-[#e5e5e2] bg-white p-6 font-inter text-sm text-[#6b7280]">
                    Loading your listings…
                  </p>
                ) : previewListings.length === 0 ? (
                  <div className="flex flex-col items-start gap-3 rounded-xl border border-dashed border-[#d9d9d6] bg-white p-6">
                    <p className="font-inter text-sm font-semibold text-brand-dark">
                      {query.trim()
                        ? "No listings match your search"
                        : "No listings yet"}
                    </p>
                    <p className="font-inter text-sm text-[#6b7280]">
                      {query.trim()
                        ? "Try a different title, area, or status."
                        : "Add a property to start getting views from tenants."}
                    </p>
                    {!query.trim() ? (
                      <Link
                        href={routes.ownerAddNewListing}
                        className="inline-flex h-10 items-center justify-center rounded-lg bg-brand-dark px-4 font-inter text-sm font-semibold text-white"
                      >
                        Add new listing
                      </Link>
                    ) : null}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {previewListings.map((listing) => (
                      <MiniListingCard key={listing.id} listing={listing} />
                    ))}
                  </div>
                )}
              </div>
              <ViewsChart bars={viewBars} />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((card) => (
                <StatCard key={card.id} card={card} />
              ))}
            </div>
          </div>

          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-inter text-base font-bold text-black">
                Recent listing activity
              </h2>
              <Link
                href={routes.ownerBookingRequests}
                className="font-inter text-[13px] font-medium text-[#6b7280]"
              >
                Booking requests →
              </Link>
            </div>
            <div className="overflow-hidden rounded-xl border border-[#e5e5e2] bg-white">
              <div className="hidden bg-[#f5f5f3] p-4 font-inter text-[11px] font-semibold uppercase text-[#6b7280] lg:flex lg:gap-6">
                <span className="min-w-0 flex-1">Listing</span>
                <span className="w-[140px] shrink-0">Status</span>
                <span className="w-[100px] shrink-0">Views</span>
                <span className="w-[140px] shrink-0">Updated</span>
                <span className="w-[120px] shrink-0 text-right">Action</span>
              </div>

              {loading ? (
                <p className="p-6 font-inter text-sm text-[#6b7280]">
                  Loading activity…
                </p>
              ) : recentActivity.length === 0 ? (
                <div className="flex flex-col items-center gap-3 p-10 text-center">
                  <p className="font-inter text-[15px] font-bold text-brand-dark">
                    No activity yet
                  </p>
                  <p className="max-w-md font-inter text-[13px] text-[#6b7280]">
                    When you publish listings, their status, views, and updates
                    will show up here. Tenant booking requests will also appear
                    once that feature goes live.
                  </p>
                  <Link
                    href={routes.ownerAddNewListing}
                    className="font-inter text-sm font-semibold text-brand-dark underline"
                  >
                    Create a listing
                  </Link>
                </div>
              ) : (
                recentActivity.map((listing) => {
                  const status = mapStatus(listing.status);
                  return (
                    <div
                      key={listing.id}
                      className="flex flex-col gap-3 border-b border-[#e5e5e2] p-4 last:border-b-0 lg:flex-row lg:items-center lg:gap-6"
                    >
                      <div className="flex min-w-0 flex-1 items-center gap-3">
                        <div className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-[#f5f5f3]">
                          <Image
                            src={coverSrc(listing)}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-inter text-[13px] font-bold text-brand-dark">
                            {listing.title}
                          </p>
                          <p className="truncate font-inter text-[11px] text-[#6b7280]">
                            {locationLabel(listing)}
                          </p>
                        </div>
                      </div>
                      <div className="w-full lg:w-[140px] lg:shrink-0">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 font-inter text-[11px] font-semibold ${listingStatusStyles[status]}`}
                        >
                          {status}
                        </span>
                      </div>
                      <p className="w-full font-inter text-[13px] text-[#6b7280] lg:w-[100px] lg:shrink-0">
                        {listing.views || 0} views
                      </p>
                      <p className="w-full font-inter text-[13px] text-[#6b7280] lg:w-[140px] lg:shrink-0">
                        {listing.updatedAt
                          ? new Date(listing.updatedAt).toLocaleDateString()
                          : "—"}
                      </p>
                      <div className="flex w-full justify-start lg:w-[120px] lg:shrink-0 lg:justify-end">
                        <Link
                          href={routes.ownerMyListings}
                          className="font-inter text-[13px] font-semibold text-black underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
