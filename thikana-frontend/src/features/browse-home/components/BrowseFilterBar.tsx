"use client";

import Image from "next/image";
import { useState } from "react";

export function BrowseFilterBar() {
  const [beds, setBeds] = useState(2);

  return (
    <div className="w-full rounded-2xl bg-white p-3 shadow-[0_4px_6px_rgba(0,0,0,0.05)] sm:p-4 md:rounded-3xl lg:flex lg:h-[86px] lg:items-center lg:gap-4 lg:rounded-[50px] lg:px-4 lg:py-0">
      <div className="grid grid-cols-1 gap-0 divide-y divide-[#e5e5e2] sm:grid-cols-2 sm:gap-x-4 sm:gap-y-1 sm:divide-y-0 md:grid-cols-2 lg:flex lg:min-w-0 lg:flex-1 lg:items-center lg:gap-4 lg:divide-y-0">
        <button
          type="button"
          className="flex min-w-0 items-center gap-2 px-1 py-3 text-left font-inter text-sm text-brand-dark sm:rounded-xl sm:border sm:border-[#e5e5e2] sm:px-3 sm:py-2.5 md:text-base lg:flex-1 lg:rounded-none lg:border-0 lg:px-1 lg:py-0"
        >
          <Image
            src="/images/home/icon-map-pin.svg"
            alt=""
            width={16}
            height={16}
            aria-hidden="true"
            className="shrink-0"
          />
          <span className="truncate">Dhaka</span>
        </button>

        <span className="hidden h-6 w-px shrink-0 bg-[#e5e5e2] lg:block" aria-hidden="true" />

        <button
          type="button"
          className="flex min-w-0 items-center px-1 py-3 text-left font-inter text-sm text-brand-dark sm:rounded-xl sm:border sm:border-[#e5e5e2] sm:px-3 sm:py-2.5 md:text-base lg:flex-1 lg:rounded-none lg:border-0 lg:px-1 lg:py-0"
        >
          <span className="truncate">৳5,000 – ৳50,000+</span>
        </button>

        <span className="hidden h-6 w-px shrink-0 bg-[#e5e5e2] lg:block" aria-hidden="true" />

        <button
          type="button"
          className="flex min-w-0 items-center justify-between gap-2 px-1 py-3 text-left font-inter text-sm text-brand-dark sm:rounded-xl sm:border sm:border-[#e5e5e2] sm:px-3 sm:py-2.5 md:text-base lg:flex-1 lg:justify-start lg:rounded-none lg:border-0 lg:px-1 lg:py-0"
        >
          <span className="truncate">Apartment</span>
          <Image
            src="/images/home/icon-chevron-down.svg"
            alt=""
            width={12}
            height={12}
            aria-hidden="true"
            className="shrink-0"
          />
        </button>

        <span className="hidden h-6 w-px shrink-0 bg-[#e5e5e2] lg:block" aria-hidden="true" />

        <div className="flex items-center justify-between gap-2 px-1 py-3 sm:justify-start sm:rounded-xl sm:border sm:border-[#e5e5e2] sm:px-3 sm:py-2.5 lg:justify-start lg:rounded-none lg:border-0 lg:px-1 lg:py-0">
          <button
            type="button"
            aria-label="Decrease bedrooms"
            onClick={() => setBeds((value) => Math.max(1, value - 1))}
            className="inline-flex size-7 items-center justify-center rounded-xl border border-[#e5e5e2] bg-black/5 sm:size-6"
          >
            <Image src="/images/browse-home/icon-minus.svg" alt="" width={12} height={12} aria-hidden="true" />
          </button>
          <span className="min-w-[3.75rem] text-center font-inter text-sm font-semibold text-brand-dark md:text-base">
            {beds} Beds
          </span>
          <button
            type="button"
            aria-label="Increase bedrooms"
            onClick={() => setBeds((value) => Math.min(10, value + 1))}
            className="inline-flex size-7 items-center justify-center rounded-xl border border-[#e5e5e2] bg-black/5 sm:size-6"
          >
            <Image src="/images/browse-home/icon-plus.svg" alt="" width={12} height={12} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2 sm:mt-4 sm:grid-cols-2 lg:mt-0 lg:ml-auto lg:flex lg:shrink-0 lg:items-center lg:gap-3">
        <button
          type="button"
          className="inline-flex h-11 w-full items-center justify-center rounded-(--nav-pill-radius) border border-brand-dark px-4 font-inter text-sm font-semibold text-brand-dark transition-colors hover:bg-brand-dark/5 md:text-base lg:h-auto lg:w-auto lg:py-2.5"
        >
          More Filters
        </button>
        <button
          type="button"
          className="inline-flex h-11 w-full items-center justify-center rounded-(--nav-pill-radius) bg-brand-dark px-6 font-inter text-sm font-bold text-white transition-colors hover:bg-brand-dark/90 md:text-base lg:h-auto lg:w-auto lg:py-3"
        >
          Search
        </button>
      </div>
    </div>
  );
}
