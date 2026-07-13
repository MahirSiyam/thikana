"use client";

import Image from "next/image";
import { useState } from "react";

export function ServicesFiltersSidebar() {
  const [availableToday, setAvailableToday] = useState(true);
  const [verifiedOnly, setVerifiedOnly] = useState(true);

  return (
    <aside className="flex w-full flex-col gap-6 rounded-[20px] bg-white px-4 py-5 lg:sticky lg:top-28 lg:w-[302px] lg:shrink-0">
      <div className="flex w-full flex-col gap-4">
        <div className="flex items-center justify-between">
          <p className="font-inter text-base font-bold uppercase text-brand-dark">Filters</p>
          <button
            type="button"
            className="font-inter text-xs font-semibold text-brand-dark transition-opacity hover:opacity-70"
          >
            Clear all
          </button>
        </div>

        <div className="flex w-full flex-col gap-2">
          <p className="font-inter text-[13px] font-medium uppercase text-brand-dark/50">Location</p>
          <button
            type="button"
            className="flex h-11 w-full items-center gap-2 rounded-lg border border-brand-dark/50 px-3 font-inter text-sm text-brand-dark"
          >
            <Image
              src="/images/browse-home/icon-map-pin-muted.svg"
              alt=""
              width={16}
              height={16}
              aria-hidden="true"
              className="shrink-0"
            />
            <span className="min-w-0 flex-1 truncate text-left">Dhaka, Bangladesh</span>
            <Image
              src="/images/home/icon-chevron-down.svg"
              alt=""
              width={16}
              height={16}
              aria-hidden="true"
              className="shrink-0"
            />
          </button>
        </div>
        <div className="h-px w-full bg-[#e5e5e2]" aria-hidden="true" />
      </div>

      <div className="flex w-full flex-col gap-4">
        <p className="font-jakarta text-sm font-bold uppercase text-brand-dark">Rating</p>
        <div className="flex flex-col gap-3">
          <div className="flex items-start gap-1.5" aria-label="4.0 plus stars">
            {Array.from({ length: 4 }).map((_, index) => (
              <Image
                key={`filled-${index}`}
                src="/images/services/icon-star-filter.svg"
                alt=""
                width={24}
                height={24}
                aria-hidden="true"
              />
            ))}
            <Image
              src="/images/services/icon-star-filter-empty.svg"
              alt=""
              width={24}
              height={24}
              aria-hidden="true"
            />
          </div>
          <p className="font-inter text-sm text-brand-dark/50">4.0+ stars</p>
        </div>
        <div className="h-px w-full bg-[#e5e5e2]" aria-hidden="true" />
      </div>

      <div className="flex w-full flex-col gap-4">
        <p className="font-inter text-base font-bold uppercase text-brand-dark">Budget per Job</p>
        <div className="flex w-full flex-col gap-2">
          <div className="relative h-4 w-full">
            <div className="absolute top-1.5 h-1 w-full rounded-[2px] bg-[#e8eaed]" />
            <div className="absolute top-1.5 left-[12%] h-1 w-[65%] rounded-[2px] bg-brand-dark" />
            <span className="absolute left-[10%] top-0 size-4 rounded-full border-2 border-brand-dark bg-white shadow-sm" />
            <span className="absolute left-[72%] top-0 size-4 rounded-full border-2 border-brand-dark bg-white shadow-sm" />
          </div>
          <div className="flex items-start justify-between font-inter text-[13px] text-brand-dark/50">
            <span>৳500</span>
            <span>৳5,000</span>
          </div>
        </div>
        <div className="h-px w-full bg-[#e5e5e2]" aria-hidden="true" />
      </div>

      <div className="flex w-full flex-col gap-4">
        <p className="font-inter text-base font-bold uppercase text-brand-dark">Availability</p>
        <div className="flex items-center justify-between gap-3">
          <span className="font-inter text-sm text-brand-dark/50">Available Today</span>
          <button
            type="button"
            role="switch"
            aria-checked={availableToday}
            aria-label="Available today"
            onClick={() => setAvailableToday((value) => !value)}
            className={`relative h-[22px] w-10 rounded-full transition-colors ${
              availableToday ? "bg-brand-dark" : "bg-[#e5e5e2]"
            }`}
          >
            <span
              className={`absolute top-0.5 size-[18px] rounded-full bg-white transition-transform ${
                availableToday ? "left-[20px]" : "left-0.5"
              }`}
            />
          </button>
        </div>
        <div className="h-px w-full bg-[#e5e5e2]" aria-hidden="true" />
      </div>

      <div className="flex w-full flex-col gap-4">
        <p className="font-inter text-base font-bold uppercase text-brand-dark">Verified</p>
        <button
          type="button"
          onClick={() => setVerifiedOnly((value) => !value)}
          className="flex w-full items-center gap-2.5 text-left"
          aria-pressed={verifiedOnly}
        >
          <span
            className={`inline-flex size-5 shrink-0 items-center justify-center rounded ${
              verifiedOnly ? "bg-brand-dark" : "border border-[#e5e5e2] bg-white"
            }`}
          >
            {verifiedOnly ? (
              <Image
                src="/images/services/icon-check-white.svg"
                alt=""
                width={14}
                height={14}
                aria-hidden="true"
              />
            ) : null}
          </span>
          <span className="font-inter text-sm font-medium text-brand-dark">
            Thikana Verified Only
          </span>
          <Image
            src="/images/services/icon-shield-check.svg"
            alt=""
            width={16}
            height={16}
            aria-hidden="true"
            className="shrink-0"
          />
        </button>
        <div className="h-px w-full bg-[#e5e5e2]" aria-hidden="true" />
      </div>

      <button
        type="button"
        className="inline-flex w-full items-center justify-center rounded-full bg-brand-dark py-3.5 font-inter text-[15px] font-bold text-white transition-colors hover:bg-brand-dark/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
      >
        Apply Filters
      </button>
    </aside>
  );
}
