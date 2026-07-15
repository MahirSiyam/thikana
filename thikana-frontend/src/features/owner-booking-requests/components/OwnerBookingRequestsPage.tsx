"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { routes } from "@/config/routes";
import { ownerUser } from "@/features/owner/data/owner.mock";
import {
  ownerBookingRequestTabs,
  ownerBookingRequests,
} from "@/features/owner-booking-requests/data/owner-booking-requests.mock";
import type {
  OwnerBookingRequest,
  OwnerBookingRequestStatus,
  OwnerBookingRequestTabId,
} from "@/features/owner-booking-requests/types/owner-booking-requests.types";

function statusForTab(tab: OwnerBookingRequestTabId): OwnerBookingRequestStatus {
  if (tab === "new") return "New";
  if (tab === "accepted") return "Accepted";
  if (tab === "declined") return "Declined";
  return "Expired";
}

function matchesTab(request: OwnerBookingRequest, tab: OwnerBookingRequestTabId): boolean {
  return request.status === statusForTab(tab);
}

function AcceptedEmptyState({ subtitle }: { subtitle?: string }) {
  return (
    <div className="flex w-full flex-col items-center gap-4 rounded-xl border border-[#e5e5e2] bg-white p-10 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-[#dcfce7]">
        <Image
          src="/images/owner/icon-check-circle.svg"
          alt=""
          width={24}
          height={24}
          aria-hidden="true"
          className="size-6"
        />
      </div>
      <div className="flex flex-col gap-1">
        <p className="font-inter text-[15px] font-bold text-brand-dark">
          No accepted bookings yet
        </p>
        <p className="font-inter text-[13px] text-[#6b7280]">
          {subtitle ?? "Accepted requests will appear here once you approve a tenant."}
        </p>
      </div>
    </div>
  );
}

