"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ProfileAvatar } from "@/components/ui/ProfileAvatar";
import type { ServiceRequestsTabId } from "@/features/tenant-service-requests/types/tenant-service-requests.types";
import {
  listPublicProviders,
  serviceCategoryLabel,
  type PublicProvider,
  type ServiceRequestDto,
  type ServiceRequestStatus,
} from "@/lib/api/provider";
import {
  cancelServiceRequest,
  createServiceRequest,
  listMyServiceRequests,
  reviewServiceRequest,
} from "@/lib/api/tenant";
import { useAuth } from "@/lib/auth/AuthProvider";

const tabs: {
  id: ServiceRequestsTabId;
  label: string;
  status: ServiceRequestStatus | "all";
}[] = [
  { id: "all", label: "All", status: "all" },
  { id: "pending", label: "Pending", status: "pending" },
  { id: "confirmed", label: "Confirmed", status: "accepted" },
  { id: "completed", label: "Completed", status: "completed" },
  { id: "cancelled", label: "Cancelled", status: "cancelled" },
];

const statusStyles: Record<
  ServiceRequestStatus,
  { label: string; badge: string; border?: string }
> = {
  accepted: {
    label: "Confirmed",
    badge: "bg-[#dcfce7] text-[#16a34a]",
    border: "border-l-[#16a34a]",
  },
  pending: {
    label: "Pending",
    badge: "bg-[#fef3c7] text-[#f59e0b]",
    border: "border-l-[#f59e0b]",
  },
  completed: { label: "Completed", badge: "bg-[#f5f5f3] text-[#6b7280]" },
  cancelled: {
    label: "Cancelled",
    badge: "bg-[#fee2e2] text-[#dc2626]",
    border: "border-l-[#dc2626]",
  },
  declined: {
    label: "Declined",
    badge: "bg-[#fee2e2] text-[#dc2626]",
    border: "border-l-[#dc2626]",
  },
};

const formatSchedule = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(iso));

const messageOf = (error: unknown, fallback: string) =>
  error instanceof Error && error.message ? error.message : fallback;

