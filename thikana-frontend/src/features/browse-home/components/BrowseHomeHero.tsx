import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/shared/Container";
import { routes } from "@/config/routes";

export function BrowseHomeHero() {
  return (
    <section className="bg-surface pt-6 sm:pt-10 lg:pt-12" aria-labelledby="browse-home-heading">
      <Container>
        <div className="flex flex-col gap-6">
          <div className="space-y-2">
            <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 font-inter text-sm font-medium text-brand-dark sm:text-base">
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
              <Link href={routes.browseHome} className="transition-opacity hover:opacity-70">
                Browse Houses
              </Link>
              <Image
                src="/images/browse-home/icon-breadcrumb-chevron.svg"
                alt=""
                width={15}
                height={15}
                aria-hidden="true"
                className="shrink-0"
              />
              <span className="underline">Dhaka</span>
            </nav>
            <h1
              id="browse-home-heading"
              className="font-jakarta text-[clamp(1.5rem,4vw,2rem)] font-extrabold text-brand-dark"
            >
              DHAKA DIVISION
            </h1>
          </div>

          <div className="relative overflow-hidden rounded-2xl">
            <Image
              src="/images/browse-home/hero-dhaka-cityscape.png"
              alt="Dhaka city skyline"
              width={2480}
              height={930}
              priority
              className="h-auto w-full object-cover object-center max-lg:aspect-[16/9] max-lg:max-h-[320px] lg:max-h-none lg:aspect-auto"
              sizes="(max-width: 1023px) 100vw, 1240px"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center bg-gradient-to-t from-black/35 to-transparent px-4 pb-5 pt-16 sm:px-8 sm:pb-7 lg:px-[10%] lg:pb-8">
              <div className="pointer-events-auto w-full rounded-2xl bg-[rgba(10,10,10,0.5)] px-4 py-2.5 text-center sm:px-5">
                <p className="font-jakarta text-[clamp(1rem,3.5vw,2.5rem)] font-bold leading-[1.4] text-white sm:leading-[1.6]">
                  Find A Verified Home Settle In With Confidence
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
