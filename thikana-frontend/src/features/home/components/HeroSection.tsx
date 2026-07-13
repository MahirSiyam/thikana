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
    <div className="flex w-full min-h-[3.25rem] flex-col justify-center rounded-card border border-white bg-[rgba(10,10,10,0.5)] px-2.5 py-2 backdrop-blur-sm sm:min-h-[4rem] sm:px-3.5 sm:py-2.5 md:min-h-[4.5rem] md:px-4 md:py-3 lg:aspect-[200/90] lg:min-h-[5.5rem] lg:px-5 lg:py-3.5 xl:min-h-[6rem] xl:px-6">
      <p className="font-anton whitespace-nowrap text-[clamp(0.8125rem,3.4cqw,1.375rem)] leading-none text-white sm:leading-[1.2] lg:leading-[1.5]">
        {value}
      </p>
      <p className="mt-0.5 font-inter whitespace-nowrap text-[clamp(0.5625rem,2cqw,1.0625rem)] font-medium leading-none text-brand-light-text sm:mt-1 lg:leading-[1.5]">
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
            <div className="overflow-hidden rounded-card-lg">
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
                {/* Raised on sm/md so cards clear the overlapping dark CTA */}
                <div className="absolute bottom-[30%] left-[2%] flex w-[clamp(7.25rem,28cqw,12.5rem)] flex-col gap-2 sm:bottom-[28%] sm:left-[3.5%] sm:gap-2.5 md:bottom-[26%] md:left-[5%] md:gap-3.5 lg:bottom-auto lg:left-[7%] lg:top-[52%] lg:w-[clamp(9rem,18cqw,12.5rem)] lg:gap-5 xl:left-[8%] xl:gap-6">
                  {heroStatsLeft.map((stat) => (
                    <div key={stat.label} className="pointer-events-auto w-full">
                      <HeroStatCard value={stat.value} label={stat.label} />
                    </div>
                  ))}
                </div>

                {/* Anchored to the right edge on sm/md */}
                <div className="absolute right-[2%] top-[12%] flex w-[clamp(7.25rem,28cqw,12.5rem)] flex-col gap-2 sm:right-[3.5%] sm:top-[14%] sm:gap-2.5 md:right-[5%] md:top-[16%] md:gap-3.5 lg:left-[69%] lg:right-auto lg:top-[15%] lg:w-[clamp(9rem,18cqw,12.5rem)] lg:gap-5 xl:left-[71%] xl:gap-6">
                  {heroStatsRight.map((stat) => (
                    <div key={stat.label} className="pointer-events-auto w-full">
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

          <div className="relative z-10 -mt-[clamp(1.75rem,14%,9rem)] rounded-card-lg bg-brand-dark px-4 py-5 sm:-mt-[clamp(2rem,14%,9rem)] sm:px-6 sm:py-8 md:px-8 lg:-mt-[clamp(3rem,19%,9rem)] lg:px-10 lg:py-12">
            <h1 className="font-anton text-[clamp(1.5rem,5.5vw,5rem)] leading-[1.1] text-white">
              Find a Verified Home.
            </h1>
            <p className="mt-2 pl-[31%] font-inter text-[clamp(1.125rem,4.2vw,3.75rem)] leading-[1.1] text-white sm:mt-3">
              Book Trusted Services.
            </p>
          </div>

          <div className="relative z-30 mx-auto -mt-5 w-full min-w-0 max-w-full sm:-mt-8 lg:-mt-10 lg:max-w-247.5">
            <HeroSearchBar />
          </div>
        </div>
      </Container>
    </section>
  );
}
