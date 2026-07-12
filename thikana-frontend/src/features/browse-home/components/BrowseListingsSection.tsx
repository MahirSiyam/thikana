import { BrowseFilterBar } from "@/features/browse-home/components/BrowseFilterBar";
import { BrowseFiltersSidebar } from "@/features/browse-home/components/BrowseFiltersSidebar";
import { BrowseListingCard } from "@/features/browse-home/components/BrowseListingCard";
import { BrowsePagination } from "@/features/browse-home/components/BrowsePagination";
import { browseHouseListings } from "@/features/browse-home/data/browse-home.mock";
import { Container } from "@/components/shared/Container";

export function BrowseListingsSection() {
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
                      120 properties matches your criteria
                    </p>
                  </div>
                  <div className="flex items-center gap-2 font-inter text-sm">
                    <span className="text-[#6b7280]">Sort by:</span>
                    <button type="button" className="font-semibold text-brand-dark">
                      Newest ▾
                    </button>
                  </div>
                </div>

                <ul className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {browseHouseListings.map((listing) => (
                    <li key={listing.id}>
                      <BrowseListingCard listing={listing} />
                    </li>
                  ))}
                </ul>
              </div>

              <BrowsePagination />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
