import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/shared/Container";
import { routes } from "@/config/routes";
import {
  contactBadges,
  contactHero,
  contactInfoCards,
} from "@/features/contact-us/data/contact-us.mock";

export function ContactHero() {
  return (
    <section
      className="bg-surface pt-6 pb-10 sm:pt-10 sm:pb-12 lg:pt-12 lg:pb-16"
      aria-labelledby="contact-hero-heading"
    >
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
            <span className="underline">Contact Us</span>
          </nav>

          <div className="flex flex-col gap-8 sm:gap-10 lg:gap-12">
            <div className="flex flex-col items-center gap-4 text-center sm:gap-6">
              <div className="flex max-w-[796px] flex-col items-center gap-4">
                <h1
                  id="contact-hero-heading"
                  className="max-w-[770px] font-inter text-[clamp(1.75rem,5vw,3.5rem)] font-bold leading-[1.1] text-brand-dark"
                >
                  {contactHero.title}
                </h1>
                <p className="font-inter text-base leading-[1.5] text-brand-dark/50 sm:text-lg">
                  {contactHero.subtitle}
                </p>
              </div>

              <ul className="flex flex-wrap items-center justify-center gap-3">
                {contactBadges.map((badge) => (
                  <li
                    key={badge.id}
                    className="inline-flex h-6 items-center rounded-full border border-brand-dark bg-white px-4 font-inter text-[13px] font-medium text-brand-dark"
                  >
                    {badge.label}
                  </li>
                ))}
              </ul>
            </div>

            <ul className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {contactInfoCards.map((card) => (
                <li
                  key={card.id}
                  className="flex min-h-[200px] flex-col items-center justify-center rounded-[20px] bg-white px-6 py-8 shadow-[4px_4px_2px_rgba(10,10,10,0.1)] sm:min-h-[226px]"
                >
                  <div className="flex w-full flex-col items-center gap-2 text-center">
                    <div className="inline-flex size-[50px] items-center justify-center rounded-lg bg-brand-dark">
                      <Image
                        src={card.iconSrc}
                        alt=""
                        width={20}
                        height={20}
                        aria-hidden="true"
                        className="size-5"
                      />
                    </div>
                    <div className="flex w-full flex-col gap-2">
                      <h2 className="font-inter text-xl font-bold text-brand-dark">{card.title}</h2>
                      {card.href ? (
                        <a
                          href={card.href}
                          className="font-inter text-[15px] font-bold text-brand-dark transition-opacity hover:opacity-70"
                        >
                          {card.primary}
                        </a>
                      ) : (
                        <p className="font-inter text-[15px] text-brand-dark">{card.primary}</p>
                      )}
                      <p
                        className={`font-inter text-[13px] ${
                          card.id === "call" ? "text-brand-dark" : "text-brand-dark/50"
                        }`}
                      >
                        {card.secondary}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
