"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Container } from "@/components/shared/Container";
import { ServiceProviderCard } from "@/features/services/components/ServiceProviderCard";
import { ServicesFiltersSidebar } from "@/features/services/components/ServicesFiltersSidebar";
import { ServicesPagination } from "@/features/services/components/ServicesPagination";
import { applyClientFilters } from "@/features/services/lib/provider-display";
import {
  defaultServicesFilters,
  servicesCategoryOptions,
  type ServicesCategoryFilter,
  type ServicesSortId,
} from "@/features/services/types/services.types";
import {
  listPublicProviders,
  type PublicProvider,
} from "@/lib/api/provider";

type ServicesListingsSectionProps = {
  activeCategory: ServicesCategoryFilter;
  onCategoryChange: (category: ServicesCategoryFilter) => void;
  searchQuery: string;
  initialArea?: string;
  initialBudget?: string;
};

const SORT_OPTIONS: { id: ServicesSortId; label: string }[] = [
  { id: "top-rated", label: "Top Rated" },
  { id: "price-low", label: "Price: Low to High" },
  { id: "price-high", label: "Price: High to Low" },
];

export function ServicesListingsSection({
  activeCategory,
  onCategoryChange,
  searchQuery,
  initialArea = "",
  initialBudget = "",
}: ServicesListingsSectionProps) {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<ServicesSortId>("top-rated");
  const [sortOpen, setSortOpen] = useState(false);
  const [draftFilters, setDraftFilters] = useState(defaultServicesFilters);
  const [appliedFilters, setAppliedFilters] = useState(defaultServicesFilters);
  const [items, setItems] = useState<PublicProvider[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialArea || initialBudget) {
      let minPrice = 0;
      let maxPrice = 50000;
      if (initialBudget === "under-1k") {
        maxPrice = 1000;
      } else if (initialBudget === "1k-5k") {
        minPrice = 1000;
        maxPrice = 5000;
      } else if (initialBudget === "5k-plus") {
        minPrice = 5000;
        maxPrice = 50000;
      }

      const next = {
        ...defaultServicesFilters,
        area: initialArea || "",
        budgetMin: minPrice,
        budgetMax: maxPrice,
      };
      setDraftFilters(next);
      setAppliedFilters(next);
    }
  }, [initialArea, initialBudget]);

  useEffect(() => {
    setPage(1);
  }, [activeCategory, searchQuery]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await listPublicProviders({
        category: activeCategory === "all" ? undefined : activeCategory,
        search: searchQuery.trim() || undefined,
        area: appliedFilters.area.trim() || undefined,
        page,
        limit: 12,
      });
      setItems(result.items);
      setTotal(result.pagination?.total || result.items.length);
      setTotalPages(result.pagination?.totalPages || 1);
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Could not load service providers"
      );
      setItems([]);
      setTotal(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [activeCategory, searchQuery, appliedFilters.area, page]);

  useEffect(() => {
    let active = true;
    void load().finally(() => {
      if (!active) return;
    });
    return () => {
      active = false;
    };
  }, [load]);

  const visibleItems = useMemo(
    () => applyClientFilters(items, appliedFilters, sort),
    [items, appliedFilters, sort]
  );

  const categoryLabel =
    servicesCategoryOptions.find((option) => option.id === activeCategory)
      ?.label || "All";

  const resultsLabel = searchQuery.trim()
    ? `Showing ${visibleItems.length} of ${total} results for “${searchQuery.trim()}”`
    : appliedFilters.area.trim()
      ? `Showing ${visibleItems.length} of ${total} ${categoryLabel.toLowerCase()} providers in ${appliedFilters.area.trim()}`
      : `Showing ${visibleItems.length} of ${total} ${categoryLabel.toLowerCase()} providers`;

  const sortLabel =
    SORT_OPTIONS.find((option) => option.id === sort)?.label || "Top Rated";

  return (
    <section
      className="bg-surface py-12 sm:py-16 lg:py-20"
      aria-labelledby="services-listings-heading"
    >
      <Container>
        <h2 id="services-listings-heading" className="sr-only">
          Service providers
        </h2>

        <div className="flex w-full gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:flex-wrap sm:justify-center sm:overflow-visible [&::-webkit-scrollbar]:hidden">
          {servicesCategoryOptions.map((category) => {
            const isActive = category.id === activeCategory;
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => onCategoryChange(category.id)}
                className={`inline-flex shrink-0 items-center rounded-full px-4 py-2.5 font-inter text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark ${
                  isActive
                    ? "bg-brand-dark text-white"
                    : "border border-brand-dark text-brand-dark/50 hover:bg-brand-dark/5"
                }`}
              >
                {category.label}
              </button>
            );
          })}
        </div>

        <div className="mt-10 flex flex-col gap-5 lg:mt-12 lg:flex-row lg:items-start">
          <ServicesFiltersSidebar
            draft={draftFilters}
            onDraftChange={setDraftFilters}
            onApply={() => {
              setAppliedFilters(draftFilters);
              setPage(1);
            }}
            onClear={() => {
              setDraftFilters(defaultServicesFilters);
              setAppliedFilters(defaultServicesFilters);
              setPage(1);
            }}
          />

          <div className="flex min-w-0 flex-1 flex-col gap-8 lg:gap-12">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="font-inter text-sm font-medium text-brand-dark/50">
                  {loading ? "Loading providers…" : resultsLabel}
                </p>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setSortOpen((open) => !open)}
                    className="inline-flex w-fit items-center gap-2 rounded-full border border-[#e8eaed] px-3 py-2 font-inter text-sm text-brand-dark"
                  >
                    <span>
                      Sort: <span className="font-semibold">{sortLabel}</span>
                    </span>
                    <Image
                      src="/images/home/icon-chevron-down.svg"
                      alt=""
                      width={14}
                      height={14}
                      aria-hidden="true"
                      className="shrink-0"
                    />
                  </button>
                  {sortOpen ? (
                    <div className="absolute right-0 z-20 mt-2 min-w-[200px] overflow-hidden rounded-xl border border-[#e8eaed] bg-white shadow-lg">
                      {SORT_OPTIONS.map((option) => (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => {
                            setSort(option.id);
                            setSortOpen(false);
                          }}
                          className={`block w-full px-4 py-2.5 text-left font-inter text-sm transition-colors hover:bg-[#f5f5f3] ${
                            option.id === sort
                              ? "font-semibold text-brand-dark"
                              : "text-brand-dark/70"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>

              {error ? (
                <p className="rounded-xl border border-[#fecaca] bg-[#fef2f2] p-4 font-inter text-sm text-[#b91c1c]">
                  {error}
                </p>
              ) : null}

              {loading ? (
                <p className="rounded-xl border border-dashed border-[#e8eaed] bg-white p-10 text-center font-inter text-sm text-brand-dark/50">
                  Loading verified providers…
                </p>
              ) : visibleItems.length === 0 ? (
                <p className="rounded-xl border border-dashed border-[#e8eaed] bg-white p-10 text-center font-inter text-sm text-brand-dark/50">
                  No providers match your filters yet. Try another category or
                  clear filters.
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {visibleItems.map((provider) => (
                    <ServiceProviderCard
                      key={provider.id}
                      provider={provider}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-center">
              <ServicesPagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
