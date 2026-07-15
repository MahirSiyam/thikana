"use client";

import Image from "next/image";
import { useState } from "react";
import { ownerUser } from "@/features/owner/data/owner.mock";
import {
  ownerMiniListings,
  ownerOverviewStats,
  ownerRecentBookingRequests,
  ownerWeeklyViews,
} from "@/features/owner-overview/data/owner-overview.mock";
import type {
  OwnerBookingRequest,
  OwnerBookingStatus,
  OwnerListingStatus,
  OwnerMiniListing,
  OwnerStatCard,
  OwnerStatTone,
} from "@/features/owner-overview/types/owner-overview.types";

const listingStatusStyles: Record<OwnerListingStatus, string> = {
  "Verified & Live": "bg-[#dcfce7] text-[#16a34a]",
  "Under Review": "bg-[#fef3c7] text-[#f59e0b]",
};

const hintStyles: Record<OwnerStatTone, string> = {
  success: "bg-[#dcfce7] text-[#16a34a]",
  warning: "bg-[#fef3c7] text-[#f59e0b]",
  info: "bg-[#eff6ff] text-[#3b82f6]",
};

const bookingStatusStyles: Record<OwnerBookingStatus, string> = {
  Pending: "bg-[#fef3c7] text-[#f59e0b]",
  Accepted: "bg-[#dcfce7] text-[#16a34a]",
  Declined: "bg-[#f3f4f6] text-[#6b7280]",
};

const WEEKLY_MAX = 150;

