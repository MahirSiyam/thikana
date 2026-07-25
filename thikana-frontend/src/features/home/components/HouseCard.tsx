import Image from "next/image";
import Link from "next/link";
import { StarRating } from "@/components/shared/StarRating";
import type { VerifiedHouse } from "@/features/home/types/home.types";

type HouseCardProps = {
  house: VerifiedHouse;
};

export function HouseCard({ house }: HouseCardProps) {
  return (
    <article className="flex w-full flex-col">
      <div className="relative aspect-[403/268] w-full overflow-hidden rounded-t-(--radius-card)">
        <Link href={house.href} className="absolute inset-0">
          <Image
            src={house.imageSrc}
            alt={house.title}
            fill
            className="object-cover"
            sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
          />
          <span className="sr-only">View {house.title}</span>
        </Link>
        <button
          type="button"
          aria-label="Save listing"
          className="absolute right-[18px] top-[18px] z-10 inline-flex h-8 w-[29px] items-center justify-center"
        >
          <Image
            src="/images/home/icon-heart.svg"
            alt=""
            width={20}
            height={18}
            aria-hidden="true"
          />
        </button>
        <div className="pointer-events-none absolute bottom-[14px] left-[9px] rounded-(--radius-card) bg-brand-dark/20 p-2.5 backdrop-blur-sm">
          <p className="font-inter text-lg font-bold text-white">
            {house.price}
            <span className="ml-1 text-base font-normal">{house.priceSuffix}</span>
          </p>
        </div>
      </div>

      <div className="flex min-h-[152px] flex-col justify-between rounded-b-(--radius-card) bg-brand-dark px-3 pb-7 pt-6">
        <div className="space-y-2">
          <div className="flex items-center gap-1">
            <Image
              src="/images/home/icon-bed.svg"
              alt=""
              width={20}
              height={20}
              aria-hidden="true"
            />
            <p className="font-inter text-base text-white">{house.title}</p>
          </div>
          <div className="flex items-center gap-1">
            <Image
              src="/images/home/icon-map-pin.svg"
              alt=""
              width={20}
              height={20}
              aria-hidden="true"
            />
            <p className="font-inter text-base text-white">{house.location}</p>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between gap-3">
          <Link
            href={house.href}
            className="font-inter text-base font-medium text-white underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          >
            View Details
          </Link>
          <div className="flex items-center gap-1">
            {house.reviewCount > 0 ? (
              <>
                <StarRating rating={house.rating} />
                <span className="font-inter text-[13px] text-white">
                  ({house.reviewCount})
                </span>
              </>
            ) : (
              <span className="font-inter text-[13px] text-white/80">
                {house.views.toLocaleString("en-US")} views
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
