"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ProviderTopbar } from "@/features/service-provider/components/ProviderTopbar";
import {
  errorMessage,
  formatBdt,
  formatDate,
  formatDateTime,
  formatTimeAgo,
} from "@/features/service-provider/lib/format";
import type { JobRequestTabId } from "@/features/service-provider-job-requests/types/service-provider-job-requests.types";
import {
  acceptProviderJob,
  completeProviderJob,
  declineProviderJob,
  listProviderJobs,
  serviceCategoryLabel,
  type ServiceRequestCounts,
  type ServiceRequestDto,
  type ServiceRequestStatus,
} from "@/lib/api/provider";

const tabs: { id: JobRequestTabId; label: string; status: ServiceRequestStatus }[] =
  [
    { id: "new", label: "New", status: "pending" },
    { id: "accepted", label: "Accepted", status: "accepted" },
    { id: "completed", label: "Completed", status: "completed" },
    { id: "declined", label: "Declined", status: "declined" },
  ];

const emptyCopy: Record<JobRequestTabId, { title: string; subtitle: string }> = {
  new: {
    title: "No new requests",
    subtitle: "You're all caught up. New job requests will appear here.",
  },
  accepted: {
    title: "No accepted jobs",
    subtitle: "Jobs you accept will appear here until they are completed.",
  },
  completed: {
    title: "No completed jobs",
    subtitle: "Finished jobs will be listed here for your records.",
  },
  declined: {
    title: "No declined requests",
    subtitle: "Requests you decline will be listed here for your records.",
  },
};

