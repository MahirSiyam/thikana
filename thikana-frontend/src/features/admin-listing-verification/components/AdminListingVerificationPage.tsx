"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  listingVerificationSteps,
  listingVerificationTabs,
  pendingVerificationCount,
  verificationListings,
} from "@/features/admin-listing-verification/data/admin-listing-verification.mock";
import type {
  ListingVerificationTabId,
  VerificationListing,
} from "@/features/admin-listing-verification/types/admin-listing-verification.types";
import { routes } from "@/config/routes";

function VerificationStepper({ currentStepIndex }: { currentStepIndex: number }) {
  return (
    <div className="flex w-full max-w-[400px] items-center gap-2 sm:gap-3">
      {listingVerificationSteps.map((step, index) => {
        const isComplete = index < currentStepIndex;
        const isCurrent = index === currentStepIndex;
        const isUpcoming = index > currentStepIndex;

        return (
          <div key={step.id} className="flex min-w-0 flex-1 flex-col items-center gap-1">
            <div
              className={`flex size-4 items-center justify-center rounded-lg border ${
                isUpcoming
                  ? "border-white bg-white"
                  : isCurrent
                    ? "border-brand-dark bg-brand-dark"
                    : "border-brand-dark bg-white"
              }`}
            >
              {isComplete ? (
                <Image
                  src="/images/admin/icon-step-check.svg"
                  alt=""
                  width={10}
                  height={10}
                  aria-hidden="true"
                  className="size-2.5"
                />
              ) : null}
            </div>
            <p
              className={`text-center font-inter text-[8px] uppercase leading-tight text-brand-dark ${
                isCurrent ? "font-bold" : "font-normal"
              }`}
            >
              {step.label}
            </p>
          </div>
        );
      })}
    </div>
  );
}

