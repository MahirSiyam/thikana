"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  LISTING_REVIEW_CHECKLIST_ITEMS,
  type ListingReviewChecklistItem,
  type ListingReviewCheckStatus,
} from "@/features/admin-listing-verification/data/listing-review-checklist";
import { ApiError } from "@/lib/api/client";
import {
  approveAdminListing,
  listAdminListings,
  rejectAdminListing,
  type ListingDto,
  type ListingStatus,
} from "@/lib/api/listings";

const FALLBACK_IMAGE = "/images/admin/listing-banani-studio.png";

type StatusFilterId = "all" | "under_review" | "live" | "rejected" | "paused";

const statusFilters: {
  id: StatusFilterId;
  label: string;
}[] = [
  { id: "all", label: "All" },
  { id: "under_review", label: "Pending" },
  { id: "live", label: "Approved" },
  { id: "rejected", label: "Rejected" },
  { id: "paused", label: "Paused" },
];

function statusLabel(status: ListingStatus) {
  switch (status) {
    case "under_review":
      return "Pending review";
    case "live":
      return "Approved / Live";
    case "rejected":
      return "Rejected";
    case "paused":
      return "Paused";
    case "draft":
      return "Draft";
    default:
      return status;
  }
}

function statusBadgeClass(status: ListingStatus) {
  switch (status) {
    case "live":
      return "bg-emerald-100 text-emerald-800";
    case "rejected":
      return "bg-red-100 text-red-700";
    case "paused":
      return "bg-slate-100 text-slate-700";
    case "under_review":
      return "bg-amber-100 text-amber-900";
    default:
      return "bg-[#f5f5f3] text-brand-dark/60";
  }
}

function imageUrl(listing: ListingDto) {
  return (
    listing.images[0]?.secureUrl ||
    listing.coverImageUrl ||
    FALLBACK_IMAGE
  );
}

function createEmptyChecklist(): ListingReviewChecklistItem[] {
  return LISTING_REVIEW_CHECKLIST_ITEMS.map((item) => ({
    id: item.id,
    label: item.label,
    status: "pending",
  }));
}

function hydrateChecklist(
  stored?: ListingDto["reviewChecklist"]
): ListingReviewChecklistItem[] {
  const base = createEmptyChecklist();
  if (!stored?.length) return base;
  return base.map((item) => {
    const match = stored.find((entry) => entry.id === item.id);
    if (!match) return item;
    return {
      ...item,
      status: match.status,
      note: match.note,
    };
  });
}

