import Image from "next/image";
import { Container } from "@/components/shared/Container";
import { HeroSearchBar } from "@/features/home/components/HeroSearchBar";
import {
  heroStatsLeft,
  heroStatsRight,
} from "@/features/home/data/home.mock";

const HERO_IMAGE_WIDTH = 1448;
const HERO_IMAGE_HEIGHT = 1086;
const HERO_IMAGE_ASPECT = `${HERO_IMAGE_WIDTH}/${HERO_IMAGE_HEIGHT}`;

const heroSocialLinks = [
  { href: "#", iconSrc: "/images/home/social-facebook.svg", label: "Facebook" },
  { href: "#", iconSrc: "/images/home/social-instagram.svg", label: "Instagram" },
  { href: "#", iconSrc: "/images/home/social-twitter.svg", label: "Twitter" },
] as const;

export function ThikanaWordmark({ className = "" }: { className?: string }) {
  return (
    <p
      className={`font-outfit text-[clamp(2.75rem,15vw,13.75rem)] font-extrabold leading-[0.8] text-[#0e0e0e] ${className}`}
    >
      T
      <span className="font-instrument italic">h</span>
      i
      <span className="font-instrument italic">k</span>
      ana
    </p>
  );
}

function HeroStatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex w-full min-h-[3.25rem] flex-col justify-center rounded-(--radius-card) border border-white bg-[rgba(10,10,10,0.5)] px-2.5 py-2 backdrop-blur-sm sm:min-h-[4rem] sm:px-3.5 sm:py-[11px] md:px-4 lg:aspect-[180/80] lg:min-h-[5rem] lg:px-5">
      <p className="font-anton whitespace-nowrap text-sm leading-[1.2] text-white sm:text-base md:text-lg lg:text-xl lg:leading-[1.6]">
        {value}
      </p>
      <p className="font-inter whitespace-nowrap text-[clamp(0.5625rem,1.15cqw,1rem)] font-medium leading-none text-brand-light-text lg:leading-[1.6]">
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
      className="inline-flex aspect-square w-full items-center justify-center rounded-full bg-brand-dark shadow-[0_2px_8px_rgba(10,10,10,0.25)] transition-opacity hover:opacity-90"
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
    <section className="overflow-x-hidden bg-surface pb-10 pt-4 sm:pb-16 sm:pt-8 lg:pb-20 lg:pt-10">
      <Container className="min-w-0">
        <div className="@container relative mx-auto w-full min-w-0 max-w-[77.5rem]">
          <ThikanaWordmark className="relative z-30 -ml-1 mb-[-0.45em] w-full max-w-[92%] select-none text-[clamp(2.75rem,17.5cqw,13.75rem)] sm:-ml-2 sm:max-w-[88%] md:-ml-3 lg:-ml-4 lg:max-w-[65.625rem]" />

          <div className="relative min-w-0">
            <div className="overflow-hidden rounded-(--radius-card-lg)">
              <Image
                src="/images/home/hero-apartment-building.webp"
                alt="Modern apartment building illustration"
                width={HERO_IMAGE_WIDTH}
                height={HERO_IMAGE_HEIGHT}
                priority
                className="h-auto w-full"
                sizes="(max-width: 768px) 100vw, (max-width: 1240px) 90vw, 1240px"
              />
            </div>

            <div
              className="pointer-events-none absolute left-0 top-0 z-20 w-full"
              style={{ aspectRatio: HERO_IMAGE_ASPECT }}
            >
              <div className="absolute inset-0">
                <div className="absolute bottom-[22%] left-[4%] flex w-[clamp(4.25rem,16cqw,11.25rem)] flex-col gap-2 sm:left-[6%] sm:gap-3 lg:bottom-auto lg:left-[8%] lg:top-[53%] lg:gap-6">
                  {heroStatsLeft.map((stat) => (
                    <div key={stat.label} className="pointer-events-auto min-w-0">
                      <HeroStatCard value={stat.value} label={stat.label} />
                    </div>
                  ))}
                </div>

                <div className="absolute left-[62%] top-[21%] flex w-[clamp(4.25rem,16cqw,11.25rem)] flex-col gap-2 sm:left-[66%] sm:gap-3 md:left-[69%] lg:left-[71%] lg:gap-6">
                  {heroStatsRight.map((stat) => (
                    <div key={stat.label} className="pointer-events-auto min-w-0">
                      <HeroStatCard value={stat.value} label={stat.label} />
                    </div>
                  ))}
                </div>

                <div className="absolute right-0 top-[42%] flex w-[clamp(1.75rem,3.71cqw,2.875rem)] translate-x-0 flex-col gap-[clamp(0.375rem,2.58cqw,1.5rem)] sm:translate-x-1 lg:translate-x-2">
                  {heroSocialLinks.map((social) => (
                    <div key={social.label} className="pointer-events-auto">
                      <SocialLink href={social.href} iconSrc={social.iconSrc} label={social.label} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 -mt-[clamp(1.75rem,14%,9rem)] rounded-(--radius-card-lg) bg-brand-dark px-4 py-5 sm:-mt-[clamp(2rem,14%,9rem)] sm:px-6 sm:py-8 md:px-8 lg:-mt-[clamp(3rem,19%,9rem)] lg:px-10 lg:py-12">
            <h1 className="font-anton text-[clamp(1.5rem,5.5vw,5rem)] leading-[1.1] text-white">
              Find a Verified Home.
            </h1>
            <p className="mt-2 font-inter text-[clamp(1.125rem,4.2vw,3.75rem)] leading-[1.1] text-white sm:mt-3 sm:pl-[12%] md:pl-[20%] lg:pl-[31%]">
              Book Trusted Services.
            </p>
          </div>

          <div className="relative z-30 mx-auto -mt-5 w-full min-w-0 max-w-full sm:-mt-8 lg:-mt-10 lg:max-w-[61.875rem]">
            <HeroSearchBar />
          </div>
        </div>
      </Container>
    </section>
  );
}
