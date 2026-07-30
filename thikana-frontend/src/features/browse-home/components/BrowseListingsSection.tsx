"use client";

import { useCallback, useEffect, useState } from "react";
import { BrowseFiltersSidebar } from "@/features/browse-home/components/BrowseFiltersSidebar";
import { BrowseListingCard } from "@/features/browse-home/components/BrowseListingCard";
import { BrowsePagination } from "@/features/browse-home/components/BrowsePagination";
import { useBrowseFilters } from "@/features/browse-home/context/BrowseFiltersProvider";
import {
  browseFiltersToApiParams,
  BROWSE_SORT_OPTIONS,
} from "@/features/browse-home/lib/browse-filters";
import type { BrowseHouseListing } from "@/features/browse-home/types/browse-home.types";
import { Container } from "@/components/shared/Container";
import { ApiError } from "@/lib/api/client";
import {
  browsePublicListings,
  type ListingDto,
} from "@/lib/api/listings";

const FALLBACK_IMAGE = "/images/browse-home/listing-cozy-dhanmondi.png";

function toBrowseCard(listing: ListingDto): BrowseHouseListing {
  return {
    id: listing.id,
    title: listing.title,
    location: [listing.address.area, listing.address.district, listing.address.division]
      .filter(Boolean)
      .join(", "),
    priceLabel: `BDT ${listing.monthlyRent.toLocaleString("en-US")}/mo`,
    beds: listing.beds,
    baths: listing.baths,
    sqft: listing.sizeSqft,
    reviewCount: 0,
    verified: listing.status === "live",
    imageSrc:
      listing.coverImageUrl ||
      listing.images[0]?.secureUrl ||
      FALLBACK_IMAGE,
    slug: listing.slug,
  };
}

export function BrowseListingsSection() {
  const { filters, setPage, setSort } = useBrowseFilters();
  const [listings, setListings] = useState<BrowseHouseListing[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await browsePublicListings(
        browseFiltersToApiParams(filters)
      );
      setListings((response.data || []).map(toBrowseCard));
      setTotal(response.pagination?.total || 0);
      setTotalPages(response.pagination?.totalPages || 1);
    } catch (err) {
      setError(
        err instanceof ApiError || err instanceof Error
          ? err.message
          : "Could not load listings"
      );
      setListings([]);
      setTotal(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void load();
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [load]);

  const sortLabel =
    BROWSE_SORT_OPTIONS.find((item) => item.id === filters.sort)?.label ||
    "Newest";

  return (
    <section className="bg-surface py-8 sm:py-12 lg:py-[79px]" aria-labelledby="homes-found-heading">
      <Container>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
            <BrowseFiltersSidebar />

            <div className="flex min-w-0 flex-1 flex-col items-center gap-8 lg:gap-10">
              <div className="flex w-full flex-col gap-6 sm:gap-8">
                <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div className="space-y-1">
                    <h2
                      id="homes-found-heading"
                      className="font-inter text-[clamp(1.375rem,3vw,1.75rem)] font-semibold text-brand-dark"
                    >
                      Homes Found in {filters.division || "Bangladesh"}
                    </h2>
                    <p className="font-inter text-sm text-[#6b7280]">
                      {loading
                        ? "Loading properties…"
                        : `${total} ${total === 1 ? "property matches" : "properties match"} your criteria`}
                    </p>
                  </div>
                  <label className="flex items-center gap-2 font-inter text-sm">
                    <span className="text-[#6b7280]">Sort by:</span>
                    <select
                      value={filters.sort}
                      onChange={(event) =>
                        setSort(event.target.value as typeof filters.sort)
                      }
                      className="rounded-md border border-[#e5e5e2] bg-white px-2 py-1 font-semibold text-brand-dark outline-none focus-visible:ring-2 focus-visible:ring-brand-dark"
                      aria-label="Sort listings"
                    >
                      {BROWSE_SORT_OPTIONS.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <span className="sr-only">{sortLabel}</span>
                  </label>
                </div>

                {error ? (
                  <p role="alert" className="font-inter text-sm font-medium text-red-600">
                    {error}
                  </p>
                ) : null}

                {!loading && !error && listings.length === 0 ? (
                  <p className="font-inter text-sm text-[#6b7280]">
                    No live listings match these filters. Try another division or clear some filters.
                  </p>
                ) : null}

                <ul className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {listings.map((listing) => (
                    <li key={listing.id}>
                      <BrowseListingCard listing={listing} />
                    </li>
                  ))}
                </ul>
              </div>

              {totalPages > 1 ? (
                <BrowsePagination
                  page={filters.page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              ) : null}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