function ReviewChecklistBook({
  items,
  readOnly,
  busy,
  canApprove,
  onChangeStatus,
  onApprove,
  onToggleReject,
}: {
  items: ListingReviewChecklistItem[];
  readOnly?: boolean;
  busy?: boolean;
  canApprove?: boolean;
  onChangeStatus: (id: string, status: ListingReviewCheckStatus) => void;
  onApprove?: () => void;
  onToggleReject?: () => void;
}) {
  const okCount = items.filter((item) => item.status === "ok").length;
  const issueCount = items.filter((item) => item.status === "issue").length;
  const showActions = Boolean(onApprove && onToggleReject && !readOnly);

  return (
    <div className="w-full min-w-0 rounded-lg border border-[#e8e8e4] bg-[#fafaf8] p-2.5">
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <p className="font-inter text-[11px] font-semibold text-brand-dark">
          Checklist
          <span className="ml-1.5 font-normal text-brand-dark/45">
            ✓ right · ✗ wrong
          </span>
        </p>
        <span className="shrink-0 font-inter text-[10px] font-semibold text-brand-dark/55">
          ✓{okCount} / ✗{issueCount}
        </span>
      </div>

      <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2">
        {items.map((item) => {
          const meta = LISTING_REVIEW_CHECKLIST_ITEMS.find(
            (entry) => entry.id === item.id
          );
          return (
            <li
              key={item.id}
              title={meta?.hint}
              className="flex items-center justify-between gap-2 rounded-md bg-white px-2 py-1"
            >
              <p className="min-w-0 truncate font-inter text-[11px] font-medium text-brand-dark">
                {item.label}
              </p>
              <div className="flex shrink-0 items-center gap-0.5">
                <button
                  type="button"
                  disabled={busy || readOnly}
                  aria-pressed={item.status === "ok"}
                  aria-label={`Mark ${item.label} as OK`}
                  title="Looks good"
                  onClick={() =>
                    onChangeStatus(
                      item.id,
                      item.status === "ok" ? "pending" : "ok"
                    )
                  }
                  className={`inline-flex size-6 items-center justify-center rounded border text-[11px] font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                    item.status === "ok"
                      ? "border-emerald-600 bg-emerald-600 text-white"
                      : "border-[#e5e5e2] bg-[#fafafa] text-brand-dark/35 hover:border-emerald-500 hover:text-emerald-700"
                  }`}
                >
                  ✓
                </button>
                <button
                  type="button"
                  disabled={busy || readOnly}
                  aria-pressed={item.status === "issue"}
                  aria-label={`Mark ${item.label} as issue`}
                  title="Missing / wrong"
                  onClick={() =>
                    onChangeStatus(
                      item.id,
                      item.status === "issue" ? "pending" : "issue"
                    )
                  }
                  className={`inline-flex size-6 items-center justify-center rounded border text-[11px] font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                    item.status === "issue"
                      ? "border-red-600 bg-red-600 text-white"
                      : "border-[#e5e5e2] bg-[#fafafa] text-brand-dark/35 hover:border-red-500 hover:text-red-600"
                  }`}
                >
                  ✗
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      {showActions ? (
        <div className="mt-2 flex flex-wrap items-center gap-1.5 border-t border-[#ecece8] pt-2">
          <button
            type="button"
            disabled={busy || !canApprove}
            onClick={onApprove}
            title={
              canApprove
                ? "Approve and email the owner"
                : "Mark every item ✓ first"
            }
            className="inline-flex h-8 flex-1 items-center justify-center rounded-md bg-brand-dark px-3 font-inter text-[11px] font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
          >
            {busy ? "Working…" : "Approve ✓"}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={onToggleReject}
            className="inline-flex h-8 flex-1 items-center justify-center rounded-md border border-[#ef4444] px-3 font-inter text-[11px] font-semibold text-[#ef4444] transition-colors hover:bg-[#ef4444]/5 disabled:opacity-50 sm:flex-none"
          >
            Reject ✗
          </button>
          {!canApprove ? (
            <p className="w-full font-inter text-[10px] text-brand-dark/45 sm:ml-auto sm:w-auto">
              All ✓ needed to approve
            </p>
          ) : null}
        </div>
      ) : null}
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
          Photos, property info, and owner details for this listing.
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
        <DetailRow label="Owner name" value={listing.ownerName} />
        <DetailRow label="Owner email" value={listing.ownerEmail} />
        <DetailRow label="Owner phone" value={listing.ownerPhone} />
        <DetailRow label="Status" value={statusLabel(listing.status)} />
        <DetailRow label="Rejection reason" value={listing.rejectionReason} />
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
    </div>
  );
}

function ListingVerificationCard({
  listing,
  checklist,
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
  onChecklistStatus,
}: {
  listing: ListingDto;
  checklist: ListingReviewChecklistItem[];
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
  onChecklistStatus: (id: string, status: ListingReviewCheckStatus) => void;
}) {
  const isPending = listing.status === "under_review";
  const allMarked = checklist.every((item) => item.status !== "pending");
  const allOk = checklist.every((item) => item.status === "ok");
  const hasIssue = checklist.some((item) => item.status === "issue");
  const canApprove = isPending && allOk;
  const canReject =
    isPending && allMarked && (hasIssue || rejectReason.trim().length >= 3);

  return (
    <article className="overflow-hidden rounded-lg bg-white shadow-[0px_4px_6px_rgba(0,0,0,0.04)]">
      <div
        className={`flex flex-col gap-3 p-4 ${
          detailsOpen || rejectOpen ? "rounded-t-lg" : "rounded-lg"
        }`}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <div className="relative size-14 shrink-0 overflow-hidden rounded-md sm:size-16">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl(listing)}
              alt={listing.title}
              className="size-full object-cover"
            />
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-inter text-[15px] font-bold text-brand-dark">
                {listing.title}
              </h2>
              <span
                className={`rounded-full px-2 py-0.5 font-inter text-[10px] font-semibold ${statusBadgeClass(
                  listing.status
                )}`}
              >
                {statusLabel(listing.status)}
              </span>
            </div>
            <p className="font-inter text-[12px] text-brand-dark/55">
              {listing.ownerName || "Owner"}
              <span className="mx-1.5 text-brand-dark/25">•</span>
              {listing.address.area}, {listing.address.district}
              <span className="mx-1.5 text-brand-dark/25">•</span>
              BDT {listing.monthlyRent.toLocaleString("en-US")}/mo
              <span className="mx-1.5 text-brand-dark/25">•</span>
              {listing.images.length} photos
            </p>
          </div>

          <button
            type="button"
            disabled={busy}
            onClick={onToggleDetails}
            className="inline-flex h-8 shrink-0 items-center justify-center rounded-md border border-brand-dark/30 px-3 font-inter text-[11px] font-semibold text-brand-dark transition-colors hover:bg-brand-dark/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 disabled:opacity-60"
          >
            {detailsOpen ? "Hide details" : "Details"}
          </button>
        </div>

        <ReviewChecklistBook
          items={checklist}
          readOnly={!isPending}
          busy={busy}
          canApprove={canApprove}
          onChangeStatus={onChecklistStatus}
          onApprove={isPending ? onApprove : undefined}
          onToggleReject={isPending ? onToggleReject : undefined}
        />
      </div>

      {detailsOpen ? <ListingReviewPanel listing={listing} /> : null}

      {rejectOpen && isPending ? (
        <div className="flex flex-col gap-3 border-t border-[#e5e5e2] px-4 py-3">
          <p className="font-inter text-xs font-semibold text-brand-dark">
            Extra note for owner (optional if checklist has ✗)
          </p>
          <textarea
            id={`reject-reason-${listing.id}`}
            value={rejectReason}
            onChange={(event) => onRejectReasonChange(event.target.value)}
            placeholder="Optional note, e.g. please re-upload clearer photos…"
            className="min-h-[72px] w-full resize-y rounded-md border border-[#e2e8f0] bg-white p-2.5 font-inter text-[12px] text-brand-dark outline-none placeholder:text-brand-dark/50 focus-visible:ring-2 focus-visible:ring-brand-dark"
          />
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              disabled={busy || !canReject}
              title={
                canReject
                  ? "Reject and email checklist to owner"
                  : "Mark every item ✓/✗ and include at least one ✗ (or a note)"
              }
              onClick={onSendReject}
              className="inline-flex items-center rounded-md bg-[#ef4444] px-3 py-2 font-inter text-[12px] font-bold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ef4444] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Send Rejection Email
            </button>
            <button
              type="button"
              onClick={onCancelReject}
              className="font-inter text-[12px] font-semibold text-brand-dark underline underline-offset-2"
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
  const [statusFilter, setStatusFilter] = useState<StatusFilterId>("all");
  const [items, setItems] = useState<ListingDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [detailsOpenIds, setDetailsOpenIds] = useState<string[]>([]);
  const [rejectOpenIds, setRejectOpenIds] = useState<string[]>([]);
  const [rejectReasons, setRejectReasons] = useState<Record<string, string>>({});
  const [checklists, setChecklists] = useState<
    Record<string, ListingReviewChecklistItem[]>
  >({});

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await listAdminListings({
        limit: 100,
        sortBy: "createdAt",
        sortOrder: "desc",
      });
      const data = response.data || [];
      setItems(data);
      setChecklists((current) => {
        const next = { ...current };
        for (const listing of data) {
          if (!next[listing.id]) {
            next[listing.id] = hydrateChecklist(listing.reviewChecklist);
          }
        }
        return next;
      });
    } catch (err) {
      setError(
        err instanceof ApiError || err instanceof Error
          ? err.message
          : "Could not load listings"
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

  const counts = useMemo(() => {
    const next: Record<StatusFilterId, number> = {
      all: items.length,
      under_review: 0,
      live: 0,
      rejected: 0,
      paused: 0,
    };
    for (const item of items) {
      if (item.status === "under_review") next.under_review += 1;
      if (item.status === "live") next.live += 1;
      if (item.status === "rejected") next.rejected += 1;
      if (item.status === "paused") next.paused += 1;
    }
    return next;
  }, [items]);

  const visibleItems = useMemo(() => {
    if (statusFilter === "all") return items;
    return items.filter((item) => item.status === statusFilter);
  }, [items, statusFilter]);

  const patchItem = (updated: ListingDto) => {
    setItems((current) =>
      current.map((item) => (item.id === updated.id ? updated : item))
    );
    if (updated.reviewChecklist?.length) {
      setChecklists((current) => ({
        ...current,
        [updated.id]: hydrateChecklist(updated.reviewChecklist),
      }));
    }
  };

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-[50px] lg:py-[30px]">
      <div className="flex w-full flex-col gap-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:pb-2">
          <div>
            <h1 className="font-inter text-[clamp(1.5rem,3vw,1.75rem)] font-bold text-black">
              Listing Verification
            </h1>
            <p className="mt-1 font-inter text-sm text-brand-dark/50">
              Check each item like a checklist book. Approve or reject emails the
              owner with what passed and what failed.
            </p>
          </div>
          <span className="inline-flex w-fit items-center rounded bg-[#f59e0b] px-3 py-1.5 font-inter text-[13px] font-bold text-white">
            {counts.under_review} Pending
          </span>
        </header>

        <div className="flex flex-col gap-5">
          <div
            role="tablist"
            aria-label="Listing status filters"
            className="flex gap-2 overflow-x-auto pb-1"
          >
            {statusFilters.map((tab) => {
              const isActive = tab.id === statusFilter;
              const count = counts[tab.id];
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setStatusFilter(tab.id)}
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
            Showing {visibleItems.length} listing
            {visibleItems.length === 1 ? "" : "s"}.
          </p>

          {loading ? (
            <p className="font-inter text-sm text-brand-dark/60">Loading listings…</p>
          ) : null}
          {error ? (
            <p role="alert" className="font-inter text-sm font-medium text-red-600">
              {error}
            </p>
          ) : null}
          {!loading && !error && visibleItems.length === 0 ? (
            <p className="font-inter text-sm text-brand-dark/60">
              No listings in this filter yet.
            </p>
          ) : null}

          <div className="flex flex-col gap-4">
            {visibleItems.map((listing) => {
              const checklist =
                checklists[listing.id] ||
                hydrateChecklist(listing.reviewChecklist);
              return (
                <ListingVerificationCard
                  key={listing.id}
                  listing={listing}
                  checklist={checklist}
                  busy={busyId === listing.id}
                  detailsOpen={detailsOpenIds.includes(listing.id)}
                  rejectOpen={rejectOpenIds.includes(listing.id)}
                  rejectReason={rejectReasons[listing.id] ?? ""}
                  onChecklistStatus={(id, status) => {
                    setChecklists((current) => {
                      const existing =
                        current[listing.id] ||
                        hydrateChecklist(listing.reviewChecklist);
                      return {
                        ...current,
                        [listing.id]: existing.map((item) =>
                          item.id === id ? { ...item, status } : item
                        ),
                      };
                    });
                  }}
                  onToggleDetails={() => {
                    setDetailsOpenIds((current) =>
                      current.includes(listing.id)
                        ? current.filter((entry) => entry !== listing.id)
                        : [...current, listing.id]
                    );
                  }}
                  onApprove={async () => {
                    setBusyId(listing.id);
                    setError(null);
                    try {
                      const updated = await approveAdminListing(listing.id, {
                        checklist,
                      });
                      patchItem(updated);
                      setRejectOpenIds((current) =>
                        current.filter((id) => id !== listing.id)
                      );
                    } catch (err) {
                      setError(
                        err instanceof Error
                          ? err.message
                          : "Could not approve listing"
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
                    setBusyId(listing.id);
                    setError(null);
                    try {
                      const updated = await rejectAdminListing(listing.id, {
                        reason: (rejectReasons[listing.id] || "").trim(),
                        checklist,
                      });
                      patchItem(updated);
                      setRejectOpenIds((current) =>
                        current.filter((id) => id !== listing.id)
                      );
                    } catch (err) {
                      setError(
                        err instanceof Error
                          ? err.message
                          : "Could not reject listing"
                      );
                    } finally {
                      setBusyId(null);
                    }
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
