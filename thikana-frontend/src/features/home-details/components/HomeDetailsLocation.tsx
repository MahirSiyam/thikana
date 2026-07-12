import Image from "next/image";
import { homeDetailsProperty } from "@/features/home-details/data/home-details.mock";

const socialLinks = [
  { label: "Facebook", iconSrc: "/images/home/social-facebook.svg" },
  { label: "Instagram", iconSrc: "/images/home/social-instagram.svg" },
  { label: "Twitter", iconSrc: "/images/home/social-twitter.svg" },
] as const;

export function HomeDetailsLocation() {
  return (
    <section className="w-full" aria-labelledby="location-heading">
      <div className="flex w-full items-start gap-4 lg:gap-6">
        <div className="min-w-0 flex-1">
          <h2 id="location-heading" className="font-inter text-2xl font-semibold text-[#16223a]">
            Location
          </h2>
          <div className="relative mt-6 aspect-[1086/260] w-full overflow-hidden rounded-xl bg-[#dbeafe] shadow-[0_1px_3px_rgba(22,34,58,0.06)]">
            <Image
              src="/images/home-details/location-map.png"
              alt="Map showing property location"
              fill
              className="object-cover"
              sizes="(max-width: 1023px) 100vw, 100vw"
            />
          </div>
          <div className="mt-6 flex flex-col gap-2 font-inter sm:flex-row sm:items-start sm:justify-between">
            <p className="text-[15px] font-bold text-[#16223a]">{homeDetailsProperty.mapLabel}</p>
            <p className="text-sm text-[#5b6b82]">{homeDetailsProperty.mapDistance}</p>
          </div>
        </div>

        <ul className="hidden shrink-0 flex-col gap-8 pt-14 lg:flex">
          {socialLinks.map((item) => (
            <li key={item.label}>
              <button
                type="button"
                aria-label={item.label}
                className="inline-flex size-10 items-center justify-center rounded-full bg-brand-dark transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
              >
                <Image
                  src={item.iconSrc}
                  alt=""
                  width={18}
                  height={18}
                  aria-hidden="true"
                  className="size-[45%]"
                />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
