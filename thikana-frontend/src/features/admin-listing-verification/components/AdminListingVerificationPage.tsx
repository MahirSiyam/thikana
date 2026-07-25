"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  listingVerificationSteps,
  listingVerificationTabs,
} from "@/features/admin-listing-verification/data/admin-listing-verification.mock";
import type { ListingVerificationTabId } from "@/features/admin-listing-verification/types/admin-listing-verification.types";
import { ApiError } from "@/lib/api/client";
import {
  approveAdminListing,
  listAdminListings,
  rejectAdminListing,
  setAdminListingReviewStep,
  type ListingDto,
} from "@/lib/api/listings";

const FALLBACK_IMAGE = "/images/admin/listing-banani-studio.png";

function formatRelative(date?: string | null) {
  if (!date) return "Recently";
  const ms = Date.now() - new Date(date).getTime();
  const hours = Math.floor(ms / (1000 * 60 * 60));
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return days === 1 ? "Yesterday" : `${days}d ago`;
}

function normalizeStep(step?: number | null) {
  if (typeof step !== "number" || Number.isNaN(step)) return 0;
  return Math.min(4, Math.max(0, step));
}

function tabForStep(step?: number | null): Exclude<ListingVerificationTabId, "all"> {
  const value = normalizeStep(step);
  if (value <= 1) return "newly-submitted";
  if (value === 2) return "documents-uploaded";
  if (value === 3) return "awaiting-photo-review";
  return "ready-to-approve";
}

function matchesTab(listing: ListingDto, tab: ListingVerificationTabId) {
  if (tab === "all") return listing.status === "under_review";
  return (
    listing.status === "under_review" &&
    tabForStep(listing.reviewStepIndex) === tab
  );
}

function imageUrl(listing: ListingDto, index = 0) {
  return (
    listing.images[index]?.secureUrl ||
    listing.coverImageUrl ||
    FALLBACK_IMAGE
  );
}