function NewRequestDialog({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [providers, setProviders] = useState<PublicProvider[]>([]);
  const [loadingProviders, setLoadingProviders] = useState(true);
  const [providerId, setProviderId] = useState("");
  const [address, setAddress] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [description, setDescription] = useState("");
  const [amountBdt, setAmountBdt] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        const result = await listPublicProviders({ limit: 50 });
        if (!active) return;
        setProviders(result.items);
        setProviderId(result.items[0]?.id || "");
      } catch (caught) {
        if (active) setError(messageOf(caught, "Could not load providers"));
      } finally {
        if (active) setLoadingProviders(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const submit = async () => {
    if (!providerId) {
      setError("Choose a provider.");
      return;
    }
    if (!address.trim()) {
      setError("Service address is required.");
      return;
    }
    if (!scheduledAt) {
      setError("Choose a preferred date and time.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await createServiceRequest({
        providerId,
        address: address.trim(),
        scheduledAt: new Date(scheduledAt).toISOString(),
        description: description.trim() || undefined,
        amountBdt: Number(amountBdt) || 0,
      });
      onCreated();
      onClose();
    } catch (caught) {
      setError(messageOf(caught, "Could not send your request"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="New service request"
        className="flex max-h-[90dvh] w-full max-w-lg flex-col gap-4 overflow-y-auto rounded-2xl bg-white p-5 sm:p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 className="font-inter text-lg font-bold text-brand-dark">
            New Service Request
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="font-inter text-xl leading-none text-[#6b7280]"
          >
            ×
          </button>
        </div>

        {error ? (
          <p className="rounded-lg border border-[#fecaca] bg-[#fef2f2] px-3 py-2 font-inter text-[13px] text-[#b91c1c]">
            {error}
          </p>
        ) : null}

        {loadingProviders ? (
          <p className="font-inter text-sm text-[#6b7280]">
            Loading providers…
          </p>
        ) : providers.length === 0 ? (
          <p className="font-inter text-sm text-[#6b7280]">
            No verified providers are available yet.
          </p>
        ) : (
          <>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="new-request-provider"
                className="font-inter text-[13px] font-semibold text-brand-dark"
              >
                Provider
              </label>
              <select
                id="new-request-provider"
                value={providerId}
                onChange={(event) => setProviderId(event.target.value)}
                className="h-11 w-full rounded-lg border border-[#e5e5e2] bg-white px-3 font-inter text-sm text-brand-dark outline-none focus-visible:ring-2 focus-visible:ring-brand-dark"
              >
                {providers.map((provider) => (
                  <option key={provider.id} value={provider.id}>
                    {provider.name} —{" "}
                    {serviceCategoryLabel(provider.serviceCategory)}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="new-request-datetime"
                className="font-inter text-[13px] font-semibold text-brand-dark"
              >
                Preferred Date &amp; Time
              </label>
              <input
                id="new-request-datetime"
                type="datetime-local"
                value={scheduledAt}
                onChange={(event) => setScheduledAt(event.target.value)}
                className="h-11 w-full rounded-lg border border-[#e5e5e2] bg-white px-3 font-inter text-sm text-brand-dark outline-none focus-visible:ring-2 focus-visible:ring-brand-dark"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="new-request-address"
                className="font-inter text-[13px] font-semibold text-brand-dark"
              >
                Service Address
              </label>
              <input
                id="new-request-address"
                type="text"
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                placeholder="House, road, area"
                className="h-11 w-full rounded-lg border border-[#e5e5e2] bg-white px-3 font-inter text-sm text-brand-dark outline-none placeholder:text-[#9b9b98] focus-visible:ring-2 focus-visible:ring-brand-dark"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="new-request-budget"
                className="font-inter text-[13px] font-semibold text-brand-dark"
              >
                Budget (BDT, optional)
              </label>
              <input
                id="new-request-budget"
                type="number"
                min={0}
                value={amountBdt}
                onChange={(event) => setAmountBdt(event.target.value)}
                className="h-11 w-full rounded-lg border border-[#e5e5e2] bg-white px-3 font-inter text-sm text-brand-dark outline-none focus-visible:ring-2 focus-visible:ring-brand-dark"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="new-request-description"
                className="font-inter text-[13px] font-semibold text-brand-dark"
              >
                Describe the issue
              </label>
              <textarea
                id="new-request-description"
                rows={3}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="What needs fixing?"
                className="w-full resize-y rounded-lg border border-[#e5e5e2] bg-white p-3 font-inter text-sm text-brand-dark outline-none placeholder:text-[#9b9b98] focus-visible:ring-2 focus-visible:ring-brand-dark"
              />
            </div>

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-11 items-center justify-center rounded-lg border border-[#e5e5e2] px-5 font-inter text-sm font-semibold text-brand-dark"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void submit()}
                disabled={submitting}
                className="inline-flex h-11 items-center justify-center rounded-lg bg-brand-dark px-5 font-inter text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {submitting ? "Sending…" : "Send Request"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function ServiceRequestCard({
  request,
  busy,
  onCancel,
  onRate,
}: {
  request: ServiceRequestDto;
  busy: boolean;
  onCancel: () => void;
  onRate: () => void;
}) {
  const styles = statusStyles[request.status];
  const providerName = request.providerName || "Provider";

  return (
    <article
      className={`relative flex flex-col gap-4 overflow-hidden rounded-xl border border-[#e5e5e2] bg-white p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-5 sm:p-5 ${
        styles.border ? `border-l-4 ${styles.border}` : ""
      }`}
    >
      <div className="flex min-w-0 flex-1 items-start gap-4 sm:items-center">
        <div className="relative size-12 shrink-0">
          {request.providerAvatarUrl ? (
            <div className="relative size-12 overflow-hidden rounded-full">
              <Image
                src={request.providerAvatarUrl}
                alt=""
                fill
                className="object-cover"
                sizes="48px"
              />
            </div>
          ) : (
            <div className="flex size-12 items-center justify-center rounded-full bg-[#f0f0ed] font-inter text-sm font-bold text-[#6b7280]">
              {providerName.slice(0, 1).toUpperCase()}
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-inter text-sm font-bold text-brand-dark">
              {providerName}
            </h2>
            <span className="rounded bg-[#f5f5f3] px-2 py-0.5 font-inter text-[11px] font-semibold text-[#6b7280]">
              {serviceCategoryLabel(request.serviceCategory)}
            </span>
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-1 font-inter text-xs text-[#6b7280]">
            {request.address ? <span>{request.address}</span> : null}
            <span>{formatSchedule(request.scheduledAt)}</span>
          </div>
          {request.description ? (
            <p className="truncate font-inter text-xs text-[#6b7280]">
              {request.description}
            </p>
          ) : null}
          {request.declineReason ? (
            <p className="font-inter text-xs text-[#dc2626]">
              Reason: {request.declineReason}
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex w-full flex-col items-start gap-2 sm:w-[180px] sm:shrink-0 sm:items-end">
        <span
          className={`inline-flex rounded px-2.5 py-1 font-inter text-[11px] font-semibold ${styles.badge}`}
        >
          {styles.label}
        </span>

        {request.status === "completed" ? (
          request.rating ? (
            <p className="font-inter text-xs font-semibold text-[#f59e0b]">
              You rated {request.rating} ★
            </p>
          ) : (
            <button
              type="button"
              disabled={busy}
              onClick={onRate}
              className="font-inter text-xs font-semibold text-[#f59e0b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f59e0b] focus-visible:ring-offset-2 disabled:opacity-60"
            >
              Rate Service ★
            </button>
          )
        ) : null}

        {request.status === "pending" || request.status === "accepted" ? (
          <button
            type="button"
            disabled={busy}
            onClick={onCancel}
            className="inline-flex w-full items-center justify-center rounded-md border border-[#dc2626] px-4 py-2 font-inter text-xs font-bold text-[#dc2626] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dc2626] focus-visible:ring-offset-2 disabled:opacity-60 sm:w-auto"
          >
            Cancel
          </button>
        ) : null}
      </div>
    </article>
  );
}

export function TenantServiceRequestsPage() {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState<ServiceRequestsTabId>("all");
  const [items, setItems] = useState<ServiceRequestDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const activeStatus =
    tabs.find((tab) => tab.id === activeTab)?.status || "all";

  const load = useCallback(async () => {
    try {
      const result = await listMyServiceRequests({
        status: activeStatus,
        limit: 50,
      });
      setItems(result.items);
      setError(null);
    } catch (caught) {
      setError(messageOf(caught, "Could not load your service requests"));
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

  const cancel = async (requestId: string) => {
    setBusyId(requestId);
    setError(null);
    try {
      await cancelServiceRequest(requestId);
      await load();
    } catch (caught) {
      setError(messageOf(caught, "Could not cancel this request"));
    } finally {
      setBusyId(null);
    }
  };

  const rate = async (requestId: string) => {
    const input = window.prompt("Rate this service from 1 to 5:");
    if (!input) return;
    const rating = Number(input);
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      setError("Rating must be a whole number between 1 and 5.");
      return;
    }
    const comment = window.prompt("Add a comment (optional):") || undefined;

    setBusyId(requestId);
    setError(null);
    try {
      await reviewServiceRequest(requestId, { rating, comment });
      await load();
    } catch (caught) {
      setError(messageOf(caught, "Could not submit your review"));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-[50px] lg:py-[30px]">
      <div className="flex w-full flex-col gap-6">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h1 className="font-inter text-lg font-bold text-brand-dark sm:text-xl">
            Service Requests
          </h1>

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
            className="flex gap-2 overflow-x-auto pb-1 sm:gap-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
                  className={`inline-flex h-9 shrink-0 items-center rounded-lg px-3 font-inter text-xs font-semibold whitespace-nowrap transition-colors sm:px-4 sm:text-[13px] ${
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

          <button
            type="button"
            onClick={() => setDialogOpen(true)}
            className="inline-flex shrink-0 items-center justify-center rounded-lg bg-brand-dark px-5 py-2.5 font-inter text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
          >
            + New Request
          </button>
        </div>

        {error ? (
          <p className="rounded-xl border border-[#fecaca] bg-[#fef2f2] p-4 font-inter text-sm text-[#b91c1c]">
            {error}
          </p>
        ) : null}

        {loading ? (
          <p className="rounded-xl border border-[#e5e5e2] bg-white p-6 font-inter text-sm text-[#6b7280]">
            Loading your service requests…
          </p>
        ) : items.length === 0 ? (
          <div className="mx-auto flex w-full max-w-[400px] flex-col items-center gap-5 rounded-2xl border border-dashed border-brand-dark/50 p-8 sm:p-10">
            <p className="text-center font-inter text-[15px] text-brand-dark">
              No service requests in this filter.
            </p>
            <button
              type="button"
              onClick={() => setDialogOpen(true)}
              className="inline-flex items-center rounded-md bg-brand-dark px-5 py-2.5 font-inter text-[13px] font-bold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
            >
              Request a Service
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4 pb-10">
            {items.map((request) => (
              <ServiceRequestCard
                key={request.id}
                request={request}
                busy={busyId === request.id}
                onCancel={() => void cancel(request.id)}
                onRate={() => void rate(request.id)}
              />
            ))}
          </div>
        )}
      </div>

      {dialogOpen ? (
        <NewRequestDialog
          onClose={() => setDialogOpen(false)}
          onCreated={() => void load()}
        />
      ) : null}
    </div>
  );
}
