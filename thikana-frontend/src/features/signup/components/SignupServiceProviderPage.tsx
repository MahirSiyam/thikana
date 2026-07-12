import Link from "next/link";
import { routes } from "@/config/routes";
import { SignupRoleStep } from "@/features/signup/components/SignupRoleStep";

function SignupWordmark({ className = "" }: { className?: string }) {
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

export function SignupServiceProviderPage() {
  return (
    <div className="relative flex min-h-dvh flex-col bg-surface">
      <div className="px-4 pt-4 sm:px-6 sm:pt-5 lg:px-8 lg:pt-4">
        <Link
          href={routes.home}
          className="inline-flex w-fit rounded-2xl bg-white/50 px-2.5 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
        >
          <SignupWordmark className="text-[28px] sm:text-[30px]" />
        </Link>
      </div>

      <section className="relative flex flex-1 flex-col items-center justify-center px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <SignupRoleStep initialRole="service-provider" />
      </section>
    </div>
  );
}
