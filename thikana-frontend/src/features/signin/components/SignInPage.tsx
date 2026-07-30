import Image from "next/image";
import { SiteLogoLink } from "@/components/layout/SiteLogoLink";
import { SignInForm } from "@/features/signin/components/SignInForm";

const socialLinks = [
  { label: "Facebook", iconSrc: "/images/home/social-facebook.svg" },
  { label: "Instagram", iconSrc: "/images/home/social-instagram.svg" },
  { label: "Twitter", iconSrc: "/images/home/social-twitter.svg" },
] as const;

export function SignInPage() {
  return (
    <div className="relative flex min-h-dvh flex-col bg-surface">
      <div className="px-4 pt-4 sm:px-6 sm:pt-5 lg:px-8 lg:pt-4">
        <SiteLogoLink />
      </div>

      <section className="relative flex flex-1 flex-col items-center justify-center px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="flex w-full max-w-md flex-col items-center justify-center gap-5 sm:gap-6">
          <SignInForm />

          <div className="flex flex-col items-center gap-3">
            <ul className="flex items-center gap-6">
              {socialLinks.map((item) => (
                <li key={item.label}>
                  <button
                    type="button"
                    aria-label={item.label}
                    className="inline-flex size-[38px] items-center justify-center rounded-full bg-brand-dark transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
                  >
                    <Image
                      src={item.iconSrc}
                      alt=""
                      width={18}
                      height={18}
                      aria-hidden="true"
                      className="size-[55%]"
                    />
                  </button>
                </li>
              ))}
            </ul>

            <p className="max-w-[371px] text-center font-inter text-sm text-black">
              By signing in you agree to our{" "}
              <button type="button" className="underline decoration-solid underline-offset-2">
                Terms
              </button>{" "}
              and{" "}
              <button type="button" className="underline decoration-solid underline-offset-2">
                Privacy Policy
              </button>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
