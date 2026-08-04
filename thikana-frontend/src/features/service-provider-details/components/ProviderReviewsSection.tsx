import { Container } from "@/components/shared/Container";

type ProviderReviewsSectionProps = {
  averageRating: number;
  totalReviews: number;
};

export function ProviderReviewsSection({
  averageRating,
  totalReviews,
}: ProviderReviewsSectionProps) {
  return (
    <section
      className="bg-surface py-12 sm:py-16 lg:py-20"
      aria-labelledby="reviews-heading"
    >
      <Container>
        <div className="space-y-2">
          <h2
            id="reviews-heading"
            className="font-inter text-[clamp(1.5rem,3vw,2rem)] font-bold text-brand-dark"
          >
            What Customers Say
          </h2>
          <div className="flex flex-wrap items-center gap-2 font-inter text-base">
            <p className="font-bold text-brand-dark">
              ★ {averageRating.toFixed(1)} overall
            </p>
            <span
              className="hidden h-4 w-px bg-[#e5e5e2] sm:block"
              aria-hidden="true"
            />
            <p className="text-brand-dark/80">{totalReviews} reviews</p>
          </div>
        </div>

        <p className="mt-6 rounded-xl border border-dashed border-[#e8eaed] bg-white p-8 font-inter text-sm text-brand-dark/60">
          {totalReviews
            ? "Detailed public review feed is coming soon. Ratings above are live from completed jobs."
            : "No reviews yet. Be the first to book and rate this provider."}
        </p>
      </Container>
    </section>
  );
}