function MiniListingCard({ listing }: { listing: OwnerMiniListing }) {
  return (
    <article className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-[#e5e5e2] bg-white">
      <div className="relative h-[140px] w-full">
        <Image
          src={listing.imageSrc}
          alt={listing.title}
          fill
          className="object-cover"
          sizes="(max-width: 1023px) 100vw, 220px"
        />
      </div>
      <div className="flex flex-col gap-3 p-4">
        <div className="flex flex-col gap-1">
          <h3 className="font-inter text-sm font-bold text-brand-dark">{listing.title}</h3>
          <p className="font-inter text-xs text-[#6b7280]">{listing.location}</p>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span
            className={`inline-flex rounded-full px-2 py-1 font-inter text-[11px] font-semibold ${listingStatusStyles[listing.status]}`}
          >
            {listing.status}
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
            Views: {listing.views}
          </span>
        </div>
        <button
          type="button"
          className="inline-flex h-9 w-full items-center justify-center rounded-md border border-brand-dark font-inter text-[13px] font-semibold text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
        >
          Edit
        </button>
      </div>
    </article>
  );
}

function ViewsChart() {
  return (
    <section className="flex h-full min-h-[269px] w-full flex-col gap-6 rounded-2xl border border-[#e5e5e2] bg-white p-6 xl:w-[320px] xl:shrink-0">
      <h2 className="font-inter text-sm font-bold text-brand-dark">Views This Week</h2>
      <div className="flex h-[180px] gap-3">
        <div className="flex h-full flex-col justify-between pb-5 text-right font-inter text-[11px] text-[#6b7280]">
          <span>150</span>
          <span>100</span>
          <span>50</span>
          <span>0</span>
        </div>
        <div className="relative flex min-w-0 flex-1 items-end justify-between">
          <div className="pointer-events-none absolute inset-0 flex flex-col justify-between pb-5">
            <div className="h-px w-full bg-[#e5e5e2]" />
            <div className="h-px w-full bg-[#e5e5e2]" />
            <div className="h-px w-full bg-[#e5e5e2]" />
            <div className="h-px w-full bg-[#e5e5e2]" />
          </div>
          {ownerWeeklyViews.map((item) => (
            <div
              key={item.day}
              className="relative z-10 flex min-w-0 flex-1 flex-col items-center gap-2"
            >
              <div
                className="w-[25px] max-w-full rounded-t bg-brand-dark"
                style={{ height: `${(item.value / WEEKLY_MAX) * 152}px` }}
              />
              <span className="font-inter text-[11px] text-[#6b7280]">{item.day}</span>
            </div>
          ))}
        </div>
      </div>
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

function BookingRow({
  request,
  onAccept,
  onDecline,
}: {
  request: OwnerBookingRequest;
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
}) {
  const isPending = request.status === "Pending";

  return (
    <div
      className={`flex flex-col gap-4 border-b border-[#e5e5e2] p-4 lg:flex-row lg:items-center lg:gap-6 ${
        isPending ? "border-l-[3px] border-l-[#f59e0b]" : ""
      }`}
    >
      <div className="flex w-full items-center gap-3 lg:w-[180px] lg:shrink-0">
        <div className="relative size-8 shrink-0 overflow-hidden rounded-full">
          <Image
            src={request.tenantAvatarSrc}
            alt=""
            fill
            className="object-cover"
            sizes="32px"
          />
        </div>
        <div className="flex min-w-0 flex-col gap-0.5">
          <p className="font-inter text-[13px] font-bold text-brand-dark">
            {request.tenantName}
          </p>
          <p className="font-inter text-[10px] font-semibold text-[#16a34a]">✓ Verified</p>
        </div>
      </div>

      <p className="min-w-0 flex-1 font-inter text-[13px] text-brand-dark">
        {request.property}
      </p>

      <p className="w-full font-inter text-[13px] text-[#6b7280] lg:w-[120px] lg:shrink-0">
        {request.requestedDate}
      </p>

      <div className="w-full lg:w-[120px] lg:shrink-0">
        <span
          className={`inline-flex rounded-full px-2 py-1 font-inter text-[11px] font-semibold ${bookingStatusStyles[request.status]}`}
        >
          {request.status}
        </span>
      </div>

      <div className="flex w-full items-center justify-start gap-2 lg:w-[160px] lg:shrink-0 lg:justify-end">
        {isPending ? (
          <>
            <button
              type="button"
              onClick={() => onAccept(request.id)}
              className="rounded bg-brand-dark px-3 py-1.5 font-inter text-xs font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
            >
              Accept
            </button>
            <button
              type="button"
              onClick={() => onDecline(request.id)}
              className="rounded border border-[#e5e5e2] px-3 py-1.5 font-inter text-xs font-semibold text-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
            >
              Decline
            </button>
          </>
        ) : (
          <button
            type="button"
            className="font-inter text-[13px] font-semibold text-black underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
          >
            View
          </button>
        )}
      </div>
    </div>
  );
}

export function OwnerOverviewPage() {
  const [requests, setRequests] = useState(ownerRecentBookingRequests);

  function handleAccept(id: string) {
    setRequests((current) =>
      current.map((request) =>
        request.id === id ? { ...request, status: "Accepted" } : request,
      ),
    );
  }

  function handleDecline(id: string) {
    setRequests((current) =>
      current.map((request) =>
        request.id === id ? { ...request, status: "Declined" } : request,
      ),
    );
  }

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-[50px] lg:py-[30px]">
      <div className="flex w-full flex-col gap-6">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h1 className="font-inter text-xl font-bold text-brand-dark">
            Welcome back, {ownerUser.firstName} 👋
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
              Search listings, tenants, messages
            </label>
            <input
              id="owner-overview-search"
              type="search"
              placeholder="Search listings, tenants, messages..."
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
                src="/images/owner/icon-bell.svg"
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
                src="/images/owner/icon-settings.svg"
                alt=""
                width={20}
                height={20}
                aria-hidden="true"
                className="size-5"
              />
            </button>
            <div className="relative size-9 overflow-hidden rounded-full">
              <Image
                src={ownerUser.topbarAvatarSrc}
                alt=""
                fill
                className="object-cover"
                sizes="36px"
              />
            </div>
          </div>
        </header>

        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-stretch gap-6 xl:flex-row xl:items-end">
              <div className="flex min-w-0 flex-1 flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-inter text-base font-bold text-black">My Listings</h2>
                  <button
                    type="button"
                    className="font-inter text-[13px] font-medium text-[#6b7280] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
                  >
                    Manage All →
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {ownerMiniListings.map((listing) => (
                    <MiniListingCard key={listing.id} listing={listing} />
                  ))}
                </div>
              </div>
              <ViewsChart />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {ownerOverviewStats.map((card) => (
                <StatCard key={card.id} card={card} />
              ))}
            </div>
          </div>

          <section className="flex flex-col gap-4">
            <h2 className="font-inter text-base font-bold text-black">
              Recent Booking Requests
            </h2>
            <div className="overflow-hidden rounded-xl border border-[#e5e5e2] bg-white">
              <div className="hidden bg-[#f5f5f3] p-4 font-inter text-[11px] font-semibold uppercase text-[#6b7280] lg:flex lg:gap-6">
                <span className="w-[180px] shrink-0">Tenant</span>
                <span className="min-w-0 flex-1">Property</span>
                <span className="w-[120px] shrink-0">Requested Date</span>
                <span className="w-[120px] shrink-0">Status</span>
                <span className="w-[160px] shrink-0 text-right">Action</span>
              </div>
              {requests.map((request) => (
                <BookingRow
                  key={request.id}
                  request={request}
                  onAccept={handleAccept}
                  onDecline={handleDecline}
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
