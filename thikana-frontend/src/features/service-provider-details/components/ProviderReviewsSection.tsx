import Image from "next/image";
import { Container } from "@/components/shared/Container";
import { StarRating } from "@/components/shared/StarRating";
import {
  providerDetails,
  providerReviews,
  ratingBreakdown,
} from "@/features/service-provider-details/data/service-provider-details.mock";

export function ProviderReviewsSection() {
  return (
    <section className="bg-surface py-12 sm:py-16 lg:py-20" aria-labelledby="reviews-heading">
      <Container>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <h2 id="reviews-heading" className="font-inter text-[clamp(1.5rem,3vw,2rem)] font-bold text-brand-dark">
              What Customers Say
            </h2>
            <div className="flex flex-wrap items-center gap-2 font-inter text-base">
              <p className="font-bold text-brand-dark">★ {providerDetails.rating.toFixed(1)} overall</p>
              <span className="hidden h-4 w-px bg-[#e5e5e2] sm:block" aria-hidden="true" />
              <p className="text-brand-dark/80">{providerDetails.reviewCount} reviews</p>
            </div>
          </div>

          <ul className="flex w-full max-w-[280px] flex-col gap-1.5">
            {ratingBreakdown.map((item) => (
              <li key={item.stars} className="flex items-center gap-3">
                <span className="w-8 font-inter text-[13px] text-brand-dark/80">{item.stars}★</span>
                <div className="h-1.5 w-40 overflow-hidden rounded-[3px] bg-[#e8eaed]">
                  <div
                    className="h-full bg-brand-dark"
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
                <span className="font-inter text-[13px] text-brand-dark/80">{item.percent}%</span>
              </li>
            ))}
          </ul>
        </div>

        <ul className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {providerReviews.map((review) => (
            <li key={review.id}>
              <article className="flex h-full flex-col gap-4 rounded-xl bg-white p-6 shadow-[0_8px_24px_rgba(22,34,58,0.04)]">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="relative size-8 shrink-0 overflow-hidden rounded-full bg-[#d9d9d9]">
                      <Image
                        src={review.avatarSrc}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="32px"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="font-inter text-[15px] font-semibold text-brand-dark">
                        {review.name}
                      </p>
                      <p className="font-inter text-[13px] text-brand-dark/80">· {review.location}</p>
                    </div>
                  </div>
                  <p className="shrink-0 font-inter text-xs text-brand-dark/80">{review.dateLabel}</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <StarRating rating={review.rating} size={13} />
                  <span className="rounded border border-[#e8eaed] bg-[#f8f9fb] px-2 py-1 font-inter text-[11px] font-semibold text-brand-dark/80">
                    {review.serviceTag}
                  </span>
                </div>

                <p className="flex-1 font-inter text-[15px] leading-relaxed text-brand-dark/80">
                  {review.quote}
                </p>

                <p className="font-inter text-[13px] text-brand-dark/80 opacity-60">
                  Helpful 👍 {review.helpfulCount}
                </p>
              </article>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
