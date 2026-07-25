"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useState, type FormEvent } from "react";
import { routes } from "@/config/routes";
import { SignupStepper } from "@/features/signup/components/SignupStepper";
import { useSignupWizard } from "@/features/signup/context/SignupWizardProvider";
import {
  tenantDetailsCopy,
  tenantLookingAsOptions,
} from "@/features/signup/data/signup.mock";
import type { TenantLookingAsId } from "@/features/signup/types/signup.types";
import { registerAccount } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { useAuth } from "@/lib/auth/AuthProvider";

export function TenantDetailsForm() {
  const router = useRouter();
  const formId = useId();
  const { setProfileData, buildRegistrationPayload, clear } = useSignupWizard();
  const { refreshProfile } = useAuth();
  const [lookingAs, setLookingAs] = useState<TenantLookingAsId>("family");
  const [location, setLocation] = useState("");
  const [budget, setBudget] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const profileData = {
        lookingAs,
        preferredLocation: location.trim() || undefined,
        budgetRange: budget.trim() || undefined,
      };
      setProfileData(profileData);
      const payload = buildRegistrationPayload();
      payload.profileData = profileData;
      await registerAccount(payload);
      clear();
      await refreshProfile().catch(() => null);
      router.replace(routes.pendingApproval);
    } catch (err) {
      setError(
        err instanceof ApiError || err instanceof Error
          ? err.message
          : "Could not complete registration"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex w-full max-w-[505px] flex-col items-center gap-3">
      <SignupStepper activeStepId="details" />

      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col gap-4 rounded-[10px] border border-brand-dark/50 bg-white p-4 shadow-[0px_10px_10px_rgba(0,0,0,0.03),0px_1px_1px_rgba(0,0,0,0.02)] sm:gap-5 sm:p-6"
        noValidate
      >
        <button
          type="button"
          onClick={() => router.push(routes.signUpTenantVerifyIdentity)}
          className="self-start font-inter text-sm font-semibold text-brand-dark/50 transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
        >
          {tenantDetailsCopy.backLabel}
        </button>

        <header className="flex flex-col gap-1 text-center">
          <h1 className="font-inter text-[clamp(1.5rem,4vw,1.75rem)] font-bold text-[#161616]">
            {tenantDetailsCopy.title}
          </h1>
          <p className="font-inter text-[15px] text-brand-dark/50">
            {tenantDetailsCopy.subtitle}
          </p>
        </header>

        <div className="flex flex-col gap-4 sm:gap-5">
          <fieldset className="flex flex-col gap-2">
            <legend className="font-inter text-[13px] font-semibold text-black">
              {tenantDetailsCopy.lookingAsLabel}
            </legend>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3">
              {tenantLookingAsOptions.map((option) => {
                const selected = lookingAs === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setLookingAs(option.id)}
                    aria-pressed={selected}
                    className={`inline-flex h-11 items-center justify-center rounded-[10px] font-inter text-[13px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 ${
                      selected
                        ? "bg-[#0f0f0f] text-white"
                        : "border border-[#e5e5e2] bg-white text-brand-dark/50 hover:border-brand-dark/30"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="flex flex-col gap-2">
            <label
              htmlFor={`${formId}-location`}
              className="font-inter text-[13px] font-semibold text-[#161616]"
            >
              {tenantDetailsCopy.locationLabel}
            </label>
            <input
              id={`${formId}-location`}
              type="text"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              placeholder={tenantDetailsCopy.locationPlaceholder}
              className="h-[52px] w-full rounded-[10px] border border-[#e5e5e2] bg-white px-4 font-inter text-[15px] text-brand-dark placeholder:text-brand-dark/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor={`${formId}-budget`}
              className="font-inter text-[13px] font-semibold text-[#161616]"
            >
              {tenantDetailsCopy.budgetLabel}
            </label>
            <input
              id={`${formId}-budget`}
              type="text"
              value={budget}
              onChange={(event) => setBudget(event.target.value)}
              placeholder={tenantDetailsCopy.budgetPlaceholder}
              className="h-[52px] w-full rounded-[10px] border border-[#e5e5e2] bg-white px-4 font-inter text-[15px] text-brand-dark placeholder:text-brand-dark/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
            />
          </div>
        </div>

        {error ? (
          <p role="alert" className="font-inter text-sm font-medium text-red-600">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-[52px] w-full items-center justify-center rounded-[10px] bg-[#0f0f0f] font-inter text-[15px] font-medium text-white transition-colors hover:bg-brand-dark/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Submitting…" : tenantDetailsCopy.submitLabel}
        </button>
      </form>

      <p className="flex flex-wrap items-center justify-center gap-1 font-inter text-base">
        <span className="text-brand-dark/50">{tenantDetailsCopy.alreadyHaveAccount}</span>
        <Link
          href={routes.signIn}
          className="font-bold text-brand-dark transition-opacity hover:opacity-70"
        >
          {tenantDetailsCopy.signInLabel}
        </Link>
      </p>
    </div>
  );
}
