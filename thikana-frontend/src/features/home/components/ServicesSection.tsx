import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/shared/Container";
import { routes } from "@/config/routes";
import { homeServices } from "@/features/home/data/home.mock";

export function ServicesSection() {
  return (
    <section className="mb-10 bg-section-services py-16 sm:mb-14 sm:py-20 lg:mb-20">
      <Container>
        <div className="mx-auto max-w-(--container-max) text-center">
          <h2 className="font-jakarta text-[clamp(1.75rem,4vw,2.5rem)] font-bold leading-snug text-brand-dark">
            Everything You Need After Finding A Home
          </h2>
          <p className="mx-auto mt-4 max-w-[978px] font-inter text-lg leading-relaxed text-brand-dark sm:text-xl">
            Moving into a new home comes with a long checklist. Thikana helps you book verified
            professionals for repairs, cleaning, moving, installation and everyday home support.
          </p>
        </div>

        <div className="mx-auto mt-10 grid w-full max-w-[1102px] grid-cols-2 gap-4 rounded-(--radius-card-lg) bg-white p-5 md:grid-cols-3 md:gap-6 lg:grid-cols-4 lg:gap-10">
          {homeServices.map((service) => (
            <div
              key={service.id}
              className="flex h-[180px] min-w-0 flex-col items-center justify-center gap-4 rounded-(--radius-card) border border-white/70 bg-section-services/45 px-3 py-5 shadow-[0_8px_32px_rgba(10,10,10,0.06)] backdrop-blur-md sm:px-4"
            >
              <Image
                src={service.iconSrc}
                alt=""
                width={60}
                height={60}
                aria-hidden="true"
                className="h-[60px] w-[60px] shrink-0 object-contain"
              />
              <button
                type="button"
                className="inline-flex h-[49px] w-full max-w-[170px] shrink-0 items-center justify-center rounded-(--nav-pill-radius) border border-section-services px-3 font-inter text-base font-bold leading-none whitespace-nowrap text-brand-dark sm:px-4 sm:text-lg"
              >
                {service.label}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href={routes.services}
            className="inline-flex h-16 items-center justify-center rounded-(--nav-pill-radius) bg-brand-dark px-4 text-xl font-bold text-white transition-colors hover:bg-brand-dark/90"
          >
            View All Services
          </Link>
        </div>
      </Container>
    </section>
  );
}
