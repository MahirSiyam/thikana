import Link from "next/link";
import { AdminSignInForm } from "@/features/signin/components/AdminSignInForm";
import { routes } from "@/config/routes";

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

export function AdminSignInPage() {
  return (
    <div className="relative flex min-h-dvh flex-col bg-surface">
      <div className="px-4 pt-4 sm:px-6 sm:pt-5 lg:px-8 lg:pt-4">
        <Link
          href={routes.home}
          className="inline-flex w-fit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
        >
          <SignInWordmark className="text-[32px] sm:text-[40px]" />
        </Link>
      </div>

      <section className="relative flex flex-1 flex-col items-center justify-center px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="flex w-full max-w-md flex-col items-center justify-center gap-5 sm:gap-6">
          <AdminSignInForm />
        </div>
      </section>
    </div>
  );
}
