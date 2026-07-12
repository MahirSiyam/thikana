"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useState, type FormEvent } from "react";
import { routes } from "@/config/routes";
import { SignupStepper } from "@/features/signup/components/SignupStepper";
import {
  ownerContactMethodOptions,
  ownerDetailsCopy,
} from "@/features/signup/data/signup.mock";
import type { OwnerContactMethodId } from "@/features/signup/types/signup.types";

export function OwnerDetailsForm() {
  const router = useRouter();
  const formId = useId();
  const [propertyCount, setPropertyCount] = useState("");
  const [proofFileName, setProofFileName] = useState<string | undefined>();
  const [contactMethod, setContactMethod] =
    useState<OwnerContactMethodId>("phone");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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
          onClick={() => router.push(routes.signUpOwnerVerifyIdentity)}
          className="self-start font-inter text-sm font-semibold text-brand-dark/50 transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
        >
          {ownerDetailsCopy.backLabel}
        </button>

        <header className="flex flex-col gap-1">
          <h1 className="font-inter text-[clamp(1.5rem,4vw,1.75rem)] font-bold text-[#161616]">
            {ownerDetailsCopy.title}
          </h1>
          <p className="font-inter text-[15px] text-brand-dark/50">
            {ownerDetailsCopy.subtitle}
          </p>
        </header>

        <div className="flex flex-col gap-4 sm:gap-5">
          <div className="flex flex-col gap-2">
            <label
              htmlFor={`${formId}-properties`}
              className="font-inter text-[13px] font-semibold text-[#161616]"
            >
              {ownerDetailsCopy.propertiesLabel}
            </label>
            <input
              id={`${formId}-properties`}
              type="text"
              value={propertyCount}
              onChange={(event) => setPropertyCount(event.target.value)}
              placeholder={ownerDetailsCopy.propertiesPlaceholder}
              className="h-[52px] w-full rounded-[10px] border border-[#e5e5e2] bg-white px-4 font-inter text-[15px] text-brand-dark placeholder:text-brand-dark/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
            />
          </div>

          <div className="flex flex-col gap-2">
            <p className="font-inter text-[13px] font-semibold text-black">
              {ownerDetailsCopy.proofLabel}
            </p>
            <label
              htmlFor={`${formId}-proof`}
              className="flex min-h-[90px] cursor-pointer flex-col items-center justify-center gap-1 rounded-[10px] border-[1.5px] border-dashed border-[#ccccca] bg-[#fafafa] px-3 py-3 text-center transition-colors hover:border-brand-dark/50"
            >
              <Image
                src="/images/signup/icon-cloud-upload.svg"
                alt=""
                width={24}
                height={24}
                aria-hidden="true"
                className="size-6"
              />
              <span className="font-inter text-[13px] font-semibold text-[#161616]">
                {ownerDetailsCopy.proofTitle}
              </span>
              <span className="font-inter text-xs text-brand-dark/50">
                {proofFileName ?? ownerDetailsCopy.proofHint}
              </span>
              <input
                id={`${formId}-proof`}
                type="file"
                accept="image/*,.pdf"
                className="sr-only"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  setProofFileName(file ? file.name : undefined);
                }}
              />
            </label>
          </div>

          <fieldset className="flex flex-col gap-2">
            <legend className="font-inter text-[13px] font-semibold text-black">
              {ownerDetailsCopy.contactLabel}
            </legend>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3">
              {ownerContactMethodOptions.map((option) => {
                const selected = contactMethod === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setContactMethod(option.id)}
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
        </div>

        <button
          type="submit"
          className="inline-flex h-[52px] w-full items-center justify-center rounded-[10px] bg-[#0f0f0f] font-inter text-[15px] font-medium text-white transition-colors hover:bg-brand-dark/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
        >
          {ownerDetailsCopy.submitLabel}
        </button>
      </form>

      <p className="flex flex-wrap items-center justify-center gap-1 font-inter text-base">
        <span className="text-brand-dark/50">{ownerDetailsCopy.alreadyHaveAccount}</span>
        <Link
          href={routes.signIn}
          className="font-bold text-brand-dark transition-opacity hover:opacity-70"
        >
          {ownerDetailsCopy.signInLabel}
        </Link>
      </p>
    </div>
  );
}
