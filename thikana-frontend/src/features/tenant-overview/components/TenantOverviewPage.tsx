"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ProfileAvatar } from "@/components/ui/ProfileAvatar";
import { routes } from "@/config/routes";
import { formatListingAddress } from "@/features/home-details/lib/listing-display";
import type {
  BookingRequest,
  BookingRequestStatus,
  RecommendedHome,
  TenantStatCard,
  TenantStatTone,
} from "@/features/tenant-overview/types/tenant-overview.types";
import { ApiError } from "@/lib/api/client";
import type { ListingDto } from "@/lib/api/listings";
import {
  checkSavedHome,
  removeSavedHome,
  saveHome,
} from "@/lib/api/saved-homes";
import {
  getTenantOverview,
  type BookingDto,
  type TenantOverviewData,
} from "@/lib/api/tenant";
import { useAuth } from "@/lib/auth/AuthProvider";

const FALLBACK_IMAGE = "/images/tenant/property-dhanmondi.png";

const hintStyles: Record<TenantStatTone, string> = {
  success: "bg-[#dcfce7] text-[#16a34a]",
  warning: "bg-[#fef3c7] text-[#f59e0b]",
  info: "bg-[#eff6ff] text-[#3b82f6]",
  neutral: "",
};

const statusStyles: Record<BookingRequestStatus, string> = {
  Approved: "bg-[#dcfce7] text-[#16a34a]",
  Pending: "bg-[#fef3c7] text-[#f59e0b]",
  Declined: "bg-[#fee2e2] text-[#dc2626]",
  Cancelled: "bg-[#fee2e2] text-[#dc2626]",
  "Under Review": "bg-[#eff6ff] text-[#3b82f6]",
};

