"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { serviceProviderUser } from "@/features/service-provider/data/service-provider.mock";
import {
  initialJobRequests,
  jobRequestTabs,
  recentlyCompletedJobs,
} from "@/features/service-provider-job-requests/data/service-provider-job-requests.mock";
import type {
  JobRequest,
  JobRequestStatus,
  JobRequestTabId,
  RecentlyCompletedJob,
} from "@/features/service-provider-job-requests/types/service-provider-job-requests.types";

function statusForTab(tab: JobRequestTabId): JobRequestStatus {
  if (tab === "new") return "New";
  if (tab === "accepted") return "Accepted";
  if (tab === "completed") return "Completed";
  return "Declined";
}

function matchesTab(request: JobRequest, tab: JobRequestTabId): boolean {
  return request.status === statusForTab(tab);
}

function TenantAvatar({
  name,
  avatarSrc,
  size = 48,
}: {
  name: string;
  avatarSrc?: string;
  size?: number;
}) {
  if (avatarSrc) {
    return (
      <div
        className="relative shrink-0 overflow-hidden rounded-full"
        style={{ width: size, height: size }}
      >
        <Image
          src={avatarSrc}
          alt=""
          fill
          className="object-cover"
          sizes={`${size}px`}
        />
      </div>
    );
  }

  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full bg-[#e5e5e2] font-inter text-sm font-semibold text-[#6b7280]"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {name.charAt(0)}
    </div>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="font-inter text-sm text-[#f59e0b]" aria-label={`${rating} out of 5 stars`}>
      {"★".repeat(rating)}
      <span className="text-[#e5e5e2]">{"★".repeat(5 - rating)}</span>
    </span>
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
          src="/images/service-provider/icon-inbox.svg"
          alt=""
          width={20}
          height={20}
          aria-hidden="true"
          className="size-5 brightness-0 opacity-40"
        />
      </div>
      <div className="flex flex-col gap-1">
        <p className="font-inter text-[15px] font-bold text-brand-dark">{title}</p>
        <p className="font-inter text-[13px] text-[#6b7280]">{subtitle}</p>
      </div>
    </div>
  );
}