function VerificationStepper({
  currentStepIndex,
  busy,
  onSelectStep,
}: {
  currentStepIndex: number;
  busy: boolean;
  onSelectStep: (stepIndex: number) => void;
}) {
  const current =
    listingVerificationSteps[
      Math.min(currentStepIndex, listingVerificationSteps.length - 1)
    ];
  const progressPct =
    (Math.min(currentStepIndex, listingVerificationSteps.length - 1) /
      (listingVerificationSteps.length - 1)) *
    100;

  return (
    <div className="w-full min-w-0 max-w-md rounded-lg border border-[#e8e8e4] bg-[#fafaf8] p-3">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-inter text-[10px] font-semibold tracking-wide text-brand-dark/40 uppercase">
            Review progress
          </p>
          <p className="mt-0.5 truncate font-inter text-xs font-semibold text-brand-dark">
            {current.label}
            <span className="font-normal text-brand-dark/45">
              {" "}
              · Step {Math.min(currentStepIndex + 1, 5)} of 5
            </span>
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 font-inter text-[10px] font-semibold ${
            currentStepIndex >= 4
              ? "bg-emerald-100 text-emerald-800"
              : "bg-amber-100 text-amber-900"
          }`}
        >
          {currentStepIndex >= 4 ? "Ready to approve" : "In review"}
        </span>
      </div>

      <div className="relative px-1 pt-1 pb-0.5">
        <div
          className="absolute top-[15px] right-4 left-4 h-0.5 rounded-full bg-[#e5e5e2]"
          aria-hidden="true"
        />
        <div
          className="absolute top-[15px] left-4 h-0.5 rounded-full bg-brand-dark transition-all duration-300"
          style={{ width: `calc(${progressPct}% - 0px)` }}
          aria-hidden="true"
        />

        <ol className="relative z-10 flex items-start justify-between gap-1">
          {listingVerificationSteps.map((step, index) => {
            const isComplete = index < currentStepIndex;
            const isCurrent = index === currentStepIndex;

            return (
              <li key={step.id} className="flex min-w-0 flex-1 flex-col items-center">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => onSelectStep(index)}
                  aria-current={isCurrent ? "step" : undefined}
                  aria-label={`${step.label}. ${step.hint}. Click to mark this step.`}
                  title={`${step.label}: ${step.hint}`}
                  className="group flex w-full flex-col items-center gap-1.5 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span
                    className={`flex size-7 items-center justify-center rounded-full border-2 font-inter text-[11px] font-bold transition-colors ${
                      isComplete
                        ? "border-brand-dark bg-brand-dark text-white"
                        : isCurrent
                          ? "border-brand-dark bg-white text-brand-dark ring-2 ring-brand-dark/15"
                          : "border-[#d4d4d0] bg-white text-brand-dark/35"
                    }`}
                  >
                    {isComplete ? (
                      <Image
                        src="/images/admin/icon-step-check.svg"
                        alt=""
                        width={12}
                        height={12}
                        aria-hidden="true"
                        className="size-3 brightness-0 invert"
                      />
                    ) : (
                      index + 1
                    )}
                  </span>
                  <span
                    className={`w-full text-center font-inter text-[10px] leading-tight ${
                      isCurrent
                        ? "font-bold text-brand-dark"
                        : isComplete
                          ? "font-medium text-brand-dark/70"
                          : "font-medium text-brand-dark/35"
                    }`}
                  >
                    <span className="hidden sm:inline">{step.label}</span>
                    <span className="sm:hidden">{step.shortLabel}</span>
                  </span>
                  <span
                    className={`font-inter text-[9px] leading-none ${
                      isComplete
                        ? "text-emerald-700"
                        : isCurrent
                          ? "text-amber-700"
                          : "text-transparent"
                    }`}
                  >
                    {isComplete ? "Done" : isCurrent ? "Now" : "·"}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      <p className="mt-2.5 border-t border-[#ecece8] pt-2 font-inter text-[11px] leading-snug text-brand-dark/55">
        {current.hint}. Click a step to mark progress.
      </p>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-0.5">
      <p className="font-inter text-[11px] font-semibold uppercase tracking-wide text-brand-dark/40">
        {label}
      </p>
      <p className="font-inter text-sm text-brand-dark">{value}</p>
    </div>
  );
}

function ListingReviewPanel({ listing }: { listing: ListingDto }) {
  const photos = listing.images.length
    ? listing.images
    : [{ secureUrl: listing.coverImageUrl || FALLBACK_IMAGE, publicId: "fallback" }];

  return (
    <div className="flex flex-col gap-5 border-t border-[#e5e5e2] bg-[#fafaf9] p-5">
      <div>
        <h3 className="font-inter text-sm font-bold text-brand-dark">
          Full listing review
        </h3>
        <p className="mt-1 font-inter text-xs text-brand-dark/50">
          Check photos, property info, owner details, then advance the checklist and
          approve.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
        {photos.map((photo, index) => (
          <div
            key={`${photo.publicId}-${index}`}
            className="relative aspect-square overflow-hidden rounded-md border border-[#e5e5e2] bg-white"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.secureUrl || FALLBACK_IMAGE}
              alt=""
              className="size-full object-cover"
            />
            {index === 0 ? (
              <span className="absolute top-1.5 left-1.5 rounded bg-brand-dark px-1.5 py-0.5 font-inter text-[10px] font-semibold text-white">
                Cover
              </span>
            ) : null}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <DetailRow label="Title" value={listing.title} />
        <DetailRow label="Property type" value={listing.propertyType} />
        <DetailRow
          label="Monthly rent"
          value={`BDT ${listing.monthlyRent.toLocaleString("en-US")}/mo`}
        />
        <DetailRow
          label="Location"
          value={`${listing.address.area}, ${listing.address.district}, ${listing.address.division}`}
        />
        <DetailRow label="Street" value={listing.address.street} />
        <DetailRow label="Floor" value={listing.floorLevel || undefined} />
        <DetailRow label="Size" value={`${listing.sizeSqft || 0} sqft`} />
        <DetailRow label="Beds / Baths" value={`${listing.beds} / ${listing.baths}`} />
        <DetailRow
          label="Who can rent"
          value={listing.whoCanRent?.join(", ") || undefined}
        />
        <DetailRow
          label="Available from"
          value={
            listing.availableFrom
              ? new Date(listing.availableFrom).toLocaleDateString()
              : undefined
          }
        />
        <DetailRow label="Owner name" value={listing.ownerName} />
        <DetailRow label="Owner email" value={listing.ownerEmail} />
        <DetailRow label="Owner phone" value={listing.ownerPhone} />
      </div>

      {listing.amenities?.length ? (
        <div className="flex flex-col gap-2">
          <p className="font-inter text-[11px] font-semibold uppercase tracking-wide text-brand-dark/40">
            Amenities
          </p>
          <div className="flex flex-wrap gap-2">
            {listing.amenities.map((amenity) => (
              <span
                key={amenity}
                className="rounded-full bg-white px-3 py-1 font-inter text-xs font-medium text-brand-dark"
              >
                {amenity}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {listing.description ? (
        <div className="flex flex-col gap-1">
          <p className="font-inter text-[11px] font-semibold uppercase tracking-wide text-brand-dark/40">
            Description
          </p>
          <p className="whitespace-pre-wrap font-inter text-sm text-brand-dark">
            {listing.description}
          </p>
        </div>
      ) : null}

      {listing.houseRules ? (
        <div className="flex flex-col gap-1">
          <p className="font-inter text-[11px] font-semibold uppercase tracking-wide text-brand-dark/40">
            House rules
          </p>
          <p className="whitespace-pre-wrap font-inter text-sm text-brand-dark">
            {listing.houseRules}
          </p>
        </div>
      ) : null}
    </div>
  );
}

function ListingVerificationCard({
  listing,
  detailsOpen,
  rejectOpen,
  rejectReason,
  busy,
  onToggleDetails,
  onApprove,
  onToggleReject,
  onRejectReasonChange,
  onCancelReject,
  onSendReject,
  onSetStep,
}: {
  listing: ListingDto;
  detailsOpen: boolean;
  rejectOpen: boolean;
  rejectReason: string;
  busy: boolean;
  onToggleDetails: () => void;
  onApprove: () => void;
  onToggleReject: () => void;
  onRejectReasonChange: (value: string) => void;
  onCancelReject: () => void;
  onSendReject: () => void;
  onSetStep: (stepIndex: number) => void;
}) {
  const step = listing.reviewStepIndex ?? 0;
  const canApprove = step >= 4;

  return (
    <article className="overflow-hidden rounded-lg bg-white shadow-[0px_4px_6px_rgba(0,0,0,0.04)]">
      <div
        className={`flex flex-col gap-5 p-5 lg:flex-row lg:items-center lg:gap-6 ${
          detailsOpen || rejectOpen ? "rounded-t-lg" : "rounded-lg"
        }`}
      >
        <div className="relative size-20 shrink-0 overflow-hidden rounded-md">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl(listing)}
            alt={listing.title}
            className="size-full object-cover"
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <h2 className="font-inter text-base font-bold text-brand-dark">
            {listing.title}
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-inter text-[13px] text-brand-dark/50">
              {listing.ownerName || "Owner"}
            </p>
            <span className="rounded bg-brand-dark px-1.5 py-0.5 font-inter text-[10px] font-semibold text-white">
              ✓ Owner
            </span>
          </div>
          <p className="font-inter text-xs text-brand-dark">
            {formatRelative(listing.submittedAt || listing.createdAt)}
            <span className="mx-3">•</span>
            {listing.address.area}, {listing.address.district}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-inter text-sm font-semibold text-brand-dark">
              BDT {listing.monthlyRent.toLocaleString("en-US")}/mo
            </p>
            <span className="rounded bg-[#f5f5f3] px-2 py-0.5 font-inter text-[11px] text-brand-dark/50">
              {listing.propertyType}
            </span>
            <span className="rounded bg-[#f5f5f3] px-2 py-0.5 font-inter text-[11px] text-brand-dark/50">
              {listing.images.length} photo{listing.images.length === 1 ? "" : "s"}
            </span>
          </div>

          <div className="mt-3 w-full xl:hidden">
            <VerificationStepper
              currentStepIndex={step}
              busy={busy}
              onSelectStep={onSetStep}
            />
          </div>
        </div>

        <div className="hidden w-full max-w-md shrink-0 xl:block">
          <VerificationStepper
            currentStepIndex={step}
            busy={busy}
            onSelectStep={onSetStep}
          />
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-[170px] sm:shrink-0">
          <button
            type="button"
            disabled={busy}
            onClick={onToggleDetails}
            className="inline-flex w-full items-center justify-center rounded-md border border-brand-dark p-2 font-inter text-xs font-semibold text-brand-dark transition-colors hover:bg-brand-dark/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 disabled:opacity-60"
          >
            {detailsOpen ? "Hide details" : "Review details"}
          </button>
          <button
            type="button"
            disabled={busy || !canApprove}
            onClick={onApprove}
            title={
              canApprove
                ? "Approve and publish listing"
                : "Mark Verified on the checklist first"
            }
            className="inline-flex w-full items-center justify-center rounded-md bg-brand-dark p-2 font-inter text-xs font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy ? "Working…" : "Approve ✓"}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={onToggleReject}
            className="inline-flex w-full items-center justify-center rounded-md border border-[#ef4444] p-2 font-inter text-xs font-semibold text-[#ef4444] transition-colors hover:bg-[#ef4444]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ef4444] focus-visible:ring-offset-2 disabled:opacity-60"
          >
            Reject ✗
          </button>
        </div>
      </div>

      {detailsOpen ? <ListingReviewPanel listing={listing} /> : null}

      {rejectOpen ? (
        <div className="flex flex-col gap-4 border-t border-[#e5e5e2] p-5">
          <p className="font-inter text-sm font-semibold text-brand-dark">
            Rejection Reason
          </p>
          <label className="sr-only" htmlFor={`reject-reason-${listing.id}`}>
            Rejection reason
          </label>
          <textarea
            id={`reject-reason-${listing.id}`}
            value={rejectReason}
            onChange={(event) => onRejectReasonChange(event.target.value)}
            placeholder="Enter reason for rejection..."
            className="min-h-[100px] w-full resize-y rounded-md border border-[#e2e8f0] bg-white p-3 font-inter text-[13px] text-brand-dark outline-none placeholder:text-brand-dark/50 focus-visible:ring-2 focus-visible:ring-brand-dark"
          />
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              disabled={busy}
              onClick={onSendReject}
              className="inline-flex items-center rounded-md bg-[#ef4444] px-4 py-2.5 font-inter text-[13px] font-bold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ef4444] focus-visible:ring-offset-2 disabled:opacity-60"
            >
              Send Rejection
            </button>
            <button
              type="button"
              onClick={onCancelReject}
              className="font-inter text-[13px] font-semibold text-brand-dark underline underline-offset-2"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}
    </article>
  );
}

export function AdminListingVerificationPage() {
  const [activeTab, setActiveTab] = useState<ListingVerificationTabId>("all");
  const [items, setItems] = useState<ListingDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [detailsOpenIds, setDetailsOpenIds] = useState<string[]>([]);
  const [rejectOpenIds, setRejectOpenIds] = useState<string[]>([]);
  const [rejectReasons, setRejectReasons] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await listAdminListings({
        reviewTab: "all",
        limit: 50,
        sortBy: "createdAt",
        sortOrder: "desc",
      });
      setItems(response.data || []);
    } catch (err) {
      setError(
        err instanceof ApiError || err instanceof Error
          ? err.message
          : "Could not load verification queue"
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

  const tabCounts = useMemo(() => {
    const counts: Record<ListingVerificationTabId, number> = {
      all: 0,
      "newly-submitted": 0,
      "documents-uploaded": 0,
      "awaiting-photo-review": 0,
      "ready-to-approve": 0,
    };
    for (const item of items) {
      if (item.status !== "under_review") continue;
      counts.all += 1;
      counts[tabForStep(item.reviewStepIndex)] += 1;
    }
    return counts;
  }, [items]);

  const visibleItems = useMemo(
    () => items.filter((item) => matchesTab(item, activeTab)),
    [items, activeTab]
  );

  const patchItem = (updated: ListingDto) => {
    setItems((current) =>
      current.map((item) => (item.id === updated.id ? updated : item))
    );
  };

  const removeItem = (listingId: string) => {
    setItems((current) => current.filter((item) => item.id !== listingId));
  };

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-[50px] lg:py-[30px]">
      <div className="flex w-full flex-col gap-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:pb-6">
          <div>
            <h1 className="font-inter text-[clamp(1.5rem,3vw,1.75rem)] font-bold text-black">
              Listing Verification Queue
            </h1>
            <p className="mt-1 font-inter text-sm text-brand-dark/50">
              Open Review details, advance the checklist, then approve or reject.
            </p>
          </div>
          <span className="inline-flex w-fit items-center rounded bg-[#f59e0b] px-3 py-1.5 font-inter text-[13px] font-bold text-white">
            {tabCounts.all} Pending
          </span>
        </header>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <div
              role="tablist"
              aria-label="Listing verification filters"
              className="flex gap-2 overflow-x-auto pb-1"
            >
              {listingVerificationTabs.map((tab) => {
                const isActive = tab.id === activeTab;
                const count = tabCounts[tab.id];
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    title={tab.description}
                    onClick={() => setActiveTab(tab.id)}
                    className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 font-inter text-[13px] whitespace-nowrap transition-colors ${
                      isActive
                        ? "bg-brand-dark font-bold text-white"
                        : "bg-white font-medium text-brand-dark/50"
                    }`}
                  >
                    {tab.label}
                    <span
                      className={`inline-flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-[11px] font-bold ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-brand-dark/8 text-brand-dark/70"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="font-inter text-xs text-brand-dark/50">
              {
                listingVerificationTabs.find((tab) => tab.id === activeTab)
                  ?.description
              }{" "}
              Showing {visibleItems.length} listing
              {visibleItems.length === 1 ? "" : "s"}.
            </p>
          </div>

          {loading ? (
            <p className="font-inter text-sm text-brand-dark/60">Loading queue…</p>
          ) : null}
          {error ? (
            <p role="alert" className="font-inter text-sm font-medium text-red-600">
              {error}
            </p>
          ) : null}
          {!loading && !error && visibleItems.length === 0 ? (
            <p className="font-inter text-sm text-brand-dark/60">
              No listings in this status yet. Advance a listing’s checklist to move
              it here.
            </p>
          ) : null}

          <div className="flex flex-col gap-4">
            {visibleItems.map((listing) => (
              <ListingVerificationCard
                key={listing.id}
                listing={listing}
                busy={busyId === listing.id}
                detailsOpen={detailsOpenIds.includes(listing.id)}
                rejectOpen={rejectOpenIds.includes(listing.id)}
                rejectReason={rejectReasons[listing.id] ?? ""}
                onToggleDetails={() => {
                  setDetailsOpenIds((current) =>
                    current.includes(listing.id)
                      ? current.filter((id) => id !== listing.id)
                      : [...current, listing.id]
                  );
                }}
                onSetStep={async (stepIndex) => {
                  setBusyId(listing.id);
                  setError(null);
                  try {
                    const updated = await setAdminListingReviewStep(
                      listing.id,
                      stepIndex
                    );
                    patchItem(updated);
                  } catch (err) {
                    setError(
                      err instanceof Error
                        ? err.message
                        : "Could not update review step"
                    );
                  } finally {
                    setBusyId(null);
                  }
                }}
                onApprove={async () => {
                  setBusyId(listing.id);
                  setError(null);
                  try {
                    await approveAdminListing(listing.id);
                    removeItem(listing.id);
                  } catch (err) {
                    setError(
                      err instanceof Error ? err.message : "Could not approve listing"
                    );
                  } finally {
                    setBusyId(null);
                  }
                }}
                onToggleReject={() => {
                  setRejectOpenIds((current) =>
                    current.includes(listing.id)
                      ? current.filter((item) => item !== listing.id)
                      : [...current, listing.id]
                  );
                }}
                onRejectReasonChange={(value) =>
                  setRejectReasons((current) => ({
                    ...current,
                    [listing.id]: value,
                  }))
                }
                onCancelReject={() => {
                  setRejectOpenIds((current) =>
                    current.filter((item) => item !== listing.id)
                  );
                }}
                onSendReject={async () => {
                  const reason = (rejectReasons[listing.id] || "").trim();
                  if (reason.length < 3) {
                    setError("Enter a rejection reason (at least 3 characters).");
                    return;
                  }
                  setBusyId(listing.id);
                  setError(null);
                  try {
                    await rejectAdminListing(listing.id, reason);
                    removeItem(listing.id);
                  } catch (err) {
                    setError(
                      err instanceof Error ? err.message : "Could not reject listing"
                    );
                  } finally {
                    setBusyId(null);
                  }
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
