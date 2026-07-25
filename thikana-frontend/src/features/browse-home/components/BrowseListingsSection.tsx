"use client";

import { useCallback, useEffect, useState } from "react";
import { BrowseFilterBar } from "@/features/browse-home/components/BrowseFilterBar";
import { BrowseFiltersSidebar } from "@/features/browse-home/components/BrowseFiltersSidebar";
import { BrowseListingCard } from "@/features/browse-home/components/BrowseListingCard";
import { BrowsePagination } from "@/features/browse-home/components/BrowsePagination";
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
    location: `${listing.address.area}, ${listing.address.district}`,
    priceLabel: `BDT ${listing.monthlyRent.toLocaleString("en-US")}/mo`,
    beds: listing.beds,
    baths: listing.baths,
    sqft: listing.sizeSqft,
    reviewCount: 0,
    verified: listing.status === "live",
    imageSrc: listing.coverImageUrl || FALLBACK_IMAGE,
    slug: listing.slug,
  };
}

export function BrowseListingsSection() {
  const [listings, setListings] = useState<BrowseHouseListing[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (nextPage: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await browsePublicListings({
        page: nextPage,
        limit: 12,
        sortBy: "createdAt",
        sortOrder: "desc",
      });
      setListings((response.data || []).map(toBrowseCard));
      setTotal(response.pagination?.total || 0);
      setTotalPages(response.pagination?.totalPages || 1);
      setPage(response.pagination?.page || nextPage);
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
      void load(1);
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [load]);

  return (
    <section className="bg-surface py-8 sm:py-12 lg:py-[79px]" aria-labelledby="homes-found-heading">
      <Container>
        <div className="flex flex-col gap-8">
          <BrowseFilterBar />

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
                      Homes Found in Dhaka
                    </h2>
                    <p className="font-inter text-sm text-[#6b7280]">
                      {loading
                        ? "Loading properties…"
                        : `${total} properties match your criteria`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 font-inter text-sm">
                    <span className="text-[#6b7280]">Sort by:</span>
                    <span className="font-semibold text-brand-dark">Newest</span>
                  </div>
                </div>

                {error ? (
                  <p role="alert" className="font-inter text-sm font-medium text-red-600">
                    {error}
                  </p>
                ) : null}

                {!loading && !error && listings.length === 0 ? (
                  <p className="font-inter text-sm text-[#6b7280]">
                    No live listings yet. Approved owner listings will appear here.
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
                  page={page}
                  totalPages={totalPages}
                  onPageChange={(next) => void load(next)}
                />
              ) : (
                <BrowsePagination />
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
