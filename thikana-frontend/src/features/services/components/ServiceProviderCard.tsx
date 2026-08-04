import Image from "next/image";
import Link from "next/link";
import { StarRating } from "@/components/shared/StarRating";
import { routes } from "@/config/routes";
import {
  formatProviderPriceLabel,
  providerCardTags,
} from "@/features/services/lib/provider-display";
import type { PublicProvider } from "@/lib/api/provider";

type ServiceProviderCardProps = {
  provider: PublicProvider;
};

export function ServiceProviderCard({ provider }: ServiceProviderCardProps) {
  const tags = providerCardTags(provider);
  const priceLabel = formatProviderPriceLabel(provider);
  const rating = provider.averageRating || 0;

  return (
    <article className="flex w-full flex-col overflow-hidden rounded-xl bg-white shadow-[0_1px_3px_rgba(22,34,58,0.06)]">
      <div className="relative h-52 w-full shrink-0 bg-[#f0f0ed] sm:h-56">
        {provider.avatarUrl ? (
          <Image
            src={provider.avatarUrl}
            alt={provider.name}
            fill
            className="object-cover"
            sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 300px"
          />
        ) : (
          <div className="flex size-full items-center justify-center font-outfit text-4xl font-bold text-brand-dark/30">
            {provider.name.slice(0, 1).toUpperCase()}
          </div>
        )}
        <div className="absolute left-3 top-3">
          <span className="inline-flex rounded-full bg-white px-2.5 py-1.5 font-inter text-[11px] font-bold text-[#1faa59]">
            Verified ✓
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3 p-4">
        <div className="space-y-1">
          <h3 className="font-jakarta text-base font-bold text-brand-dark">
            {provider.name}
          </h3>
          <div className="flex flex-wrap items-center gap-1">
            <StarRating rating={Math.round(rating)} size={14} />
            <p className="font-inter text-[13px] font-medium text-brand-dark/50">
              {rating.toFixed(1)} ({provider.totalReviews} reviews)
            </p>
          </div>
          {provider.location ? (
            <p className="font-inter text-xs text-brand-dark/45">
              {provider.location}
            </p>
          ) : null}
        </div>

        {tags.length ? (
          <ul className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <li
                key={tag}
                className="rounded-md border border-[#e8eaed] px-2 py-1 font-inter text-[11px] font-medium text-brand-dark/50"
              >
                {tag}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="h-px w-full bg-[#e5e5e2]" aria-hidden="true" />

        <div className="flex items-center justify-between gap-3">
          <p className="font-inter text-sm font-semibold text-brand-dark">
            {priceLabel}
          </p>
          <Link
            href={routes.serviceProviderDetails(provider.id)}
            className="inline-flex shrink-0 items-center rounded-full bg-brand-dark px-3.5 py-2 font-inter text-[13px] font-semibold text-white transition-colors hover:bg-brand-dark/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
          >
            See Profile
          </Link>
        </div>
      </div>
    </article>
  );
}
