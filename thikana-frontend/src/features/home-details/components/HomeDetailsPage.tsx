import { Container } from "@/components/shared/Container";
import { BrowseHelpCta } from "@/features/browse-home/components/BrowseHelpCta";
import { HomeDetailsAbout } from "@/features/home-details/components/HomeDetailsAbout";
import { HomeDetailsBookingCard } from "@/features/home-details/components/HomeDetailsBookingCard";
import { HomeDetailsBreadcrumb } from "@/features/home-details/components/HomeDetailsBreadcrumb";
import { HomeDetailsFacilities } from "@/features/home-details/components/HomeDetailsFacilities";
import { HomeDetailsGallery } from "@/features/home-details/components/HomeDetailsGallery";
import { HomeDetailsLocation } from "@/features/home-details/components/HomeDetailsLocation";
import { HomeDetailsReviews } from "@/features/home-details/components/HomeDetailsReviews";
import { HomeDetailsSimilarListings } from "@/features/home-details/components/HomeDetailsSimilarListings";

export function HomeDetailsPage() {
  return (
    <>
      <HomeDetailsBreadcrumb />

      <section className="bg-surface pb-12 pt-8 sm:pb-16 sm:pt-10 lg:pb-20">
        <Container>
          <div className="flex flex-col gap-8 lg:gap-12">
            <div className="flex w-full flex-col gap-5 lg:flex-row lg:items-start lg:gap-5">
              <HomeDetailsGallery />
              <HomeDetailsBookingCard />
            </div>

            <div className="flex flex-col gap-8 lg:gap-12">
              <HomeDetailsAbout />
              <HomeDetailsFacilities />
              <HomeDetailsLocation />
              <HomeDetailsReviews />
            </div>
          </div>
        </Container>
      </section>

      <HomeDetailsSimilarListings />
      <BrowseHelpCta />
    </>
  );
}