function JobRequestCard({
  request,
  showActions = false,
  onAccept,
  onDecline,
}: {
  request: JobRequest;
  showActions?: boolean;
  onAccept?: (id: string) => void;
  onDecline?: (id: string) => void;
}) {
  return (
    <article
      className={`flex flex-col gap-5 rounded-xl border border-[#e5e5e2] bg-white p-5 sm:p-6 ${
        request.highlighted ? "border-l-4 border-l-[#f59e0b]" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <TenantAvatar
            name={request.tenantName}
            avatarSrc={request.tenantAvatarSrc}
          />
          <div className="flex min-w-0 flex-col gap-0.5">
            <p className="font-inter text-[15px] font-bold text-brand-dark">
              {request.tenantName}
            </p>
            {request.verifiedTenant ? (
              <p className="font-inter text-[11px] font-semibold text-[#16a34a]">
                Verified Tenant ✓
              </p>
            ) : null}
          </div>
        </div>
        <p className="shrink-0 font-inter text-xs text-[#6b7280]">{request.timeAgo}</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center rounded-full bg-[#fff7ed] px-2.5 py-1 font-inter text-[11px] font-semibold text-[#f59e0b]">
          {request.tradeLabel}
        </span>
        <span className="inline-flex items-center rounded-full bg-[#f5f5f3] px-2.5 py-1 font-inter text-[11px] font-semibold text-[#6b7280]">
          {request.location}
        </span>
      </div>

      <div className="flex flex-col gap-1">
        <p className="font-inter text-[13px] font-semibold text-brand-dark">
          {request.requestedDateTime}
        </p>
        <p className="font-inter text-[13px] text-[#6b7280]">{request.description}</p>
      </div>

      {showActions ? (
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={() => onAccept?.(request.id)}
            className="inline-flex h-9 items-center justify-center rounded-md bg-brand-dark px-5 font-inter text-[13px] font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
          >
            Accept
          </button>
          <button
            type="button"
            onClick={() => onDecline?.(request.id)}
            className="inline-flex h-9 items-center justify-center rounded-md border border-[#e5e5e2] px-5 font-inter text-[13px] font-semibold text-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
          >
            Decline
          </button>
          <button
            type="button"
            className="font-inter text-[13px] font-semibold text-brand-dark underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
          >
            View Details
          </button>
        </div>
      ) : (
        <div className="flex justify-start">
          <button
            type="button"
            className="font-inter text-[13px] font-semibold text-brand-dark underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
          >
            View Details
          </button>
        </div>
      )}
    </article>
  );
}

function RecentlyCompletedRow({ job }: { job: RecentlyCompletedJob }) {
  return (
    <div className="flex flex-col gap-3 border-b border-[#e5e5e2] py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <TenantAvatar name={job.tenantName} avatarSrc={job.tenantAvatarSrc} size={40} />
        <div className="flex min-w-0 flex-col gap-0.5">
          <p className="font-inter text-sm font-bold text-brand-dark">{job.tenantName}</p>
          <p className="font-inter text-xs text-[#6b7280]">{job.serviceLabel}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 sm:gap-6">
        <p className="font-inter text-xs text-[#6b7280]">{job.completedDate}</p>
        <StarRating rating={job.rating} />
        <button
          type="button"
          className="font-inter text-xs font-semibold text-[#f59e0b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f59e0b] focus-visible:ring-offset-2"
        >
          Leave a note
        </button>
      </div>
    </div>
  );
}

export function ServiceProviderJobRequestsPage() {
  const [requests, setRequests] = useState(initialJobRequests);
  const [activeTab, setActiveTab] = useState<JobRequestTabId>("new");

  const visibleRequests = useMemo(
    () => requests.filter((request) => matchesTab(request, activeTab)),
    [requests, activeTab],
  );

  function getTabCount(tab: JobRequestTabId): number {
    return requests.filter((request) => matchesTab(request, tab)).length;
  }

  function handleAccept(id: string) {
    setRequests((current) =>
      current.map((request) =>
        request.id === id
          ? { ...request, status: "Accepted", highlighted: false }
          : request,
      ),
    );
  }

  function handleDecline(id: string) {
    setRequests((current) =>
      current.map((request) =>
        request.id === id
          ? { ...request, status: "Declined", highlighted: false }
          : request,
      ),
    );
  }

  function renderTabContent() {
    if (visibleRequests.length > 0) {
      return (
        <div className="flex flex-col gap-4">
          {visibleRequests.map((request) => (
            <JobRequestCard
              key={request.id}
              request={request}
              showActions={activeTab === "new"}
              onAccept={handleAccept}
              onDecline={handleDecline}
            />
          ))}
        </div>
      );
    }

    if (activeTab === "new") {
      return (
        <TabEmptyState
          title="No new requests"
          subtitle="You're all caught up. New job requests will appear here."
        />
      );
    }

    if (activeTab === "accepted") {
      return (
        <TabEmptyState
          title="No accepted jobs"
          subtitle="Jobs you accept will appear here until they are completed."
        />
      );
    }

    if (activeTab === "completed") {
      return (
        <TabEmptyState
          title="No completed jobs"
          subtitle="Finished jobs will be listed here for your records."
        />
      );
    }

    return (
      <TabEmptyState
        title="No declined requests"
        subtitle="Requests you decline will be listed here for your records."
      />
    );
  }

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-[50px] lg:py-[30px]">
      <div className="flex w-full flex-col gap-6">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h1 className="font-inter text-xl font-bold text-brand-dark">Job Requests</h1>

          <div className="flex h-10 w-full max-w-[360px] items-center gap-2 rounded-[20px] bg-[#f5f5f3] px-4">
            <Image
              src="/images/service-provider/icon-search.svg"
              alt=""
              width={16}
              height={16}
              aria-hidden="true"
              className="size-4 shrink-0 brightness-0 opacity-40"
            />
            <label className="sr-only" htmlFor="service-provider-job-requests-search">
              Search jobs, clients, messages
            </label>
            <input
              id="service-provider-job-requests-search"
              type="search"
              placeholder="Search jobs, clients, messages..."
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
                src="/images/service-provider/icon-settings.svg"
                alt=""
                width={20}
                height={20}
                aria-hidden="true"
                className="size-5"
              />
            </button>
            <div className="relative size-9 overflow-hidden rounded-full">
              <Image
                src={serviceProviderUser.topbarAvatarSrc}
                alt=""
                fill
                className="object-cover"
                sizes="36px"
              />
            </div>
          </div>
        </header>

        <div
          role="tablist"
          aria-label="Job request status filters"
          className="flex gap-8 overflow-x-auto border-b border-[#e5e5e2]"
        >
          {jobRequestTabs.map((tab) => {
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

        {renderTabContent()}

        <section className="mt-4 rounded-2xl bg-[#f4f4f5] p-5 sm:p-6">
          <h2 className="mb-2 font-inter text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">
            Recently Completed
          </h2>
          <div className="flex flex-col">
            {recentlyCompletedJobs.map((job) => (
              <RecentlyCompletedRow key={job.id} job={job} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
