import Image from "next/image";
import Link from "next/link";
import { SignInForm } from "@/features/signin/components/SignInForm";
import { routes } from "@/config/routes";

const socialLinks = [
  { label: "Facebook", iconSrc: "/images/home/social-facebook.svg" },
  { label: "Instagram", iconSrc: "/images/home/social-instagram.svg" },
  { label: "Twitter", iconSrc: "/images/home/social-twitter.svg" },
] as const;

function SignInWordmark({ className = "" }: { className?: string }) {
  return (
    <p className={`font-outfit font-extrabold leading-[0.8] text-brand-dark ${className}`}>
      T
      <span className="font-instrument italic">h</span>
      i
      <span className="font-instrument italic">k</span>
      ana
    </p>
  );
}

export function SignInPage() {
  return (
    <div className="relative flex min-h-dvh flex-col bg-surface">
      <div className="px-4 pt-6 sm:px-8 sm:pt-8 lg:px-10 lg:pt-6">
        <Link
          href={routes.home}
          className="inline-flex w-fit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
        >
          <SignInWordmark className="text-[32px] sm:text-[40px]" />
        </Link>
      </div>

      <section className="relative flex flex-1 flex-col items-center justify-center px-4 py-10 sm:px-8 sm:py-12 lg:px-10">
        <div className="flex w-full max-w-md flex-col items-center justify-center gap-8 lg:gap-10">
          <SignInForm />

          <div className="flex flex-col items-center gap-5">
            <ul className="flex items-center gap-8">
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
