"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { routes } from "@/config/routes";
import { SignupStepper } from "@/features/signup/components/SignupStepper";
import { useSignupWizard } from "@/features/signup/context/SignupWizardProvider";
import {
  serviceCategoryOptions,
  serviceProviderDetailsCopy,
} from "@/features/signup/data/signup.mock";
import type { ServiceCategoryId } from "@/features/signup/types/signup.types";
import { registerAccount, type CloudinaryAsset } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { uploadToCloudinary } from "@/lib/api/uploads";
import { useAuth } from "@/lib/auth/AuthProvider";

const BIO_MAX = serviceProviderDetailsCopy.bioMaxLength;

function isCloudinaryAsset(value: unknown): value is CloudinaryAsset {
  return Boolean(
    value &&
      typeof value === "object" &&
      "publicId" in value &&
      typeof (value as CloudinaryAsset).publicId === "string"
  );
}

export function ServiceProviderDetailsForm() {
  const router = useRouter();
  const formId = useId();
  const {
    state,
    hydrated,
    setProfileData,
    buildRegistrationPayload,
    clear,
  } = useSignupWizard();
  const { refreshProfile } = useAuth();
  const [category, setCategory] = useState<ServiceCategoryId>("electrician");
  const [experience, setExperience] = useState("");
  const [areas, setAreas] = useState<string[]>(["Dhanmondi", "Mohammadpur"]);
  const [areaDraft, setAreaDraft] = useState("");
  const [certificateName, setCertificateName] = useState<string | undefined>();
  const [tradeCertificate, setTradeCertificate] = useState<
    CloudinaryAsset | undefined
  >();
  const [uploadingCertificate, setUploadingCertificate] = useState(false);
  const [bio, setBio] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [restored, setRestored] = useState(false);
  const certificateInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!hydrated || restored) return;
    const stored = state.profileData || {};
    const categoryIds = serviceCategoryOptions.map((option) => option.id);
    if (
      typeof stored.serviceCategory === "string" &&
      categoryIds.includes(stored.serviceCategory as ServiceCategoryId)
    ) {
      setCategory(stored.serviceCategory as ServiceCategoryId);
    }
    if (typeof stored.yearsOfExperience === "string") {
      setExperience(stored.yearsOfExperience);
    }
    if (Array.isArray(stored.serviceAreas)) {
      setAreas(stored.serviceAreas.filter((item) => typeof item === "string"));
    }
    if (typeof stored.bio === "string") {
      setBio(stored.bio);
    }
    if (isCloudinaryAsset(stored.tradeCertificate)) {
      setTradeCertificate(stored.tradeCertificate);
      setCertificateName(
        stored.tradeCertificate.format
          ? `certificate.${stored.tradeCertificate.format}`
          : "Uploaded certificate"
      );
    }
    setRestored(true);
  }, [hydrated, restored, state.profileData]);

  useEffect(() => {
    if (!hydrated || !restored) return;
    setProfileData({
      serviceCategory: category,
      yearsOfExperience: experience.trim() || undefined,
      serviceAreas: areas,
      tradeCertificate,
      bio: bio.trim() || undefined,
    });
  }, [
    areas,
    bio,
    category,
    experience,
    hydrated,
    restored,
    setProfileData,
    tradeCertificate,
  ]);

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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (uploadingCertificate) return;
    setError(null);
    setIsSubmitting(true);
    try {
      const profileData = {
        serviceCategory: category,
        yearsOfExperience: experience.trim() || undefined,
        serviceAreas: areas,
        tradeCertificate,
        bio: bio.trim() || undefined,
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
            <div className="flex items-center justify-between gap-2">
              <p className="font-inter text-[13px] font-semibold text-black">
                {serviceProviderDetailsCopy.certificateLabel}
              </p>
              {tradeCertificate && !uploadingCertificate ? (
                <span className="font-inter text-[11px] font-semibold text-emerald-700">
                  Uploaded
                </span>
              ) : null}
            </div>
            <label
              htmlFor={`${formId}-certificate`}
              aria-disabled={uploadingCertificate}
              className={`flex min-h-[72px] flex-col items-center justify-center gap-1 rounded-[10px] border-[1.5px] border-dashed px-3 py-3 text-center transition-colors ${
                uploadingCertificate
                  ? "cursor-wait border-brand-dark/40 bg-[#f7f7f5]"
                  : tradeCertificate
                    ? "cursor-pointer border-emerald-300 bg-emerald-50/40 hover:border-emerald-500"
                    : "cursor-pointer border-[#ccccca] bg-[#fafafa] hover:border-brand-dark/50"
              }`}
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
                {uploadingCertificate
                  ? "Uploading..."
                  : tradeCertificate
                    ? certificateName || "Uploaded — click to replace"
                    : serviceProviderDetailsCopy.certificateTitle}
              </span>
              <span className="font-inter text-xs text-brand-dark/50">
                {uploadingCertificate
                  ? "Please wait"
                  : tradeCertificate
                    ? certificateName
                    : serviceProviderDetailsCopy.certificateHint}
              </span>
              <input
                id={`${formId}-certificate`}
                ref={certificateInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,application/pdf"
                className="sr-only"
                disabled={uploadingCertificate}
                onChange={async (event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;

                  const isPdf = file.type === "application/pdf";
                  const isImage = file.type.startsWith("image/");
                  if (!isPdf && !isImage) {
                    setError("Please upload an image or PDF file.");
                    return;
                  }
                  if (file.size > 8 * 1024 * 1024) {
                    setError("File must be under 8MB.");
                    return;
                  }

                  setError(null);
                  setUploadingCertificate(true);
                  setCertificateName(file.name);
                  try {
                    const uploaded = await uploadToCloudinary({
                      file,
                      folder: "provider/trade-certificate",
                      resourceType: isPdf ? "raw" : "image",
                    });
                    setTradeCertificate(uploaded);
                  } catch (err) {
                    setCertificateName(undefined);
                    setTradeCertificate(undefined);
                    setError(
                      err instanceof Error
                        ? err.message
                        : "Could not upload certificate"
                    );
                  } finally {
                    setUploadingCertificate(false);
                    if (certificateInputRef.current) {
                      certificateInputRef.current.value = "";
                    }
                  }
                }}
              />
            </label>
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

        {error ? (
          <p role="alert" className="font-inter text-sm font-medium text-red-600">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting || uploadingCertificate}
          className="inline-flex h-[52px] w-full items-center justify-center rounded-[10px] bg-[#0f0f0f] font-inter text-[15px] font-medium text-white transition-colors hover:bg-brand-dark/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Submitting…" : serviceProviderDetailsCopy.submitLabel}
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