function TenantAvatar({
  name,
  avatarUrl,
  size = 48,
}: {
  name: string;
  avatarUrl?: string | null;
  size?: number;
}) {
  if (avatarUrl) {
    return (
      <div
        className="relative shrink-0 overflow-hidden rounded-full"
        style={{ width: size, height: size }}
      >
        <Image
          src={avatarUrl}
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
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span
      className="font-inter text-sm text-[#f59e0b]"
      aria-label={`${rating} out of 5 stars`}
    >
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
    <div className="mx-auto flex w-full max-w-[400px] flex-col items-center gap-4 rounded-xl border border-dashed border-[#e5e5e2] bg-white p-8 text-center sm:p-10">
      <div className="flex size-10 items-center justify-center rounded-full bg-[#f5f5f3]">
        <Image
          src="/images/service-provider/icon-inbox.svg"
          alt=""
          width={20}
          height={20}
          aria-hidden="true"
          className="size-5 opacity-40 brightness-0"
        />
      </div>
      <div className="flex flex-col gap-1">
        <p className="font-inter text-[15px] font-bold text-brand-dark">
          {title}
        </p>
        <p className="font-inter text-[13px] text-[#6b7280]">{subtitle}</p>
      </div>
    </div>
  );
}

function JobRequestCard({
  request,
  busy,
  onAccept,
  onDecline,
  onComplete,
}: {
  request: ServiceRequestDto;
  busy: boolean;
  onAccept: () => void;
  onDecline: () => void;
  onComplete: () => void;
}) {
  const isPending = request.status === "pending";
  const isAccepted = request.status === "accepted";
  const tenantName = request.tenantName || "Client";

  return (
    <article
      className={`flex flex-col gap-4 rounded-xl border border-[#e5e5e2] bg-white p-4 sm:gap-5 sm:p-5 md:p-6 ${
        isPending ? "border-l-4 border-l-[#f59e0b]" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <TenantAvatar name={tenantName} avatarUrl={request.tenantAvatarUrl} />
          <div className="flex min-w-0 flex-col gap-0.5">
            <p className="truncate font-inter text-sm font-bold text-brand-dark sm:text-[15px]">
              {tenantName}
            </p>
            {request.tenantVerified ? (
              <p className="font-inter text-[11px] font-semibold text-[#16a34a]">
                Verified Tenant ✓
              </p>
            ) : null}
          </div>
        </div>
        <p className="shrink-0 font-inter text-xs text-[#6b7280]">
          {formatTimeAgo(request.createdAt)}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center rounded-full bg-[#fff7ed] px-2.5 py-1 font-inter text-[11px] font-semibold text-[#f59e0b]">
          {serviceCategoryLabel(request.serviceCategory)}
        </span>
        {request.address ? (
          <span className="inline-flex items-center rounded-full bg-[#f5f5f3] px-2.5 py-1 font-inter text-[11px] font-semibold text-[#6b7280]">
            {request.address}
          </span>
        ) : null}
        {request.amountBdt ? (
          <span className="inline-flex items-center rounded-full bg-[#f0fdf4] px-2.5 py-1 font-inter text-[11px] font-semibold text-[#16a34a]">
            ৳{formatBdt(request.amountBdt)}
          </span>
        ) : null}
      </div>

      <div className="flex flex-col gap-1">
        <p className="font-inter text-[13px] font-semibold text-brand-dark">
          {formatDateTime(request.scheduledAt)}
        </p>
        {request.description ? (
          <p className="font-inter text-[13px] text-[#6b7280]">
            {request.description}
          </p>
        ) : null}
        {request.declineReason ? (
          <p className="font-inter text-[13px] text-[#b91c1c]">
            Reason: {request.declineReason}
          </p>
        ) : null}
      </div>

      {isPending || isAccepted ? (
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {isPending ? (
            <>
              <button
                type="button"
                disabled={busy}
                onClick={onAccept}
                className="inline-flex h-9 items-center justify-center rounded-md bg-brand-dark px-4 font-inter text-[13px] font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 disabled:opacity-60 sm:px-5"
              >
                Accept
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={onDecline}
                className="inline-flex h-9 items-center justify-center rounded-md border border-[#e5e5e2] px-4 font-inter text-[13px] font-semibold text-brand-dark transition-colors hover:bg-[#f5f5f3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 disabled:opacity-60 sm:px-5"
              >
                Decline
              </button>
            </>
          ) : (
            <button
              type="button"
              disabled={busy}
              onClick={onComplete}
              className="inline-flex h-9 items-center justify-center rounded-md bg-[#16a34a] px-4 font-inter text-[13px] font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16a34a] focus-visible:ring-offset-2 disabled:opacity-60 sm:px-5"
            >
              Mark Completed
            </button>
          )}
        </div>
      ) : null}
    </article>
  );
}

export function ServiceProviderJobRequestsPage() {
  const [activeTab, setActiveTab] = useState<JobRequestTabId>("new");
  const [items, setItems] = useState<ServiceRequestDto[]>([]);
  const [counts, setCounts] = useState<ServiceRequestCounts>({
    pending: 0,
    accepted: 0,
    declined: 0,
    completed: 0,
    cancelled: 0,
  });
  const [recentCompleted, setRecentCompleted] = useState<ServiceRequestDto[]>(
    []
  );
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const activeStatus =
    tabs.find((tab) => tab.id === activeTab)?.status || "pending";

  const load = useCallback(async () => {
    try {
      const [current, completed] = await Promise.all([
        listProviderJobs({ status: activeStatus, limit: 50 }),
        listProviderJobs({ status: "completed", limit: 5 }),
      ]);
      setItems(current.items);
      setCounts(current.counts);
      setRecentCompleted(completed.items);
      setError(null);
    } catch (caught) {
      setError(errorMessage(caught, "Could not load job requests"));
    }
  }, [activeStatus]);

  useEffect(() => {
    let active = true;
    void load().finally(() => {
      if (active) setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [load]);

  const visibleItems = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return items;
    return items.filter((item) =>
      [item.tenantName, item.address, item.description, item.serviceCategory]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(term))
    );
  }, [items, search]);

  const act = async (
    requestId: string,
    action: "accept" | "decline" | "complete"
  ) => {
    setBusyId(requestId);
    setError(null);
    try {
      if (action === "accept") await acceptProviderJob(requestId);
      else if (action === "decline") await declineProviderJob(requestId);
      else await completeProviderJob(requestId);
      await load();
    } catch (caught) {
      setError(errorMessage(caught, "Could not update this job"));
    } finally {
      setBusyId(null);
    }
  };

  const countFor = (tabId: JobRequestTabId) => {
    const status = tabs.find((tab) => tab.id === tabId)?.status;
    return status ? counts[status] : 0;
  };

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-[50px] lg:py-[30px]">
      <div className="flex w-full flex-col gap-6">
        <ProviderTopbar
          title="Job Requests"
          searchId="service-provider-job-requests-search"
          searchLabel="Search jobs, clients, messages"
          searchValue={search}
          onSearchChange={setSearch}
        />

        <div
          role="tablist"
          aria-label="Job request status filters"
          className="flex gap-4 overflow-x-auto border-b border-[#e5e5e2] sm:gap-6 md:gap-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => {
                  if (tab.id === activeTab) return;
                  setLoading(true);
                  setActiveTab(tab.id);
                }}
                className={`shrink-0 border-b-2 pb-3 font-inter text-[13px] whitespace-nowrap transition-colors sm:text-sm ${
                  isActive
                    ? "border-brand-dark font-bold text-brand-dark"
                    : "border-transparent font-medium text-[#6b7280]"
                }`}
              >
                {tab.label} ({countFor(tab.id)})
              </button>
            );
          })}
        </div>

        {error ? (
          <p className="rounded-xl border border-[#fecaca] bg-[#fef2f2] p-4 font-inter text-sm text-[#b91c1c]">
            {error}
          </p>
        ) : null}

        {loading ? (
          <p className="rounded-xl border border-[#e5e5e2] bg-white p-6 font-inter text-sm text-[#6b7280]">
            Loading job requests…
          </p>
        ) : visibleItems.length === 0 ? (
          <TabEmptyState
            title={emptyCopy[activeTab].title}
            subtitle={
              search.trim()
                ? "No jobs match your search."
                : emptyCopy[activeTab].subtitle
            }
          />
        ) : (
          <div className="flex flex-col gap-4">
            {visibleItems.map((request) => (
              <JobRequestCard
                key={request.id}
                request={request}
                busy={busyId === request.id}
                onAccept={() => void act(request.id, "accept")}
                onDecline={() => void act(request.id, "decline")}
                onComplete={() => void act(request.id, "complete")}
              />
            ))}
          </div>
        )}

        <section className="mt-4 rounded-2xl bg-[#f4f4f5] p-4 sm:p-5 md:p-6">
          <h2 className="mb-2 font-inter text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">
            Recently Completed
          </h2>
          {recentCompleted.length === 0 ? (
            <p className="py-3 font-inter text-[13px] text-[#6b7280]">
              No completed jobs yet.
            </p>
          ) : (
            <div className="flex flex-col">
              {recentCompleted.map((job) => (
                <div
                  key={job.id}
                  className="flex flex-col gap-3 border-b border-[#e5e5e2] py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <TenantAvatar
                      name={job.tenantName || "Client"}
                      avatarUrl={job.tenantAvatarUrl}
                      size={40}
                    />
                    <div className="flex min-w-0 flex-col gap-0.5">
                      <p className="truncate font-inter text-sm font-bold text-brand-dark">
                        {job.tenantName || "Client"}
                      </p>
                      <p className="font-inter text-xs text-[#6b7280]">
                        {serviceCategoryLabel(job.serviceCategory)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                    <p className="font-inter text-xs text-[#6b7280]">
                      {job.completedAt ? formatDate(job.completedAt) : "—"}
                    </p>
                    {job.rating ? (
                      <StarRating rating={job.rating} />
                    ) : (
                      <span className="font-inter text-xs text-[#6b7280]">
                        Not rated
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
