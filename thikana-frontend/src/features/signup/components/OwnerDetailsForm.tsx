"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { routes } from "@/config/routes";
import { SignupStepper } from "@/features/signup/components/SignupStepper";
import { useSignupWizard } from "@/features/signup/context/SignupWizardProvider";
import {
  ownerContactMethodOptions,
  ownerDetailsCopy,
} from "@/features/signup/data/signup.mock";
import type { OwnerContactMethodId } from "@/features/signup/types/signup.types";
import { registerAccount, type CloudinaryAsset } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { uploadToCloudinary } from "@/lib/api/uploads";
import { useAuth } from "@/lib/auth/AuthProvider";

function isCloudinaryAsset(value: unknown): value is CloudinaryAsset {
  return Boolean(
    value &&
      typeof value === "object" &&
      "publicId" in value &&
      typeof (value as CloudinaryAsset).publicId === "string"
  );
}

export function OwnerDetailsForm() {
  const router = useRouter();
  const formId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | null>(null);
  const {
    state,
    hydrated,
    setProfileData,
    buildRegistrationPayload,
    clear,
  } = useSignupWizard();
  const { refreshProfile } = useAuth();
  const [propertyCount, setPropertyCount] = useState("");
  const [proofFileName, setProofFileName] = useState<string | undefined>();
  const [ownershipProof, setOwnershipProof] = useState<CloudinaryAsset | undefined>();
  const [preview, setPreview] = useState<string | undefined>();
  const [uploading, setUploading] = useState(false);
  const [contactMethod, setContactMethod] =
    useState<OwnerContactMethodId>("phone");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [restored, setRestored] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!hydrated || restored) return;

    const stored = state.profileData || {};
    if (typeof stored.propertyCount === "string") {
      setPropertyCount(stored.propertyCount);
    }
    if (
      stored.preferredContactMethod === "phone" ||
      stored.preferredContactMethod === "whatsapp" ||
      stored.preferredContactMethod === "in-app"
    ) {
      setContactMethod(stored.preferredContactMethod);
    }
    if (isCloudinaryAsset(stored.ownershipProof)) {
      setOwnershipProof(stored.ownershipProof);
      if (stored.ownershipProof.secureUrl) {
        setPreview(stored.ownershipProof.secureUrl);
      }
      setProofFileName(
        stored.ownershipProof.format
          ? `ownership-proof.${stored.ownershipProof.format}`
          : "Uploaded document"
      );
    }
    setRestored(true);
  }, [hydrated, restored, state.profileData]);

  const clearLocalPreview = () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
  };

  const handleProofUpload = async (fileList: FileList | null) => {
    const file = fileList?.[0];
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
    setUploading(true);
    setProofFileName(file.name);

    clearLocalPreview();
    if (isImage) {
      const objectUrl = URL.createObjectURL(file);
      previewUrlRef.current = objectUrl;
      setPreview(objectUrl);
    } else {
      setPreview(undefined);
    }

    try {
      const uploaded = await uploadToCloudinary({
        file,
        folder: "owner/ownership-proof",
        resourceType: isPdf ? "raw" : "image",
      });
      setOwnershipProof(uploaded);
      if (uploaded.secureUrl && isImage) {
        clearLocalPreview();
        setPreview(uploaded.secureUrl);
      }
    } catch (err) {
      clearLocalPreview();
      setProofFileName(undefined);
      setOwnershipProof(undefined);
      setPreview(undefined);
      setError(err instanceof Error ? err.message : "Could not upload proof");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (uploading) return;
    setError(null);
    setIsSubmitting(true);
    try {
      const profileData = {
        propertyCount: propertyCount.trim() || undefined,
        preferredContactMethod: contactMethod,
        ownershipProof,
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
            <div className="flex items-center justify-between gap-2">
              <p className="font-inter text-[13px] font-semibold text-[#161616]">
                {ownerDetailsCopy.proofLabel}
              </p>
              {ownershipProof && !uploading ? (
                <span className="font-inter text-[11px] font-semibold text-emerald-700">
                  Uploaded
                </span>
              ) : null}
            </div>
            <label
              htmlFor={`${formId}-proof`}
              aria-disabled={uploading}
              className={`relative flex min-h-[110px] flex-col items-center justify-center gap-1 overflow-hidden rounded-[10px] border-[1.5px] border-dashed px-3 py-3 text-center transition-colors ${
                uploading
                  ? "cursor-wait border-brand-dark/40 bg-[#f7f7f5]"
                  : ownershipProof
                    ? "cursor-pointer border-emerald-300 bg-emerald-50/40 hover:border-emerald-500"
                    : "cursor-pointer border-[#ccccca] bg-[#fafafa] hover:border-brand-dark/50"
              }`}
            >
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={preview}
                  alt=""
                  className="absolute inset-0 size-full object-cover opacity-35"
                />
              ) : null}
              <div className="relative z-10 flex flex-col items-center gap-1">
                <Image
                  src="/images/signup/icon-cloud-upload.svg"
                  alt=""
                  width={22}
                  height={22}
                  aria-hidden="true"
                />
                <span className="font-inter text-sm font-medium text-brand-dark">
                  {uploading
                    ? "Uploading..."
                    : ownershipProof
                      ? proofFileName || "Uploaded — click to replace"
                      : ownerDetailsCopy.proofTitle}
                </span>
                {!ownershipProof && !uploading ? (
                  <span className="font-inter text-xs text-brand-dark/50">
                    {ownerDetailsCopy.proofHint}
                  </span>
                ) : null}
              </div>
              <input
                id={`${formId}-proof`}
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,application/pdf"
                className="sr-only"
                disabled={uploading}
                onChange={(event) => void handleProofUpload(event.target.files)}
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

        {error ? (
          <p role="alert" className="font-inter text-sm font-medium text-red-600">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting || uploading}
          className="inline-flex h-[52px] w-full items-center justify-center rounded-[10px] bg-[#0f0f0f] font-inter text-[15px] font-medium text-white transition-colors hover:bg-brand-dark/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Submitting…" : ownerDetailsCopy.submitLabel}
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
