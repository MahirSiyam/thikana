import Image from "next/image";
import { StarRating } from "@/components/shared/StarRating";
import {
  homeDetailsProperty,
  homeDetailsRatingCategories,
  homeDetailsReviews,
} from "@/features/home-details/data/home-details.mock";

export function HomeDetailsReviews() {
  const { overallRating, maxRating, reviewCount } = homeDetailsProperty;

  return (
    <section className="w-full max-w-[822px]" aria-labelledby="guest-reviews-heading">
      <div className="space-y-2">
        <h2 id="guest-reviews-heading" className="font-inter text-2xl font-semibold text-[#16223a]">
          Guest Reviews
        </h2>
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <p className="font-jakarta text-[clamp(2rem,5vw,2.5rem)] font-bold text-brand-dark">
            {overallRating.toFixed(1)}
          </p>
          <p className="font-inter text-xl text-brand-dark/50">/ {maxRating.toFixed(1)}</p>
          <p className="font-inter text-sm text-brand-dark/50">{reviewCount} verified reviews</p>
        </div>
      </div>

      <ul className="mt-8 flex w-full flex-col gap-6">
        {homeDetailsRatingCategories.map((category) => (
          <li key={category.id} className="w-full space-y-2">
            <div className="flex items-start justify-between font-inter text-sm text-[#16223a]">
              <span>{category.label}</span>
              <span className="font-semibold">
                {Number.isInteger(category.score) ? category.score : category.score.toFixed(1)}
              </span>
            </div>
            <div className="h-1 w-full overflow-hidden rounded-[2px] bg-[#e8eaed]">
              <div
                className="h-full rounded-[2px] bg-brand-dark"
                style={{ width: `${(category.score / 5) * 100}%` }}
              />
            </div>
          </li>
        ))}
      </ul>

      <ul className="mt-8 grid gap-5 md:grid-cols-2">
        {homeDetailsReviews.map((review) => (
          <li key={review.id}>
            <article className="flex h-full flex-col gap-3 rounded-xl bg-white p-5 shadow-[0_1px_3px_rgba(22,34,58,0.06)]">
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="relative size-10 shrink-0 overflow-hidden rounded-[20px] bg-[#d9d9d9]">
                    <Image
                      src={review.avatarSrc}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="font-inter text-[15px] font-semibold text-[#16223a]">
                      {review.name}
                    </p>
                    <p className="font-inter text-[13px] text-brand-dark/50">{review.date}</p>
                  </div>
                </div>
                <StarRating rating={review.rating} size={12} className="shrink-0" />
              </div>
              <p className="font-inter text-sm leading-relaxed text-brand-dark/50">{review.quote}</p>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
