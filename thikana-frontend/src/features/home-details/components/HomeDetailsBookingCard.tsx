import Image from "next/image";
import { homeDetailsProperty } from "@/features/home-details/data/home-details.mock";

export function HomeDetailsBookingCard() {
  const { title, location, beds, baths, sqft, owner } = homeDetailsProperty;

  return (
    <aside className="w-full min-w-0 rounded-[10px] bg-white p-6 shadow-[0_8px_24px_rgba(10,10,10,0.1)] lg:sticky lg:top-28 lg:flex-1 lg:p-8">
      <div className="flex flex-col gap-6">
        <div className="space-y-2">
          <h2 className="font-inter text-[clamp(1.375rem,2.5vw,1.75rem)] font-bold leading-normal text-brand-dark">
            {title}
          </h2>
          <div className="flex items-center gap-1">
            <Image
              src="/images/browse-home/icon-map-pin-muted.svg"
              alt=""
              width={14}
              height={14}
              aria-hidden="true"
            />
            <p className="font-inter text-sm text-brand-dark/50">{location}</p>
          </div>
        </div>

        <p className="font-inter leading-none text-brand-dark">
          <span className="text-[clamp(1.75rem,3vw,2.25rem)] font-bold">BDT 12,000 </span>
          <span className="text-base font-normal text-brand-dark/50">/month</span>
        </p>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Image
              src="/images/browse-home/icon-bed-muted.svg"
              alt=""
              width={18}
              height={18}
              aria-hidden="true"
            />
            <span className="font-inter text-sm font-medium text-brand-dark">{beds} Beds</span>
          </div>
          <span className="hidden h-5 w-px bg-[#e5e5e2] sm:block" aria-hidden="true" />
          <div className="flex items-center gap-2">
            <Image
              src="/images/browse-home/icon-bath.svg"
              alt=""
              width={18}
              height={18}
              aria-hidden="true"
            />
            <span className="font-inter text-sm font-medium text-brand-dark">{baths} Bath</span>
          </div>
          <span className="hidden h-5 w-px bg-[#e5e5e2] sm:block" aria-hidden="true" />
          <div className="flex items-center gap-2">
            <Image
              src="/images/browse-home/icon-maximize.svg"
              alt=""
              width={18}
              height={18}
              aria-hidden="true"
            />
            <span className="font-inter text-sm font-medium text-brand-dark">{sqft} sqft</span>
          </div>
        </div>

        <div className="h-px w-full bg-[#e5e5e2]" aria-hidden="true" />

        <div className="flex items-center gap-4">
          <div className="relative size-12 shrink-0 overflow-hidden rounded-full bg-[#d9d9d9]">
            <Image src={owner.avatarSrc} alt="" fill className="object-cover" sizes="48px" />
          </div>
          <div>
            <p className="font-inter text-[15px] font-bold text-brand-dark">{owner.name}</p>
            <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 font-inter text-xs">
              <span className="font-semibold text-[#059669]">{owner.status}</span>
              <span className="text-[#9ca3af]">{owner.memberSince}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            className="inline-flex h-[52px] w-full items-center justify-center rounded-xl bg-brand-dark font-inter text-[15px] font-semibold text-white transition-colors hover:bg-brand-dark/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
          >
            Send Booking Request
          </button>
          <button
            type="button"
            className="inline-flex h-[52px] w-full items-center justify-center rounded-xl border border-brand-dark font-inter text-[15px] font-semibold text-brand-dark transition-colors hover:bg-brand-dark/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
          >
            Message Owner
          </button>
        </div>
      </div>
    </aside>
  );
}
