import Image from "next/image";
import { Container } from "@/components/shared/Container";
import { HeroSearchBar } from "@/features/home/components/HeroSearchBar";
import {
  heroStatsLeft,
  heroStatsRight,
} from "@/features/home/data/home.mock";

const heroSocialLinks = [
  { href: "#", iconSrc: "/images/home/social-facebook.svg", label: "Facebook" },
  { href: "#", iconSrc: "/images/home/social-instagram.svg", label: "Instagram" },
  { href: "#", iconSrc: "/images/home/social-twitter.svg", label: "Twitter" },
] as const;

function HeroStatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex h-[clamp(3.25rem,10.25cqw,5rem)] w-full flex-col justify-center rounded-2xl border border-white bg-[rgba(10,10,10,0.5)] px-[clamp(0.65rem,1.85cqw,1.125rem)] py-[clamp(0.45rem,1.4cqw,0.7rem)] backdrop-blur-[2px]">
      <p className="whitespace-nowrap font-anton text-[clamp(0.8125rem,1.6cqw,1.25rem)] leading-[1.3] text-white">
        {value}
      </p>
      <p className="whitespace-nowrap font-inter text-[clamp(0.625rem,1.3cqw,1rem)] font-medium leading-[1.35] text-[#e8eaed]">
        {label}
      </p>
    </div>
  );
}

function SocialLink({
  href,
  iconSrc,
  label,
}: {
  href: string;
  iconSrc: string;
  label: string;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      className="inline-flex aspect-square w-full items-center justify-center rounded-full bg-brand-dark shadow-[0_2px_8px_rgba(10,10,10,0.25)] transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
    >
      <Image
        src={iconSrc}
        alt=""
        width={24}
        height={24}
        aria-hidden="true"
        className="size-[58%]"
      />
    </a>
  );
}

export function HeroSection() {
  return (
    <section className="relative z-20 bg-surface pb-8 pt-5 sm:pb-12 sm:pt-7 lg:pb-16 lg:pt-10">
      <Container className="min-w-0 px-3! sm:px-4! lg:px-3! xl:px-5! 2xl:px-6!">
        <div className="@container relative mx-auto w-full min-w-0 max-w-350">
          <header className="relative z-30">
            <h1 className="whitespace-nowrap font-anton text-[clamp(2.25rem,9.7cqw,7.5rem)] leading-[1.1] text-[#0e0e0e]">
              Find a Verified Homes.
            </h1>
            <p className="mt-[-0.15em] text-right font-inter text-[clamp(1.125rem,4.85cqw,3.75rem)] font-medium leading-[1.1] text-[#0a0a0a] sm:pr-[2%]">
              Book Trusted Services.
            </p>
          </header>

          {/* Figma Hero Section 108:207 — image + black base + search */}
          <div className="relative z-10 mt-[-2%] min-w-0 pb-[clamp(1.25rem,3.5cqw,2.75rem)] sm:mt-[-3%] lg:mt-[-5%]">
            <div className="relative aspect-41/29 w-full">
              {/* Black base under image bottom (Figma: 1240×230 @ top 76.15% of image) */}
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-[76.15%] z-0 h-[29.5%] rounded-2xl bg-black sm:rounded-[20px]"
              />

              <div className="relative z-10 size-full overflow-hidden rounded-2xl sm:rounded-[20px]">
                <Image
                  src="/images/home/hero-apartment-building.webp"
                  alt="Verified modern apartment home"
                  fill
                  priority
                  className="scale-[1.08] object-contain object-center"
                  sizes="(max-width: 768px) 100vw, (max-width: 1240px) 90vw, 1240px"
                />
              </div>

              <div className="pointer-events-none absolute inset-0 z-20">
                <div className="absolute bottom-[18%] left-[10%] flex w-[clamp(6.5rem,14.5cqw,11.25rem)] flex-col gap-[clamp(0.35rem,0.8cqw,0.625rem)]">
                  {heroStatsLeft.map((stat) => (
                    <div key={stat.label} className="pointer-events-auto">
                      <HeroStatCard value={stat.value} label={stat.label} />
                    </div>
                  ))}
                </div>

                <div className="absolute right-[10%] top-[32%] flex w-[clamp(6.5rem,14.5cqw,11.25rem)] flex-col gap-[clamp(0.35rem,0.8cqw,0.625rem)]">
                  {heroStatsRight.map((stat) => (
                    <div key={stat.label} className="pointer-events-auto">
                      <HeroStatCard value={stat.value} label={stat.label} />
                    </div>
                  ))}
                </div>

                <div className="absolute right-[1.2%] top-[27%] flex w-[clamp(1.5rem,3.7cqw,2.875rem)] flex-col gap-[clamp(0.5rem,1.9cqw,1.5rem)]">
                  {heroSocialLinks.map((social) => (
                    <div key={social.label} className="pointer-events-auto">
                      <SocialLink
                        href={social.href}
                        iconSrc={social.iconSrc}
                        label={social.label}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Search overlaps image/black — Figma width 990/1240 */}
            <div className="relative z-30 mx-auto mt-[-4.1%] w-[94%] max-w-247.5 sm:w-[88%] lg:w-[79.84%]">
              <HeroSearchBar />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
