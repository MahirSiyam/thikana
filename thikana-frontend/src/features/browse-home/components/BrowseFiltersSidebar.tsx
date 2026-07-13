"use client";

import Image from "next/image";
import { useState } from "react";
import { filterCategories } from "@/features/browse-home/data/browse-home.mock";
import type { FilterCategory } from "@/features/browse-home/types/browse-home.types";

function FilterSelect({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex w-full flex-col gap-2">
      <p className="font-inter text-sm font-semibold text-brand-dark">{label}</p>
      <button
        type="button"
        className="flex h-10 w-full items-center justify-between rounded-md border border-[#e5e5e2] px-3 font-inter text-sm text-[#5b6b82]"
      >
        <span>{value}</span>
        <Image
          src="/images/home/icon-chevron-down.svg"
          alt=""
          width={12}
          height={12}
          aria-hidden="true"
        />
      </button>
    </div>
  );
}

export function BrowseFiltersSidebar() {
  const [activeCategory, setActiveCategory] = useState<FilterCategory | null>(null);
  const [verifiedOnly, setVerifiedOnly] = useState(true);

  return (
    <aside className="flex w-full flex-col gap-6 rounded-[10px] border border-[#e5e5e2] bg-white p-5 lg:sticky lg:top-28 lg:w-[295px] lg:shrink-0">
      <p className="font-inter text-lg font-bold text-brand-dark">Filters</p>

      <FilterSelect label="Location" value="Dhaka" />
      <FilterSelect label="Budget Range" value="৳5k - ৳50k" />
      <FilterSelect label="Property Type" value="Apartment" />
      <FilterSelect label="Bedrooms" value="2 Bedrooms" />

      <div className="flex w-full flex-col gap-3">
        <p className="font-inter text-[13px] font-semibold text-brand-dark">Category</p>
        <div className="flex flex-wrap gap-2">
          {filterCategories.map((category) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() =>
                  setActiveCategory((current) => (current === category ? null : category))
                }
                className={`rounded-full border px-2.5 py-1.5 font-inter text-[11px] transition-colors ${
                  isActive
                    ? "border-brand-dark bg-brand-dark text-white"
                    : "border-[#e5e5e2] text-brand-dark hover:bg-brand-dark/5"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex w-full flex-col gap-2">
        <p className="font-inter text-sm font-semibold text-brand-dark">Verification</p>
        <div className="flex items-center justify-between gap-3">
          <span className="font-inter text-[13px] text-[#5b6b82]">Show verified only</span>
          <button
            type="button"
            role="switch"
            aria-checked={verifiedOnly}
            aria-label="Show verified only"
            onClick={() => setVerifiedOnly((value) => !value)}
            className={`relative h-5 w-10 rounded-full transition-colors ${
              verifiedOnly ? "bg-brand-dark" : "bg-[#e5e5e2]"
            }`}
          >
            <span
              className={`absolute top-0.5 size-4 rounded-full bg-white transition-transform ${
                verifiedOnly ? "left-[22px]" : "left-0.5"
              }`}
            />
          </button>
        </div>
      </div>

      <button
        type="button"
        className="inline-flex w-full items-center justify-center rounded-(--nav-pill-radius) bg-brand-dark py-3.5 font-inter text-[15px] font-bold text-white transition-colors hover:bg-brand-dark/90"
      >
        Apply Filters
      </button>
    </aside>
  );
}
