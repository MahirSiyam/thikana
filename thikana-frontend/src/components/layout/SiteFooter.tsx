import Image from "next/image";
import { Container } from "@/components/shared/Container";

const renterLinks = [
  "Browse Rentals",
  "Book a Service",
  "How It Works",
  "Pricing Guide",
];

const providerLinks = [
  "Join as Provider",
  "Dashboard Login",
  "Get Verified",
  "Provider Support",
];

export function SiteFooter() {
  return (
    <footer className="relative bg-black text-white">
      <div className="absolute inset-0 bg-black" aria-hidden="true" />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[url('/images/home/footer.png')] bg-cover bg-position-[center_42%] bg-no-repeat bg-fixed opacity-50 sm:bg-position-[center_40%] md:bg-center lg:bg-position-[center_45%] xl:bg-center"
      />

      <Container className="relative z-10 py-10 sm:py-12 lg:py-16">
        <div className="w-full max-w-[504px] text-left">
          <p className="font-jakarta text-[clamp(1.5rem,4vw,2.5rem)] leading-snug">
            <span className="block font-bold sm:inline">Settle In With Confidence</span>{" "}
            <span className="block sm:inline">Find A Verified Home.</span>
          </p>

          <div className="mt-4 flex w-full flex-row items-stretch md:mt-3 lg:mt-2">
            <label className="sr-only" htmlFor="footer-email">
              Find your dream house
            </label>
            <input
              id="footer-email"
              type="email"
              placeholder="Find your dream house"
              className="min-w-0 flex-1 border-2 border-r-0 border-white bg-transparent px-3 py-3.5 font-inter text-sm text-white placeholder:text-white/80 focus:outline-none rounded-l-(--nav-pill-radius) md:px-4 md:py-4 md:text-base lg:px-4 lg:py-5 lg:text-lg"
            />
            <button
              type="button"
              className="shrink-0 whitespace-nowrap rounded-r-(--nav-pill-radius) bg-white px-4 py-3.5 font-inter text-sm font-bold text-brand-dark transition-colors hover:bg-white/90 md:px-5 md:py-4 md:text-base lg:px-6 lg:py-5 lg:text-lg"
            >
              Subscribe
            </button>
          </div>
        </div>

        <div className="mt-10 grid gap-8 border-t border-white/20 pt-8 sm:mt-12 sm:gap-10 sm:pt-10 lg:grid-cols-[minmax(0,320px)_1fr] lg:items-start lg:gap-16">
          <div className="text-left">
            <p className="font-jakarta text-2xl font-bold tracking-tight">
              Thikana
            </p>
            <p className="mt-4 max-w-md font-inter text-base leading-relaxed text-white">
              Find Verified Homes. Book Trusted Services. Built for the modern Bangladesh.
            </p>
            <div className="mt-4 flex justify-start gap-5">
              <SocialIcon src="/images/home/icon-facebook.svg" label="Facebook" />
              <SocialIcon src="/images/home/icon-twitter.svg" label="Twitter" />
              <SocialIcon src="/images/home/icon-instagram.svg" label="Instagram" />
              <SocialIcon src="/images/home/icon-linkedin.svg" label="LinkedIn" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
            <FooterLinkGroup title="For Renters" links={renterLinks} />
            <FooterLinkGroup title="For Providers" links={providerLinks} />
            <div className="text-left sm:col-span-2 lg:col-span-1">
              <p className="font-inter text-base font-medium uppercase tracking-wide">
                Contact Us
              </p>
              <ul className="mt-4 space-y-2.5 font-inter text-sm text-white/70">
                <li>Dhanmondi, Dhaka 1205</li>
                <li>
                  <a href="tel:+8801700000000" className="transition-colors hover:text-white">
                    +880 1700-000000
                  </a>
                </li>
                <li>
                  <a href="mailto:hello@thikana.com" className="transition-colors hover:text-white">
                    hello@thikana.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}

function SocialIcon({ src, label }: { src: string; label: string }) {
  return (
    <a
      href="#"
      aria-label={label}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full transition-opacity hover:opacity-80"
    >
      <Image src={src} alt="" width={20} height={20} aria-hidden="true" />
    </a>
  );
}

function FooterLinkGroup({ title, links }: { title: string; links: string[] }) {
  return (
    <div className="text-left">
      <p className="font-inter text-base font-medium uppercase tracking-wide">
        {title}
      </p>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link}>
            <button
              type="button"
              className="font-inter text-sm text-white/70 transition-colors hover:text-white"
            >
              {link}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
