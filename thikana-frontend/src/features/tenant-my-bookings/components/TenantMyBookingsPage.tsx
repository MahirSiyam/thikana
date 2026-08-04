"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ProfileAvatar } from "@/components/ui/ProfileAvatar";
import { routes } from "@/config/routes";
import type {
  MyBooking,
  MyBookingStatus,
  MyBookingsTabId,
} from "@/features/tenant-my-bookings/types/tenant-my-bookings.types";
import { ApiError } from "@/lib/api/client";
import {
  cancelBooking,
  listMyBookings,
  type BookingDto,
} from "@/lib/api/tenant";
import { useAuth } from "@/lib/auth/AuthProvider";

const FALLBACK_IMAGE = "/images/tenant/property-dhanmondi.png";
const FALLBACK_AVATAR = "/images/tenant/avatar-owner.png";

const myBookingsTabs: { id: MyBookingsTabId; label: string }[] = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "approved", label: "Approved" },
  { id: "declined", label: "Declined" },
];

const statusStyles: Record<
  MyBookingStatus,
  { badge: string; border: string }
> = {
  Approved: {
    badge: "bg-[#dcfce7] text-[#16a34a]",
    border: "border-l-[#16a34a]",
  },
  Pending: {
    badge: "bg-[#fef3c7] text-[#f59e0b]",
    border: "border-l-[#f48b19]",
  },
  Declined: {
    badge: "bg-[#fee2e2] text-[#dc2626]",
    border: "border-l-[#dc2626]",
  },
  Cancelled: {
    badge: "bg-[#fee2e2] text-[#dc2626]",
    border: "border-l-[#dc2626]",
  },
  "Under Review": {
    badge: "bg-[#eff6ff] text-[#3b82f6]",
    border: "border-l-[#3b82f6]",
  },
};

function mapStatus(status: BookingDto["status"]): MyBookingStatus {
  if (status === "approved") return "Approved";
  if (status === "pending") return "Pending";
  if (status === "cancelled") return "Cancelled";
  return "Declined";
}

function formatRequestedAt(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "Requested: —";
  return `Requested: ${date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })}`;
}

function bookingToCard(booking: BookingDto): MyBooking {
  return {
    id: booking.id,
    title: booking.listingTitle || "Listing",
    address: booking.listingAddress || "—",
    requestedAt: formatRequestedAt(booking.createdAt),
    status: mapStatus(booking.status),
    imageSrc: booking.listingImageUrl || FALLBACK_IMAGE,
    ownerId: booking.ownerId,
    ownerName: booking.ownerName || "Owner",
    ownerAvatarSrc: booking.ownerAvatarUrl || FALLBACK_AVATAR,
    canCancel: booking.status === "pending",
    listingSlug: booking.listingSlug,
  };
}

