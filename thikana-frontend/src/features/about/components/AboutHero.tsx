import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/shared/Container";
import { routes } from "@/config/routes";
import { aboutFeatures, aboutHeroCopy } from "@/features/about/data/about.mock";

export function AboutHero() {
  return (
    <section className="bg-surface pt-6 pb-12 sm:pt-10 sm:pb-16 lg:pt-12 lg:pb-20" aria-labelledby="about-hero-heading">
      <Container>
        <div className="flex flex-col gap-6">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-1 font-inter text-sm font-medium text-brand-dark sm:text-base"
          >
            <Link href={routes.home} className="transition-opacity hover:opacity-70">
              Home
            </Link>
            <Image
              src="/images/browse-home/icon-breadcrumb-chevron.svg"
              alt=""
              width={15}
              height={15}
              aria-hidden="true"
              className="shrink-0"
            />
            <span className="underline">About</span>
          </nav>

          <div className="relative overflow-hidden rounded-[20px] bg-brand-dark px-6 py-12 sm:px-10 sm:py-16 lg:min-h-[723px] lg:px-[72px] lg:py-[126px]">
            <Image
              src="/images/about/hero-why-choose-bg.png"
              alt=""
              fill
              priority
              className="object-cover opacity-25"
              sizes="100vw"
              aria-hidden="true"
            />

            <div className="relative z-10 flex flex-col items-stretch gap-10 lg:flex-row lg:items-center lg:gap-12">
              <div className="flex w-full max-w-[549px] flex-col items-start gap-6">
                <div className="flex flex-col gap-4 text-[#e8eaed]">
                  <h1
                    id="about-hero-heading"
                    className="font-jakarta text-[clamp(1.75rem,4vw,2.5rem)] font-bold leading-tight"
                  >
                    {aboutHeroCopy.title}
                  </h1>
                  <p className="font-inter text-base leading-relaxed text-justify sm:text-lg lg:text-xl">
                    {aboutHeroCopy.description}
                  </p>
                </div>
                <Link
                  href={routes.browseHome}
                  className="inline-flex items-center justify-center rounded-full bg-white/10 px-4 py-5 font-inter text-base font-bold text-white underline decoration-white underline-offset-4 transition-opacity hover:opacity-80 sm:text-lg lg:text-xl"
                >
                  {aboutHeroCopy.ctaLabel}
                </Link>
              </div>

              <ul className="flex w-full max-w-[500px] flex-col gap-4 sm:gap-6 lg:ml-auto">
                {aboutFeatures.map((feature) => (
                  <li
                    key={feature.id}
                    className="flex min-h-[88px] items-center justify-between gap-4 rounded-2xl bg-white/20 px-5 py-5 sm:min-h-[100px] sm:px-6"
                  >
                    <p className="font-inter text-sm font-medium uppercase tracking-wide text-white sm:text-lg lg:text-2xl">
                      {feature.label}
                    </p>
                    <Image
                      src="/images/about/icon-feature-arrow.svg"
                      alt=""
                      width={36}
                      height={36}
                      aria-hidden="true"
                      className="size-9 shrink-0 -scale-y-100 sm:size-[48px] lg:size-[60px]"
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
