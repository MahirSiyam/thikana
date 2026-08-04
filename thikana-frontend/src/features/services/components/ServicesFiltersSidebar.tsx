"use client";

import Image from "next/image";
import type { ServicesFilters } from "@/features/services/types/services.types";

type ServicesFiltersSidebarProps = {
  draft: ServicesFilters;
  onDraftChange: (next: ServicesFilters) => void;
  onApply: () => void;
  onClear: () => void;
};

export function ServicesFiltersSidebar({
  draft,
  onDraftChange,
  onApply,
  onClear,
}: ServicesFiltersSidebarProps) {
  const patch = (changes: Partial<ServicesFilters>) =>
    onDraftChange({ ...draft, ...changes });

  return (
    <aside className="flex w-full flex-col gap-6 rounded-[20px] bg-white px-4 py-5 lg:sticky lg:top-28 lg:w-[302px] lg:shrink-0">
      <div className="flex w-full flex-col gap-4">
        <div className="flex items-center justify-between">
          <p className="font-inter text-base font-bold uppercase text-brand-dark">
            Filters
          </p>
          <button
            type="button"
            onClick={onClear}
            className="font-inter text-xs font-semibold text-brand-dark transition-opacity hover:opacity-70"
          >
            Clear all
          </button>
        </div>

        <div className="flex w-full flex-col gap-2">
          <label
            htmlFor="services-filter-area"
            className="font-inter text-[13px] font-medium uppercase text-brand-dark/50"
          >
            Location
          </label>
          <div className="flex h-11 w-full items-center gap-2 rounded-lg border border-brand-dark/50 px-3">
            <Image
              src="/images/browse-home/icon-map-pin-muted.svg"
              alt=""
              width={16}
              height={16}
              aria-hidden="true"
              className="shrink-0"
            />
            <input
              id="services-filter-area"
              type="text"
              value={draft.area}
              onChange={(event) => patch({ area: event.target.value })}
              placeholder="Area or district"
              className="min-w-0 flex-1 bg-transparent font-inter text-sm text-brand-dark outline-none placeholder:text-brand-dark/40"
            />
          </div>
        </div>
        <div className="h-px w-full bg-[#e5e5e2]" aria-hidden="true" />
      </div>

      <div className="flex w-full flex-col gap-4">
        <p className="font-jakarta text-sm font-bold uppercase text-brand-dark">
          Rating
        </p>
        <div className="flex flex-col gap-2">
          {[0, 4, 3].map((value) => {
            const selected = draft.minRating === value;
            const label =
              value === 0 ? "Any rating" : `${value.toFixed(1)}+ stars`;
            return (
              <button
                key={value}
                type="button"
                aria-pressed={selected}
                onClick={() => patch({ minRating: value })}
                className={`rounded-lg border px-3 py-2 text-left font-inter text-sm transition-colors ${
                  selected
                    ? "border-brand-dark bg-brand-dark/5 font-semibold text-brand-dark"
                    : "border-[#e8eaed] text-brand-dark/60 hover:border-brand-dark/40"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
        <div className="h-px w-full bg-[#e5e5e2]" aria-hidden="true" />
      </div>

      <div className="flex w-full flex-col gap-4">
        <p className="font-inter text-base font-bold uppercase text-brand-dark">
          Budget per Job
        </p>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col gap-1">
            <label
              htmlFor="services-budget-min"
              className="font-inter text-[11px] text-brand-dark/50"
            >
              Min (৳)
            </label>
            <input
              id="services-budget-min"
              type="number"
              min={0}
              value={draft.budgetMin}
              onChange={(event) =>
                patch({ budgetMin: Number(event.target.value) || 0 })
              }
              className="h-10 rounded-lg border border-[#e8eaed] px-3 font-inter text-sm text-brand-dark outline-none focus-visible:ring-2 focus-visible:ring-brand-dark"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label
              htmlFor="services-budget-max"
              className="font-inter text-[11px] text-brand-dark/50"
            >
              Max (৳)
            </label>
            <input
              id="services-budget-max"
              type="number"
              min={0}
              value={draft.budgetMax}
              onChange={(event) =>
                patch({ budgetMax: Number(event.target.value) || 0 })
              }
              className="h-10 rounded-lg border border-[#e8eaed] px-3 font-inter text-sm text-brand-dark outline-none focus-visible:ring-2 focus-visible:ring-brand-dark"
            />
          </div>
        </div>
        <div className="h-px w-full bg-[#e5e5e2]" aria-hidden="true" />
      </div>

      <div className="flex w-full flex-col gap-4">
        <p className="font-inter text-base font-bold uppercase text-brand-dark">
          Availability
        </p>
        <div className="flex items-center justify-between gap-3">
          <span className="font-inter text-sm text-brand-dark/50">
            Available Today
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={draft.availableToday}
            aria-label="Available today"
            onClick={() => patch({ availableToday: !draft.availableToday })}
            className={`relative h-[22px] w-10 rounded-full transition-colors ${
              draft.availableToday ? "bg-brand-dark" : "bg-[#e5e5e2]"
            }`}
          >
            <span
              className={`absolute top-0.5 size-[18px] rounded-full bg-white transition-transform ${
                draft.availableToday ? "left-[20px]" : "left-0.5"
              }`}
            />
          </button>
        </div>
        <div className="h-px w-full bg-[#e5e5e2]" aria-hidden="true" />
      </div>

      <button
        type="button"
        onClick={onApply}
        className="inline-flex w-full items-center justify-center rounded-full bg-brand-dark py-3.5 font-inter text-[15px] font-bold text-white transition-colors hover:bg-brand-dark/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
      >
        Apply Filters
      </button>
    </aside>
  );
}