function ListingVerificationCard({
  listing,
  rejectOpen,
  rejectReason,
  onToggleReject,
  onRejectReasonChange,
  onCancelReject,
}: {
  listing: VerificationListing;
  rejectOpen: boolean;
  rejectReason: string;
  onToggleReject: () => void;
  onRejectReasonChange: (value: string) => void;
  onCancelReject: () => void;
}) {
  return (
    <article className="overflow-hidden rounded-lg bg-white shadow-[0px_4px_6px_rgba(0,0,0,0.04)]">
      <div
        className={`flex flex-col gap-5 p-5 lg:flex-row lg:items-center lg:gap-6 ${
          rejectOpen ? "rounded-t-lg" : "rounded-lg"
        }`}
      >
        <div className="relative size-20 shrink-0 overflow-hidden rounded-md">
          <Image
            src={listing.imageSrc}
            alt={listing.title}
            fill
            className="object-cover"
            sizes="80px"
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <h2 className="font-inter text-base font-bold text-brand-dark">{listing.title}</h2>
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-inter text-[13px] text-brand-dark/50">{listing.ownerName}</p>
            <span className="rounded bg-brand-dark px-1.5 py-0.5 font-inter text-[10px] font-semibold text-white">
              ✓ Owner
            </span>
          </div>
          <p className="font-inter text-xs text-brand-dark">
            {listing.submittedAt}
            <span className="mx-3">•</span>
            {listing.location}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-inter text-sm font-semibold text-brand-dark">{listing.price}</p>
            <span className="rounded bg-white px-2 py-0.5 font-inter text-[11px] text-brand-dark/50">
              {listing.propertyType}
            </span>
          </div>

          <div className="mt-2 w-full xl:hidden">
            <VerificationStepper currentStepIndex={listing.currentStepIndex} />
          </div>
        </div>

        <div className="hidden w-full max-w-[400px] shrink-0 xl:block">
          <VerificationStepper currentStepIndex={listing.currentStepIndex} />
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-[160px] sm:shrink-0">
          <button
            type="button"
            className="inline-flex w-full items-center justify-center rounded-md bg-brand-dark p-2 font-inter text-xs font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
          >
            Approve ✓
          </button>
          <button
            type="button"
            onClick={onToggleReject}
            className="inline-flex w-full items-center justify-center rounded-md border border-[#ef4444] p-2 font-inter text-xs font-semibold text-[#ef4444] transition-colors hover:bg-[#ef4444]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ef4444] focus-visible:ring-offset-2"
          >
            Reject ✗
          </button>
          <a
            href={routes.homeDetails}
            className="text-center font-inter text-[11px] font-semibold text-brand-dark underline underline-offset-2"
          >
            View Full Listing
          </a>
        </div>
      </div>

      {rejectOpen ? (
        <div className="flex flex-col gap-4 border-t border-white p-5">
          <p className="font-inter text-sm font-semibold text-brand-dark">Rejection Reason</p>
          <label className="sr-only" htmlFor={`reject-reason-${listing.id}`}>
            Rejection reason
          </label>
          <textarea
            id={`reject-reason-${listing.id}`}
            value={rejectReason}
            onChange={(event) => onRejectReasonChange(event.target.value)}
            placeholder="Enter reason for rejection..."
            className="min-h-[100px] w-full resize-y rounded-md border border-[#e2e8f0] bg-white p-3 font-inter text-[13px] text-brand-dark outline-none placeholder:text-brand-dark focus-visible:ring-2 focus-visible:ring-brand-dark"
          />
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              className="inline-flex items-center rounded-md bg-[#ef4444] px-4 py-2.5 font-inter text-[13px] font-bold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ef4444] focus-visible:ring-offset-2"
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
  const [rejectOpenIds, setRejectOpenIds] = useState<string[]>(() =>
    verificationListings
      .filter((listing) => listing.rejectExpandedByDefault)
      .map((listing) => listing.id),
  );
  const [rejectReasons, setRejectReasons] = useState<Record<string, string>>({});

  const visibleListings = useMemo(() => {
    if (activeTab === "all") return verificationListings;
    return verificationListings.filter((listing) => listing.tab === activeTab);
  }, [activeTab]);

  const toggleReject = (id: string) => {
    setRejectOpenIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-[50px] lg:py-[30px]">
      <div className="flex w-full flex-col gap-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:pb-6">
          <h1 className="font-inter text-[clamp(1.5rem,3vw,1.75rem)] font-bold text-black">
            Listing Verification Queue
          </h1>
          <span className="inline-flex w-fit items-center rounded bg-[#f59e0b] px-3 py-1.5 font-inter text-[13px] font-bold text-white">
            {pendingVerificationCount} Pending
          </span>
        </header>

        <div className="flex flex-col gap-5">
          <div
            role="tablist"
            aria-label="Listing verification filters"
            className="flex gap-2 overflow-x-auto pb-1"
          >
            {listingVerificationTabs.map((tab) => {
              const isActive = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveTab(tab.id)}
                  className={`shrink-0 rounded-full px-4 py-2.5 font-inter text-[13px] whitespace-nowrap transition-colors ${
                    isActive
                      ? "bg-brand-dark font-bold text-white"
                      : "bg-white font-medium text-brand-dark/50"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col gap-4">
            {visibleListings.map((listing) => (
              <ListingVerificationCard
                key={listing.id}
                listing={listing}
                rejectOpen={rejectOpenIds.includes(listing.id)}
                rejectReason={rejectReasons[listing.id] ?? ""}
                onToggleReject={() => toggleReject(listing.id)}
                onRejectReasonChange={(value) =>
                  setRejectReasons((current) => ({ ...current, [listing.id]: value }))
                }
                onCancelReject={() => {
                  setRejectOpenIds((current) =>
                    current.filter((item) => item !== listing.id),
                  );
                  setRejectReasons((current) => {
                    const next = { ...current };
                    delete next[listing.id];
                    return next;
                  });
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
