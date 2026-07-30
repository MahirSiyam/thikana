"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ProfileAvatar } from "@/components/ui/ProfileAvatar";
import { routes } from "@/config/routes";
import { DEFAULT_PROVIDER_SLUG } from "@/features/service-provider-details/data/service-provider-details.mock";
import {
  serviceRequests,
  serviceRequestsPaginationPages,
  serviceRequestsTabs,
} from "@/features/tenant-service-requests/data/tenant-service-requests.mock";
import type {
  ServiceRequest,
  ServiceRequestStatus,
  ServiceRequestsTabId,
} from "@/features/tenant-service-requests/types/tenant-service-requests.types";
import { useAuth } from "@/lib/auth/AuthProvider";

const statusStyles: Record<
  ServiceRequestStatus,
  { badge: string; border?: string }
> = {
  Confirmed: {
    badge: "bg-[#dcfce7] text-[#16a34a]",
    border: "border-l-[#16a34a]",
  },
  Pending: {
    badge: "bg-[#fef3c7] text-[#f59e0b]",
    border: "border-l-[#f59e0b]",
  },
  Completed: {
    badge: "bg-[#f5f5f3] text-[#6b7280]",
  },
  Cancelled: {
    badge: "bg-[#fee2e2] text-[#dc2626]",
    border: "border-l-[#dc2626]",
  },
};

function matchesTab(request: ServiceRequest, tab: ServiceRequestsTabId): boolean {
  if (tab === "all") return true;
  if (tab === "pending") return request.status === "Pending";
  if (tab === "confirmed") return request.status === "Confirmed";
  if (tab === "completed") return request.status === "Completed";
  return request.status === "Cancelled";
}

function ServiceRequestCard({ request }: { request: ServiceRequest }) {
  const styles = statusStyles[request.status];

  return (
    <article
      className={`relative flex flex-col gap-4 overflow-hidden rounded-xl border border-[#e5e5e2] bg-white p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-5 ${
        styles.border ? `border-l-4 ${styles.border}` : ""
      }`}
    >
      <div className="flex min-w-0 flex-1 items-start gap-4 sm:items-center">
        <div className="relative size-12 shrink-0">
          <div className="relative size-12 overflow-hidden rounded-full">
            <Image
              src={request.providerAvatarSrc}
              alt=""
              fill
              className="object-cover"
              sizes="48px"
            />
          </div>
          {request.verified ? (
            <span
              aria-hidden="true"
              className="absolute bottom-0 right-0 flex size-4 items-center justify-center rounded-lg border-2 border-white bg-[#16a34a] font-inter text-[10px] text-white"
            >
              ✓
            </span>
          ) : null}
        </div>

        <div className="flex min-w-0 flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-inter text-sm font-bold text-brand-dark">
              {request.providerName}
            </h2>
            <span className="rounded bg-[#f5f5f3] px-2 py-0.5 font-inter text-[11px] font-semibold text-[#6b7280]">
              {request.tradeLabel}
            </span>
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-1 font-inter text-xs text-[#6b7280]">
            <span>{request.location}</span>
            <span>{request.schedule}</span>
          </div>
          <p className="truncate font-inter text-xs text-[#6b7280]">
            {request.description}
          </p>
        </div>
      </div>

      <div className="flex w-full flex-col items-end gap-2 sm:w-[180px] sm:shrink-0">
        <span
          className={`inline-flex rounded px-2.5 py-1 font-inter text-[11px] font-semibold ${styles.badge}`}
        >
          {request.status}
        </span>

        {request.statusHint ? (
          <p
            className={`font-inter text-[11px] font-semibold ${
              request.statusHintTone === "warning"
                ? "text-[#f59e0b]"
                : "text-[#16a34a]"
            }`}
          >
            {request.statusHint}
          </p>
        ) : null}

        {request.canRate ? (
          <button
            type="button"
            className="font-inter text-xs font-semibold text-[#f59e0b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f59e0b] focus-visible:ring-offset-2"
          >
            Rate Service ★
          </button>
        ) : null}

        <Link
          href={routes.serviceProviderDetails(DEFAULT_PROVIDER_SLUG)}
          className="inline-flex w-full items-center justify-center rounded-md border border-brand-dark px-4 py-2 font-inter text-xs font-bold text-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
        >
          View Details
        </Link>
      </div>
    </article>
  );
}

function CancelledEmptyState() {
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
      <p className="font-inter text-[15px] text-brand-dark">No cancelled requests</p>
      <Link
        href={routes.services}
        className="inline-flex items-center rounded-md bg-brand-dark px-5 py-2.5 font-inter text-[13px] font-bold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
      >
        Browse Services
      </Link>
    </div>
  );
}

export function TenantServiceRequestsPage() {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState<ServiceRequestsTabId>("all");
  const [currentPage, setCurrentPage] = useState(1);

  const visibleRequests = useMemo(
    () => serviceRequests.filter((request) => matchesTab(request, activeTab)),
    [activeTab],
  );

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-[50px] lg:py-[30px]">
      <div className="flex w-full flex-col gap-6">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h1 className="font-inter text-xl font-bold text-brand-dark">
            Service Requests
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
            <label className="sr-only" htmlFor="tenant-service-requests-search">
              Search houses, services
            </label>
            <input
              id="tenant-service-requests-search"
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

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div
            role="tablist"
            aria-label="Service request status filters"
            className="flex gap-3 overflow-x-auto pb-1"
          >
            {serviceRequestsTabs.map((tab) => {
              const isActive = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setCurrentPage(1);
                  }}
                  className={`inline-flex h-9 shrink-0 items-center rounded-lg px-4 font-inter text-[13px] font-semibold transition-colors ${
                    isActive
                      ? "bg-brand-dark text-white"
                      : "border border-[#e5e5e2] text-[#6b7280]"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <Link
            href={routes.services}
            className="inline-flex shrink-0 items-center justify-center rounded-lg bg-brand-dark px-5 py-2.5 font-inter text-sm font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
          >
            + New Request
          </Link>
        </div>

        {visibleRequests.length > 0 ? (
          <div className="flex flex-col gap-4 pb-10">
            {visibleRequests.map((request) => (
              <ServiceRequestCard key={request.id} request={request} />
            ))}
          </div>
        ) : activeTab === "cancelled" ? (
          <CancelledEmptyState />
        ) : (
          <p className="py-10 text-center font-inter text-sm text-[#6b7280]">
            No service requests in this filter.
          </p>
        )}

        {visibleRequests.length > 0 ? (
          <nav
            aria-label="Service requests pagination"
            className="flex flex-wrap items-center justify-center gap-2"
          >
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              className="font-inter text-[13px] text-[#6b7280] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
            >
              ← Prev
            </button>

            {serviceRequestsPaginationPages.map((page) => {
              if (page === "...") {
                return (
                  <span
                    key="ellipsis"
                    className="font-inter text-[13px] text-[#6b7280]"
                  >
                    ...
                  </span>
                );
              }

              const pageNumber = page;
              const isActive = pageNumber === currentPage;

              return (
                <button
                  key={pageNumber}
                  type="button"
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => setCurrentPage(pageNumber)}
                  className={`inline-flex size-7 items-center justify-center rounded-[14px] font-inter text-[13px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 ${
                    isActive
                      ? "bg-brand-dark font-bold text-white"
                      : "text-brand-dark"
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.min(12, page + 1))}
              className="font-inter text-[13px] text-[#6b7280] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
            >
              Next →
            </button>
          </nav>
        ) : null}
      </div>
    </div>
  );
}