function greetingPrefix() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function formatRequestedAt(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function mapBookingStatus(status: BookingDto["status"]): BookingRequestStatus {
  if (status === "approved") return "Approved";
  if (status === "pending") return "Pending";
  if (status === "cancelled") return "Cancelled";
  return "Declined";
}

function listingImage(listing: ListingDto) {
  return (
    listing.coverImageUrl ||
    listing.images[0]?.secureUrl ||
    FALLBACK_IMAGE
  );
}

function bookingToRow(booking: BookingDto): BookingRequest {
  const status = mapBookingStatus(booking.status);
  const declined = status === "Declined" || status === "Cancelled";
  return {
    id: booking.id,
    title: booking.listingTitle || "Listing",
    address: booking.listingAddress || "—",
    imageSrc: booking.listingImageUrl || FALLBACK_IMAGE,
    status,
    requestedAt: formatRequestedAt(booking.createdAt),
    ownerResponse: declined
      ? booking.declineReason ||
        (status === "Cancelled" ? "Cancelled" : "Declined by owner")
      : status === "Pending"
        ? "Awaiting..."
        : booking.ownerName || "—",
    ownerAvatarSrc: booking.ownerAvatarUrl || undefined,
    actionLabel: declined ? "Find Similar →" : "View Details",
    actionVariant: declined ? "link" : "button",
    highlight: declined,
    listingSlug: booking.listingSlug,
  };
}

function listingToRecommended(listing: ListingDto): RecommendedHome {
  const location = formatListingAddress(listing.address);
  return {
    id: listing.id,
    title: listing.title,
    location: location ? `📍 ${location}` : "📍 Bangladesh",
    price: `BDT ${listing.monthlyRent.toLocaleString("en-US")}`,
    imageSrc: listingImage(listing),
    beds: listing.beds,
    baths: listing.baths,
    sqft: `${listing.sizeSqft.toLocaleString("en-US")} sqft`,
    slug: listing.slug,
    listingId: listing.id,
  };
}

function buildStatCards(stats: TenantOverviewData["stats"]): TenantStatCard[] {
  return [
    {
      id: "saved",
      label: "Saved Homes",
      value: String(stats.savedHomes),
      hint:
        stats.savedHomes > 0
          ? "Ready when you are"
          : "Save homes while browsing",
      tone: "success",
      iconSrc: "/images/tenant/icon-stat-bookmark.svg",
    },
    {
      id: "bookings",
      label: "Active Bookings",
      value: String(stats.activeBookings),
      hint:
        stats.pendingBookings > 0
          ? `${stats.pendingBookings} awaiting response`
          : "No pending responses",
      tone: "warning",
      iconSrc: "/images/tenant/icon-stat-calendar.svg",
    },
    {
      id: "pending",
      label: "Pending Bookings",
      value: String(stats.pendingBookings),
      hint:
        stats.pendingBookings > 0
          ? "Waiting on owners"
          : "No pending requests",
      tone: "info",
      iconSrc: "/images/tenant/icon-stat-toolbox.svg",
    },
    {
      id: "profile",
      label: "Profile Score",
      value: `${stats.profileScore}%`,
      hint:
        stats.profileScore >= 100
          ? "Profile complete"
          : "Complete profile to boost to 100%",
      tone: "neutral",
      iconSrc: "/images/tenant/icon-star.svg",
      showProgress: true,
      progressPercent: Math.min(100, Math.max(0, stats.profileScore)),
    },
  ];
}

function TenantTopbar({
  greetingName,
  avatarUrl,
}: {
  greetingName: string;
  avatarUrl: string | null;
}) {
  return (
    <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <h1 className="font-inter text-xl font-bold text-brand-dark">
        {greetingPrefix()}, {greetingName} 👋
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
        <label className="sr-only" htmlFor="tenant-overview-search">
          Search houses, services
        </label>
        <input
          id="tenant-overview-search"
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
        <ProfileAvatar src={avatarUrl} size="sm" className="!size-8 !rounded-2xl" />
      </div>
    </header>
  );
}

function StatCard({ card }: { card: TenantStatCard }) {
  return (
    <div className="flex min-h-[178px] flex-col gap-4 rounded-2xl border border-[#e5e5e2] bg-white p-5">
      <div className="flex items-center justify-between">
        <Image
          src={card.iconSrc}
          alt=""
          width={20}
          height={20}
          aria-hidden="true"
          className="size-5"
        />
        <p className="font-inter text-xs font-bold uppercase text-[#6b7280]">
          {card.label}
        </p>
      </div>
      <p className="font-inter text-[40px] font-bold leading-none text-brand-dark">
        {card.value}
      </p>
      {card.showProgress ? (
        <div className="flex flex-col gap-2">
          <p className="font-inter text-[11px] text-[#6b7280]">{card.hint}</p>
          <div className="h-1 w-full overflow-hidden rounded-sm bg-[#f3f4f6]">
            <div
              className="h-full bg-brand-dark"
              style={{ width: `${card.progressPercent ?? 0}%` }}
            />
          </div>
        </div>
      ) : (
        <span
          className={`inline-flex w-fit rounded-full px-2.5 py-1 font-inter text-[11px] font-semibold ${hintStyles[card.tone]}`}
        >
          {card.hint}
        </span>
      )}
    </div>
  );
}

function BookingRequestsTable({
  requests,
  used,
  limit,
}: {
  requests: BookingRequest[];
  used: number;
  limit: number;
}) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-inter text-base font-bold text-brand-dark">
          My Recent Booking Requests
        </h2>
        <Link
          href={routes.tenantMyBookings}
          className="font-inter text-[13px] text-[#6b7280] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
        >
          View All →
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-[#e5e5e2] bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-[720px] w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-[#f0f0ee] bg-[#f9f9f8]">
                <th className="px-4 py-4 font-inter text-[11px] font-bold text-[#6b7280]">
                  PROPERTY
                </th>
                <th className="w-[100px] py-4 font-inter text-[11px] font-bold text-[#6b7280]">
                  STATUS
                </th>
                <th className="w-[100px] py-4 font-inter text-[11px] font-bold text-[#6b7280]">
                  REQUESTED
                </th>
                <th className="w-[140px] py-4 font-inter text-[11px] font-bold text-[#6b7280]">
                  OWNER RESPONSE
                </th>
                <th className="w-[100px] px-4 py-4 text-right font-inter text-[11px] font-bold text-[#6b7280]">
                  ACTION
                </th>
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-10 text-center font-inter text-sm text-[#6b7280]"
                  >
                    No booking requests yet.{" "}
                    <Link
                      href={routes.browseHome}
                      className="font-semibold text-brand-dark underline"
                    >
                      Browse homes
                    </Link>
                  </td>
                </tr>
              ) : (
                requests.map((request) => (
                  <tr
                    key={request.id}
                    className={`relative h-16 border-b border-[#f0f0ee] ${
                      request.highlight
                        ? "before:absolute before:inset-y-0 before:left-0 before:w-[3px] before:bg-[#f59e0b]"
                        : ""
                    }`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-[#f5f5f3]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={request.imageSrc}
                            alt=""
                            className="size-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-inter text-[13px] font-bold text-brand-dark">
                            {request.title}
                          </p>
                          <p className="font-inter text-xs text-[#6b7280]">
                            {request.address}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-flex rounded px-2.5 py-1 font-inter text-[11px] font-semibold ${statusStyles[request.status]}`}
                      >
                        {request.status}
                      </span>
                    </td>
                    <td className="py-3 font-inter text-[13px] text-brand-dark">
                      {request.requestedAt}
                    </td>
                    <td className="py-3">
                      {request.ownerAvatarSrc &&
                      request.ownerResponse !== "Awaiting..." ? (
                        <div className="flex items-center gap-2">
                          <div className="relative size-6 shrink-0 overflow-hidden rounded-xl bg-[#f5f5f3]">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={request.ownerAvatarSrc}
                              alt=""
                              className="size-full object-cover"
                            />
                          </div>
                          <span className="font-inter text-xs text-brand-dark">
                            {request.ownerResponse}
                          </span>
                        </div>
                      ) : (
                        <span
                          className={`font-inter text-xs ${
                            request.ownerResponse === "Awaiting..."
                              ? "text-[#6b7280]"
                              : "text-brand-dark"
                          }`}
                        >
                          {request.ownerResponse}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {request.actionVariant === "link" ? (
                        <Link
                          href={routes.browseHome}
                          className="font-inter text-[13px] font-bold text-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
                        >
                          {request.actionLabel}
                        </Link>
                      ) : (
                        <Link
                          href={
                            request.listingSlug
                              ? routes.homeDetailsFor(request.listingSlug)
                              : routes.browseHome
                          }
                          className="inline-flex rounded border border-brand-dark px-3 py-1.5 font-inter text-[11px] font-semibold text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
                        >
                          {request.actionLabel}
                        </Link>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-start justify-between gap-3 font-inter text-xs">
          <p className="text-[#6b7280]">
            Booking requests: {used} / {limit} used this month
          </p>
          <p className="font-semibold text-black">
            {used}/{limit}
          </p>
        </div>
        <div className="h-1 w-full overflow-hidden rounded-sm bg-[#f3f4f6]">
          <div
            className="h-full bg-brand-dark"
            style={{
              width: `${limit > 0 ? Math.min(100, (used / limit) * 100) : 0}%`,
            }}
          />
        </div>
      </div>
    </section>
  );
}

function RecommendedHomeCard({
  home,
  saved,
  busy,
  onToggleSave,
}: {
  home: RecommendedHome;
  saved: boolean;
  busy: boolean;
  onToggleSave: (home: RecommendedHome) => void;
}) {
  return (
    <article className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-[#e5e5e2] bg-white">
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
          aria-label={saved ? `Remove ${home.title}` : `Save ${home.title}`}
          disabled={busy}
          onClick={() => onToggleSave(home)}
          className="absolute right-3 top-3 flex size-7 items-center justify-center rounded-[14px] bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 disabled:opacity-60"
        >
          <Image
            src="/images/tenant/icon-bookmark-card.svg"
            alt=""
            width={14}
            height={14}
            aria-hidden="true"
            className={`size-3.5 ${saved ? "opacity-100" : "opacity-50"}`}
          />
        </button>
        <span className="absolute bottom-3 left-3 rounded bg-[#dcfce7] px-2 py-1 font-inter text-[10px] font-semibold text-[#16a34a]">
          ✓ Verified
        </span>
      </div>
      <div className="flex flex-col gap-3 p-4">
        <div className="flex flex-col gap-1">
          <h3 className="font-inter text-sm font-bold text-brand-dark">
            {home.title}
          </h3>
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
        <Link
          href={
            home.slug ? routes.homeDetailsFor(home.slug) : routes.browseHome
          }
          className="inline-flex h-9 w-full items-center justify-center rounded-md border border-brand-dark font-inter text-[13px] font-semibold text-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
        >
          View Details
        </Link>
      </div>
    </article>
  );
}

function SideWidgets() {
  return (
    <aside className="flex w-full flex-col gap-4 xl:w-[269px] xl:shrink-0">
      <div className="flex flex-col gap-5 rounded-xl border border-[#e5e5e2] bg-white p-5">
        <h2 className="font-inter text-sm font-bold text-brand-dark">
          Upcoming Service
        </h2>
        <div className="flex flex-col gap-2 rounded-lg bg-[#f9f9f8] px-3 py-4">
          <p className="font-inter text-sm font-bold text-brand-dark">
            No upcoming services
          </p>
          <p className="font-inter text-[13px] text-[#6b7280]">
            Service booking is coming soon. Browse trusted providers anytime.
          </p>
        </div>
        <Link
          href={routes.services}
          className="font-inter text-xs font-semibold text-brand-dark underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
        >
          Explore services →
        </Link>
      </div>

      <div className="flex flex-col gap-3 rounded-xl bg-brand-dark p-5">
        <p className="font-inter text-[15px] font-bold text-white">
          Need to move?
        </p>
        <p className="font-inter text-xs text-white/70">
          Find trusted packing & moving services at special tenant rates.
        </p>
        <Link
          href={routes.services}
          className="inline-flex w-fit items-center rounded-md bg-white px-4 py-2 font-inter text-xs font-bold text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark"
        >
          Learn More
        </Link>
      </div>
    </aside>
  );
}

export function TenantOverviewPage() {
  const { loading: authLoading, profile } = useAuth();
  const [data, setData] = useState<TenantOverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [saveBusyId, setSaveBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const overview = await getTenantOverview();
      setData(overview);

      const ids = overview.recommendedHomes.map((home) => home.id);
      if (ids.length) {
        const checks = await Promise.all(
          ids.map(async (id) => {
            try {
              const saved = await checkSavedHome(id);
              return saved ? id : null;
            } catch {
              return null;
            }
          })
        );
        setSavedIds(new Set(checks.filter(Boolean) as string[]));
      } else {
        setSavedIds(new Set());
      }
    } catch (err) {
      setError(
        err instanceof ApiError || err instanceof Error
          ? err.message
          : "Could not load overview"
      );
      setData(null);
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

  const toggleSave = async (home: RecommendedHome) => {
    if (!home.listingId) return;
    setSaveBusyId(home.listingId);
    try {
      const isSaved = savedIds.has(home.listingId);
      if (isSaved) {
        await removeSavedHome(home.listingId);
        setSavedIds((current) => {
          const next = new Set(current);
          next.delete(home.listingId!);
          return next;
        });
      } else {
        await saveHome(home.listingId);
        setSavedIds((current) => new Set(current).add(home.listingId!));
      }
    } catch (err) {
      setError(
        err instanceof ApiError || err instanceof Error
          ? err.message
          : "Could not update saved home"
      );
    } finally {
      setSaveBusyId(null);
    }
  };

  const statCards = useMemo(
    () => (data ? buildStatCards(data.stats) : []),
    [data]
  );
  const recentRows = useMemo(
    () => (data ? data.recentBookings.map(bookingToRow) : []),
    [data]
  );
  const homes = useMemo(
    () => (data ? data.recommendedHomes.map(listingToRecommended) : []),
    [data]
  );

  const avatarUrl =
    data?.avatarUrl || profile?.avatarUrl || null;
  const greetingName =
    data?.greetingName ||
    profile?.fullName?.split(" ")[0] ||
    "there";

  if (authLoading || loading) {
    return (
      <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-[50px] lg:py-[30px]">
        <p className="font-inter text-sm text-brand-dark/60">
          Loading overview…
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-[50px] lg:py-[30px]">
        <p role="alert" className="font-inter text-sm font-medium text-red-600">
          {error || "Could not load overview."}
        </p>
        <button
          type="button"
          onClick={() => void load()}
          className="mt-3 font-inter text-sm font-semibold text-brand-dark underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-[50px] lg:py-[30px]">
      <div className="flex w-full flex-col gap-6">
        <TenantTopbar greetingName={greetingName} avatarUrl={avatarUrl} />

        {error ? (
          <p
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 font-inter text-[13px] text-red-700"
          >
            {error}
          </p>
        ) : null}

        <div className="flex flex-col gap-4 xl:flex-row xl:items-start">
          <div className="flex min-w-0 flex-1 flex-col gap-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {statCards.map((card) => (
                <StatCard key={card.id} card={card} />
              ))}
            </div>

            <BookingRequestsTable
              requests={recentRows}
              used={data.bookingUsage.used}
              limit={data.bookingUsage.limit}
            />

            <section className="flex flex-col gap-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-inter text-base font-bold text-brand-dark">
                  Recommended For You
                </h2>
                <Link
                  href={routes.browseHome}
                  className="font-inter text-[13px] text-[#6b7280] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
                >
                  See All →
                </Link>
              </div>
              {homes.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {homes.map((home) => (
                    <RecommendedHomeCard
                      key={home.id}
                      home={home}
                      saved={savedIds.has(home.listingId || home.id)}
                      busy={saveBusyId === (home.listingId || home.id)}
                      onToggleSave={(item) => void toggleSave(item)}
                    />
                  ))}
                </div>
              ) : (
                <p className="rounded-xl border border-dashed border-[#e5e5e2] px-4 py-8 text-center font-inter text-sm text-[#6b7280]">
                  No recommendations yet.{" "}
                  <Link
                    href={routes.browseHome}
                    className="font-semibold text-brand-dark underline"
                  >
                    Browse homes
                  </Link>
                </p>
              )}
            </section>
          </div>

          <SideWidgets />
        </div>
      </div>
    </div>
  );
}