function TabEmptyState({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mx-auto flex w-full max-w-[400px] flex-col items-center gap-4 rounded-xl border border-dashed border-[#e5e5e2] bg-white p-10 text-center">
      <div className="flex size-10 items-center justify-center rounded-full bg-[#f5f5f3]">
        <Image
          src="/images/owner/icon-calendar-check.svg"
          alt=""
          width={20}
          height={20}
          aria-hidden="true"
          className="size-5"
        />
      </div>
      <div className="flex flex-col gap-1">
        <p className="font-inter text-[15px] font-bold text-brand-dark">{title}</p>
        <p className="font-inter text-[13px] text-[#6b7280]">{subtitle}</p>
      </div>
    </div>
  );
}

function BookingRequestCard({
  request,
  showActions = false,
  onAccept,
  onDecline,
}: {
  request: OwnerBookingRequest;
  showActions?: boolean;
  onAccept?: (id: string) => void;
  onDecline?: (id: string) => void;
}) {
  return (
    <article className="flex flex-col gap-5 rounded-xl border border-[#e5e5e2] bg-white p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative size-12 shrink-0 overflow-hidden rounded-full">
            <Image
              src={request.tenantAvatarSrc}
              alt=""
              fill
              className="object-cover"
              sizes="48px"
            />
          </div>
          <div className="flex min-w-0 flex-col gap-0.5">
            <p className="font-inter text-[15px] font-bold text-brand-dark">
              {request.tenantName}
            </p>
            <p className="font-inter text-[11px] font-semibold text-[#16a34a]">
              ✓ ID Verified
            </p>
          </div>
        </div>
        <p className="shrink-0 font-inter text-xs text-[#6b7280]">{request.timeAgo}</p>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <p className="font-inter text-[13px] text-brand-dark">
            Requesting for:{" "}
            <span className="font-bold">{request.propertyName}</span>
          </p>
          <p className="font-inter text-[13px] text-[#6b7280]">
            Move-in date: <span className="text-brand-dark">{request.moveInDate}</span>
          </p>
          <p className="font-inter text-[13px] italic text-[#6b7280]">
            &ldquo;{request.note}&rdquo;
          </p>
        </div>
        <div className="relative size-12 shrink-0 overflow-hidden rounded-lg">
          <Image
            src={request.propertyImageSrc}
            alt=""
            fill
            className="object-cover"
            sizes="48px"
          />
        </div>
      </div>

      {showActions ? (
        <div className="flex flex-wrap items-center justify-end gap-3 sm:gap-4">
          <Link
            href={routes.ownerMessages}
            className="font-inter text-[13px] font-semibold text-black underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
          >
            Message Tenant
          </Link>
          <button
            type="button"
            onClick={() => onDecline?.(request.id)}
            className="inline-flex h-9 items-center justify-center rounded-md border border-[#e5e5e2] px-4 font-inter text-[13px] font-semibold text-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => onAccept?.(request.id)}
            className="inline-flex h-9 items-center justify-center rounded-md bg-brand-dark px-4 font-inter text-[13px] font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
          >
            Accept
          </button>
        </div>
      ) : (
        <div className="flex justify-end">
          <Link
            href={routes.ownerMessages}
            className="font-inter text-[13px] font-semibold text-black underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
          >
            Message Tenant
          </Link>
        </div>
      )}
    </article>
  );
}

export function OwnerBookingRequestsPage() {
  const [requests, setRequests] = useState(ownerBookingRequests);
  const [activeTab, setActiveTab] = useState<OwnerBookingRequestTabId>("new");

  const visibleRequests = useMemo(
    () => requests.filter((request) => matchesTab(request, activeTab)),
    [requests, activeTab],
  );

  const acceptedRequests = useMemo(
    () => requests.filter((request) => request.status === "Accepted"),
    [requests],
  );

  function getTabCount(tab: OwnerBookingRequestTabId): number {
    return requests.filter((request) => matchesTab(request, tab)).length;
  }

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

  function renderTabContent() {
    if (activeTab === "new") {
      return (
        <div className="flex flex-col gap-10">
          {visibleRequests.length > 0 ? (
            <div className="flex flex-col gap-4">
              {visibleRequests.map((request) => (
                <BookingRequestCard
                  key={request.id}
                  request={request}
                  showActions
                  onAccept={handleAccept}
                  onDecline={handleDecline}
                />
              ))}
            </div>
          ) : (
            <TabEmptyState
              title="No new requests"
              subtitle="You're all caught up. New booking requests will appear here."
            />
          )}

          <section className="flex flex-col gap-4">
            <h2 className="font-inter text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">
              Accepted Requests Preview
            </h2>
            {acceptedRequests.length > 0 ? (
              <div className="flex flex-col gap-4">
                {acceptedRequests.map((request) => (
                  <BookingRequestCard key={request.id} request={request} />
                ))}
              </div>
            ) : (
              <AcceptedEmptyState />
            )}
          </section>
        </div>
      );
    }

    if (visibleRequests.length > 0) {
      return (
        <div className="flex flex-col gap-4">
          {visibleRequests.map((request) => (
            <BookingRequestCard key={request.id} request={request} />
          ))}
        </div>
      );
    }

    if (activeTab === "accepted") {
      return (
        <AcceptedEmptyState subtitle="When you accept a tenant request, it will show up in this tab." />
      );
    }

    if (activeTab === "declined") {
      return (
        <TabEmptyState
          title="No declined requests"
          subtitle="Requests you decline will be listed here for your records."
        />
      );
    }

    return (
      <TabEmptyState
        title="No expired requests"
        subtitle="Requests that pass their response window will appear here."
      />
    );
  }

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-[50px] lg:py-[30px]">
      <div className="flex w-full flex-col gap-6">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h1 className="font-inter text-xl font-bold text-brand-dark">Booking Requests</h1>

          <div className="flex h-10 w-full max-w-[309px] items-center gap-2 rounded-[20px] bg-[#f5f5f3] px-4">
            <Image
              src="/images/owner/icon-search.svg"
              alt=""
              width={14}
              height={14}
              aria-hidden="true"
              className="size-3.5 shrink-0"
            />
            <label className="sr-only" htmlFor="owner-booking-requests-search">
              Search listings, tenants, messages
            </label>
            <input
              id="owner-booking-requests-search"
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

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div
            role="tablist"
            aria-label="Booking request status filters"
            className="flex gap-8 overflow-x-auto border-b border-[#e5e5e2] pr-36 sm:pr-0"
          >
            {ownerBookingRequestTabs.map((tab) => {
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

          <button
            type="button"
            className="inline-flex h-9 shrink-0 items-center gap-2 self-start rounded-md border border-[#e5e5e2] bg-white px-3 font-inter text-[13px] font-medium text-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 sm:absolute sm:top-0 sm:right-0"
          >
            All Properties
            <Image
              src="/images/home/icon-chevron-down.svg"
              alt=""
              width={12}
              height={12}
              aria-hidden="true"
              className="size-3"
            />
          </button>
        </div>

        {renderTabContent()}
      </div>
    </div>
  );
}