function BookingCard({
  booking,
  cancelling,
  onCancel,
}: {
  booking: MyBooking;
  cancelling: boolean;
  onCancel: (id: string) => void;
}) {
  const styles = statusStyles[booking.status];

  return (
    <article
      className={`flex flex-col gap-4 rounded-lg border-l-[5px] bg-white p-4 shadow-[0px_4px_10px_rgba(10,10,10,0.05)] sm:flex-row sm:items-center sm:justify-between sm:gap-6 ${styles.border}`}
    >
      <div className="flex min-w-0 flex-1 items-start gap-3 sm:items-center sm:gap-4">
        <div className="relative size-16 shrink-0 overflow-hidden rounded-[10px] bg-[#f5f5f3]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={booking.imageSrc}
            alt=""
            className="size-full object-cover"
          />
        </div>
        <div className="flex min-w-0 flex-col gap-1">
          <h2 className="font-inter text-[15px] font-bold text-brand-dark">
            {booking.title}
          </h2>
          <p className="font-inter text-[13px] text-[#6b7280]">
            {booking.address}
          </p>
          <p className="font-inter text-xs text-[#6b7280]">
            {booking.requestedAt}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 sm:gap-6 lg:gap-10">
        <span
          className={`inline-flex rounded px-2.5 py-1 font-inter text-[11px] font-semibold ${styles.badge}`}
        >
          {booking.status}
        </span>

        <div className="flex items-center gap-2">
          <div className="relative size-10 shrink-0 overflow-hidden rounded-[20px] bg-[#f5f5f3]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={booking.ownerAvatarSrc}
              alt=""
              className="size-full object-cover"
            />
          </div>
          <p className="font-inter text-xs font-medium text-black">
            {booking.ownerName}
          </p>
        </div>

        <div className="flex w-full items-center justify-end gap-4 sm:w-auto">
          <Link
            href={routes.tenantMessagesWith(booking.ownerId)}
            className="font-inter text-xs font-semibold text-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
          >
            Message
          </Link>
          {booking.canCancel ? (
            <button
              type="button"
              disabled={cancelling}
              onClick={() => onCancel(booking.id)}
              className="font-inter text-xs font-semibold text-[#dc2626] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dc2626] focus-visible:ring-offset-2 disabled:opacity-60"
            >
              {cancelling ? "Cancelling…" : "Cancel"}
            </button>
          ) : null}
          <Link
            href={
              booking.listingSlug
                ? routes.homeDetailsFor(booking.listingSlug)
                : routes.browseHome
            }
            className="inline-flex items-center rounded-md border border-brand-dark px-4 py-2 font-inter text-xs font-bold text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}

function BookingsEmptyState({ tab }: { tab: MyBookingsTabId }) {
  const label =
    tab === "pending"
      ? "No pending bookings"
      : tab === "approved"
        ? "No approved bookings"
        : tab === "declined"
          ? "No declined bookings"
          : "No bookings yet";

  return (
    <div className="mx-auto flex w-full max-w-[400px] flex-col items-center gap-5 rounded-2xl border border-dashed border-brand-dark/50 p-10">
      <div className="flex size-10 items-center justify-center rounded-[20px] bg-[#f5f5f3]">
        <Image
          src="/images/tenant/icon-x-circle.svg"
          alt=""
          width={20}
          height={20}
          aria-hidden="true"
          className="size-5"
        />
      </div>
      <p className="font-inter text-[15px] text-brand-dark">{label}</p>
      <Link
        href={routes.browseHome}
        className="inline-flex items-center rounded-md bg-brand-dark px-5 py-2.5 font-inter text-[13px] font-bold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
      >
        Browse Houses
      </Link>
    </div>
  );
}

export function TenantMyBookingsPage() {
  const { loading: authLoading, profile } = useAuth();
  const [activeTab, setActiveTab] = useState<MyBookingsTabId>("all");
  const [bookings, setBookings] = useState<MyBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const load = useCallback(async (status: MyBookingsTabId) => {
    setLoading(true);
    setError(null);
    try {
      const result = await listMyBookings({ status, limit: 50 });
      setBookings(result.items.map(bookingToCard));
    } catch (err) {
      setError(
        err instanceof ApiError || err instanceof Error
          ? err.message
          : "Could not load bookings"
      );
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;
    const timeout = window.setTimeout(() => {
      void load(activeTab);
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [authLoading, activeTab, load]);

  const handleCancel = async (id: string) => {
    const ok = window.confirm("Cancel this booking request?");
    if (!ok) return;
    setCancellingId(id);
    setError(null);
    try {
      await cancelBooking(id);
      await load(activeTab);
    } catch (err) {
      setError(
        err instanceof ApiError || err instanceof Error
          ? err.message
          : "Could not cancel booking"
      );
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-[50px] lg:py-[30px]">
      <div className="flex w-full flex-col gap-6">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h1 className="font-inter text-xl font-bold text-brand-dark">
            My Bookings
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
            <label className="sr-only" htmlFor="tenant-bookings-search">
              Search houses, services
            </label>
            <input
              id="tenant-bookings-search"
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

        <div
          role="tablist"
          aria-label="Booking status filters"
          className="flex gap-3 overflow-x-auto pb-1"
        >
          {myBookingsTabs.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex h-9 shrink-0 items-center rounded-lg px-4 font-inter text-[13px] transition-colors ${
                  isActive
                    ? "bg-brand-dark font-semibold text-white"
                    : "border border-[#e5e5e2] font-normal text-[#6b7280]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {error ? (
          <p
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 font-inter text-[13px] text-red-700"
          >
            {error}
          </p>
        ) : null}

        {authLoading || loading ? (
          <p className="font-inter text-sm text-brand-dark/60">
            Loading bookings…
          </p>
        ) : bookings.length > 0 ? (
          <div className="flex flex-col gap-4">
            {bookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                cancelling={cancellingId === booking.id}
                onCancel={(id) => void handleCancel(id)}
              />
            ))}
          </div>
        ) : (
          <BookingsEmptyState tab={activeTab} />
        )}
      </div>
    </div>
  );
}
