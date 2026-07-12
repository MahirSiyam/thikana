"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useId,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { routes } from "@/config/routes";
import { SignupStepper } from "@/features/signup/components/SignupStepper";
import {
  serviceCategoryOptions,
  serviceProviderDetailsCopy,
} from "@/features/signup/data/signup.mock";
import type { ServiceCategoryId } from "@/features/signup/types/signup.types";

const BIO_MAX = serviceProviderDetailsCopy.bioMaxLength;

export function ServiceProviderDetailsForm() {
  const router = useRouter();
  const formId = useId();
  const [category, setCategory] = useState<ServiceCategoryId>("electrician");
  const [experience, setExperience] = useState("");
  const [areas, setAreas] = useState<string[]>(["Dhanmondi", "Mohammadpur"]);
  const [areaDraft, setAreaDraft] = useState("");
  const [certificateName, setCertificateName] = useState<string | undefined>();
  const [photoName, setPhotoName] = useState<string | undefined>();
  const [bio, setBio] = useState("");

  const addArea = () => {
    const next = areaDraft.trim();
    if (!next || areas.includes(next)) return;
    setAreas((current) => [...current, next]);
    setAreaDraft("");
  };

  const handleAreaKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addArea();
    }
  };

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
          onClick={() => router.push(routes.signUpServiceProviderVerifyIdentity)}
          className="self-start font-inter text-sm font-semibold text-brand-dark/50 transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
        >
          {serviceProviderDetailsCopy.backLabel}
        </button>

        <header className="flex flex-col gap-1">
          <h1 className="font-inter text-[clamp(1.5rem,4vw,1.75rem)] font-bold text-[#161616]">
            {serviceProviderDetailsCopy.title}
          </h1>
          <p className="font-inter text-[15px] text-brand-dark/50">
            {serviceProviderDetailsCopy.subtitle}
          </p>
        </header>

        <div className="flex flex-col gap-4">
          <fieldset className="flex flex-col gap-2">
            <legend className="font-inter text-[13px] font-semibold text-black">
              {serviceProviderDetailsCopy.categoryLabel}
            </legend>
            <div className="flex flex-wrap gap-2.5">
              {serviceCategoryOptions.map((option) => {
                const selected = category === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setCategory(option.id)}
                    aria-pressed={selected}
                    className={`inline-flex items-center rounded-[10px] px-4 py-2.5 font-inter text-[13px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 ${
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

          <div className="flex flex-col gap-2 sm:max-w-[50%]">
            <label
              htmlFor={`${formId}-experience`}
              className="font-inter text-[13px] font-semibold text-[#161616]"
            >
              {serviceProviderDetailsCopy.experienceLabel}
            </label>
            <input
              id={`${formId}-experience`}
              type="text"
              inputMode="numeric"
              value={experience}
              onChange={(event) => setExperience(event.target.value)}
              placeholder={serviceProviderDetailsCopy.experiencePlaceholder}
              className="h-[52px] w-full rounded-[10px] border border-[#e5e5e2] bg-white px-4 font-inter text-[15px] text-brand-dark placeholder:text-brand-dark/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
            />
          </div>

          <div className="flex flex-col gap-2">
            <p className="font-inter text-[13px] font-semibold text-black">
              {serviceProviderDetailsCopy.areasLabel}
            </p>
            <div className="flex min-h-[52px] flex-wrap items-center gap-2 rounded-[10px] border border-[#e5e5e2] bg-white p-2 focus-within:ring-2 focus-within:ring-brand-dark focus-within:ring-offset-2">
              {areas.map((area) => (
                <span
                  key={area}
                  className="inline-flex items-center gap-1 rounded-md bg-[#f0f0ed] px-2.5 py-1.5 font-inter text-[13px]"
                >
                  <span className="font-semibold text-black">{area}</span>
                  <button
                    type="button"
                    aria-label={`Remove ${area}`}
                    onClick={() =>
                      setAreas((current) => current.filter((item) => item !== area))
                    }
                    className="text-brand-dark/50 transition-opacity hover:opacity-70"
                  >
                    ✕
                  </button>
                </span>
              ))}
              <input
                id={`${formId}-areas`}
                type="text"
                value={areaDraft}
                onChange={(event) => setAreaDraft(event.target.value)}
                onKeyDown={handleAreaKeyDown}
                onBlur={addArea}
                placeholder={serviceProviderDetailsCopy.areasPlaceholder}
                className="min-w-[7rem] flex-1 bg-transparent px-1 py-1.5 font-inter text-[13px] text-brand-dark outline-none placeholder:text-brand-dark/50"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <p className="font-inter text-[13px] font-semibold text-black">
              {serviceProviderDetailsCopy.certificateLabel}
            </p>
            <label
              htmlFor={`${formId}-certificate`}
              className="flex min-h-[72px] cursor-pointer flex-col items-center justify-center gap-1 rounded-[10px] border-[1.5px] border-dashed border-[#ccccca] bg-[#fafafa] px-3 py-3 text-center transition-colors hover:border-brand-dark/50"
            >
              <Image
                src="/images/signup/icon-file.svg"
                alt=""
                width={24}
                height={24}
                aria-hidden="true"
                className="size-6"
              />
              <span className="font-inter text-[13px] font-semibold text-[#161616]">
                {serviceProviderDetailsCopy.certificateTitle}
              </span>
              <span className="font-inter text-xs text-brand-dark/50">
                {certificateName ?? serviceProviderDetailsCopy.certificateHint}
              </span>
              <input
                id={`${formId}-certificate`}
                type="file"
                accept="image/*,.pdf"
                className="sr-only"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  setCertificateName(file ? file.name : undefined);
                }}
              />
            </label>
          </div>

          <div className="flex flex-col gap-2">
            <p className="font-inter text-[13px] font-semibold text-black">
              {serviceProviderDetailsCopy.photoLabel}
            </p>
            <div className="flex items-center gap-4">
              <label
                htmlFor={`${formId}-photo`}
                className="relative size-24 shrink-0 cursor-pointer rounded-full border border-dashed border-[#e5e5e2] bg-[#e5e5e2] focus-within:outline-none focus-within:ring-2 focus-within:ring-brand-dark focus-within:ring-offset-2"
              >
                <span className="flex size-full items-center justify-center">
                  <Image
                    src="/images/signup/user-avatar.svg"
                    alt=""
                    width={32}
                    height={32}
                    aria-hidden="true"
                    className="size-8"
                  />
                </span>
                <span className="absolute -bottom-px -right-px flex size-7 items-center justify-center rounded-[14px] bg-[#0f0f0f]">
                  <Image
                    src="/images/signup/camera-badge.svg"
                    alt=""
                    width={14}
                    height={14}
                    aria-hidden="true"
                    className="size-3.5"
                  />
                </span>
                <input
                  id={`${formId}-photo`}
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    setPhotoName(file ? file.name : undefined);
                  }}
                />
              </label>
              <p className="font-inter text-sm text-brand-dark/50">
                {photoName
                  ? `Selected: ${photoName}`
                  : serviceProviderDetailsCopy.photoHint}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor={`${formId}-bio`}
              className="font-inter text-[13px] font-semibold text-black"
            >
              {serviceProviderDetailsCopy.bioLabel}
            </label>
            <div className="relative">
              <textarea
                id={`${formId}-bio`}
                value={bio}
                maxLength={BIO_MAX}
                onChange={(event) => setBio(event.target.value)}
                placeholder={serviceProviderDetailsCopy.bioPlaceholder}
                rows={4}
                className="min-h-[100px] w-full resize-none rounded-[10px] border border-[#e5e5e2] bg-white p-4 pb-8 font-inter text-sm text-brand-dark placeholder:text-brand-dark/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
              />
              <span className="pointer-events-none absolute right-4 bottom-3 font-inter text-xs text-[#9b9b98]">
                {bio.length} / {BIO_MAX}
              </span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="inline-flex h-[52px] w-full items-center justify-center rounded-[10px] bg-[#0f0f0f] font-inter text-[15px] font-medium text-white transition-colors hover:bg-brand-dark/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
        >
          {serviceProviderDetailsCopy.submitLabel}
        </button>
      </form>

      <p className="flex flex-wrap items-center justify-center gap-1 font-inter text-base">
        <span className="text-brand-dark/50">
          {serviceProviderDetailsCopy.alreadyHaveAccount}
        </span>
        <Link
          href={routes.signIn}
          className="font-bold text-brand-dark transition-opacity hover:opacity-70"
        >
          {serviceProviderDetailsCopy.signInLabel}
        </Link>
      </p>
    </div>
  );
}
