"use client";

import Image from "next/image";
import { useBrowseFilters } from "@/features/browse-home/context/BrowseFiltersProvider";
import {
  BROWSE_BUDGET_PRESETS,
  BROWSE_PROPERTY_TYPES,
  BROWSE_WHO_CAN_RENT,
  budgetPresetOf,
} from "@/features/browse-home/lib/browse-filters";
import { divisions } from "@/features/owner-add-new-listing/data/owner-add-new-listing.mock";

function FilterField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex w-full flex-col gap-2">
      <span className="font-inter text-sm font-semibold text-brand-dark">{label}</span>
      <div className="relative">
        {children}
        <Image
          src="/images/home/icon-chevron-down.svg"
          alt=""
          width={12}
          height={12}
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
        />
      </div>
    </label>
  );
}

const selectClassName =
  "h-10 w-full appearance-none rounded-md border border-[#e5e5e2] bg-white px-3 pr-8 font-inter text-sm text-[#5b6b82] outline-none focus-visible:ring-2 focus-visible:ring-brand-dark";

export function BrowseFiltersSidebar() {
  const { draft, setDraft, applyDraft, resetFilters } = useBrowseFilters();
  const budget = budgetPresetOf(draft.budget);

  return (
    <aside
      id="browse-filters-sidebar"
      className="flex w-full flex-col gap-6 rounded-[10px] border border-[#e5e5e2] bg-white p-5 lg:sticky lg:top-28 lg:z-20 lg:max-h-[calc(100dvh-8rem)] lg:w-[295px] lg:shrink-0 lg:self-start lg:overflow-y-auto"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="font-inter text-lg font-bold text-brand-dark">Filters</p>
        <button
          type="button"
          onClick={() => resetFilters()}
          className="font-inter text-xs font-semibold text-brand-dark/60 underline"
        >
          Reset
        </button>
      </div>

      <FilterField label="Location">
        <select
          value={draft.division}
          onChange={(event) => setDraft({ division: event.target.value })}
          className={selectClassName}
        >
          {divisions.map((item) => (
            <option key={item.id} value={item.label}>
              {item.label}
            </option>
          ))}
        </select>
      </FilterField>

      <FilterField label="Budget Range">
        <select
          value={draft.budget}
          onChange={(event) =>
            setDraft({ budget: event.target.value as typeof draft.budget })
          }
          className={selectClassName}
        >
          {BROWSE_BUDGET_PRESETS.map((item) => (
            <option key={item.id} value={item.id}>
              {item.shortLabel}
            </option>
          ))}
        </select>
      </FilterField>

      <FilterField label="Property Type">
        <select
          value={draft.propertyType}
          onChange={(event) =>
            setDraft({
              propertyType: event.target.value as typeof draft.propertyType,
            })
          }
          className={selectClassName}
        >
          <option value="">Any type</option>
          {BROWSE_PROPERTY_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </FilterField>

      <FilterField label="Bedrooms">
        <select
          value={draft.beds == null ? "" : String(draft.beds)}
          onChange={(event) =>
            setDraft({
              beds: event.target.value ? Number(event.target.value) : null,
            })
          }
          className={selectClassName}
        >
          <option value="">Any</option>
          {[1, 2, 3, 4, 5, 6].map((count) => (
            <option key={count} value={count}>
              {count} {count === 1 ? "Bedroom" : "Bedrooms"}
            </option>
          ))}
        </select>
      </FilterField>

      <div className="flex w-full flex-col gap-3">
        <p className="font-inter text-[13px] font-semibold text-brand-dark">Category</p>
        <div className="flex flex-wrap gap-2">
          {BROWSE_WHO_CAN_RENT.map((category) => {
            const isActive = draft.whoCanRent === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() =>
                  setDraft({
                    whoCanRent: isActive ? "" : category,
                  })
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

      <p className="font-inter text-[11px] text-[#9ca3af]">
        Active budget: {budget.label}
      </p>

      <button
        type="button"
        onClick={() => applyDraft()}
        className="inline-flex w-full items-center justify-center rounded-(--nav-pill-radius) bg-brand-dark py-3.5 font-inter text-[15px] font-bold text-white transition-colors hover:bg-brand-dark/90"
      >
        Apply Filters
      </button>
    </aside>
  );
}
