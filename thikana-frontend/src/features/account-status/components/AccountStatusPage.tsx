"use client";

import Link from "next/link";
import { routes } from "@/config/routes";
import { useAuth } from "@/lib/auth/AuthProvider";

type AccountStatusPageProps = {
  title: string;
  description: string;
  tone?: "neutral" | "warning" | "danger" | "success";
  primaryHref?: string;
  primaryLabel?: string;
};

const toneClasses = {
  neutral: "border-brand-dark/20",
  warning: "border-amber-300",
  danger: "border-red-300",
  success: "border-emerald-300",
};

export function AccountStatusPage({
  title,
  description,
  tone = "neutral",
  primaryHref = routes.signIn,
  primaryLabel = "Back to Sign In",
}: AccountStatusPageProps) {
  const { profile } = useAuth();

  return (
    <div className="relative flex min-h-dvh flex-col bg-surface">
      <div className="px-4 pt-4 sm:px-6 sm:pt-5 lg:px-8 lg:pt-4">
        <Link
          href={routes.home}
          className="inline-flex w-fit rounded-2xl bg-white/50 px-2.5 py-2 font-outfit text-[28px] font-extrabold leading-[0.8] text-brand-dark sm:text-[30px]"
        >
          T<span className="font-instrument italic">h</span>i
          <span className="font-instrument italic">k</span>ana
        </Link>
      </div>

      <section className="relative flex flex-1 flex-col items-center justify-center px-4 py-6 sm:px-6 sm:py-8">
        <div
          className={`w-full max-w-[520px] rounded-xl border bg-white px-5 py-6 shadow-[4px_4px_5px_rgba(10,10,10,0.08)] sm:px-7 sm:py-8 ${toneClasses[tone]}`}
        >
          <h1 className="font-jakarta text-[clamp(1.5rem,4vw,1.875rem)] font-extrabold tracking-tight text-brand-dark">
            {title}
          </h1>
          <p className="mt-2 font-inter text-sm leading-relaxed text-brand-dark/70">
            {description}
          </p>

          {profile ? (
            <dl className="mt-5 space-y-2 rounded-lg bg-surface px-4 py-3 font-inter text-sm text-brand-dark">
              <div className="flex justify-between gap-3">
                <dt className="text-brand-dark/50">Email</dt>
                <dd className="font-medium">{profile.email}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-brand-dark/50">Email verified</dt>
                <dd className="font-medium">{profile.emailVerified ? "Yes" : "No"}</dd>
              </div>
              {profile.role ? (
                <div className="flex justify-between gap-3">
                  <dt className="text-brand-dark/50">Role</dt>
                  <dd className="font-medium capitalize">
                    {profile.role.replace("_", " ")}
                  </dd>
                </div>
              ) : null}
            </dl>
          ) : null}

          <div className="mt-6 flex flex-col gap-2">
            <Link
              href={primaryHref}
              className="inline-flex h-11 items-center justify-center rounded-lg bg-brand-dark font-inter text-base font-bold text-white transition-colors hover:bg-brand-dark/90"
            >
              {primaryLabel}
            </Link>
            <Link
              href={routes.home}
              className="inline-flex h-11 items-center justify-center rounded-lg border border-brand-dark/20 font-inter text-sm font-semibold text-brand-dark transition-colors hover:bg-brand-dark/5"
            >
              Go to Home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
