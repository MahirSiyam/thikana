"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { routes } from "@/config/routes";
import { SignupStepper } from "@/features/signup/components/SignupStepper";
import { useSignupWizard } from "@/features/signup/context/SignupWizardProvider";
import type { CloudinaryAsset } from "@/lib/api/auth";
import { uploadToCloudinary, type UploadFolder } from "@/lib/api/uploads";

type UploadSlot = "nid-front" | "nid-back" | "selfie";

type TenantVerifyIdentityFormProps = {
  backHref?: string;
  nextHref?: string | null;
};

const slotToFolder: Record<UploadSlot, UploadFolder> = {
  "nid-front": "identity/nid-front",
  "nid-back": "identity/nid-back",
  selfie: "identity/selfie",
};

const slotToKey = {
  "nid-front": "nidFront",
  "nid-back": "nidBack",
  selfie: "selfie",
} as const;

const uploadSlots = [
  ["nid-front", "NID — Front Side"],
  ["nid-back", "NID — Back Side"],
  ["selfie", "Live Selfie"],
] as const;

export function TenantVerifyIdentityForm({
  backHref = routes.signUpTenantForm,
  nextHref = routes.signUpTenantDetails,
}: TenantVerifyIdentityFormProps = {}) {
  const router = useRouter();
  const formId = useId();
  const { state, hydrated, setIdentityDocuments } = useSignupWizard();
  const inputRefs = useRef<Partial<Record<UploadSlot, HTMLInputElement | null>>>({});
  const previewUrlsRef = useRef<string[]>([]);
  const [fileNames, setFileNames] = useState<Partial<Record<UploadSlot, string>>>({});
  const [previews, setPreviews] = useState<Partial<Record<UploadSlot, string>>>({});
  const [assets, setAssets] = useState<
    Partial<Record<"nidFront" | "nidBack" | "selfie", CloudinaryAsset>>
  >({});
  const [uploadingSlot, setUploadingSlot] = useState<UploadSlot | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [restored, setRestored] = useState(false);

  useEffect(() => {
    return () => {
      previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  useEffect(() => {
    if (!hydrated || restored) return;

    const docs = state.commonData.identityDocuments || {};
    const nextAssets: Partial<
      Record<"nidFront" | "nidBack" | "selfie", CloudinaryAsset>
    > = {};
    const nextPreviews: Partial<Record<UploadSlot, string>> = {};
    const nextNames: Partial<Record<UploadSlot, string>> = {};

    (Object.keys(slotToKey) as UploadSlot[]).forEach((slot) => {
      const key = slotToKey[slot];
      const asset = docs[key];
      if (!asset?.publicId) return;
      nextAssets[key] = asset;
      if (asset.secureUrl) {
        nextPreviews[slot] = asset.secureUrl;
      }
      nextNames[slot] = asset.format
        ? `${key}.${asset.format}`
        : "Uploaded document";
    });

    setAssets(nextAssets);
    setPreviews(nextPreviews);
    setFileNames(nextNames);
    setRestored(true);
  }, [hydrated, restored, state.commonData.identityDocuments]);

  // Keep wizard/sessionStorage in sync after local asset changes (not during render).
  useEffect(() => {
    if (!hydrated || !restored) return;
    setIdentityDocuments(assets);
  }, [assets, hydrated, restored, setIdentityDocuments]);

  const handleFileChange = async (slot: UploadSlot, fileList: FileList | null) => {
    const file = fileList?.[0];
    if (!file) return;

    if (uploadingSlot) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file (JPG, PNG, or WebP).");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError("Each image must be under 8MB.");
      return;
    }

    setError(null);
    setUploadingSlot(slot);
    setFileNames((current) => ({ ...current, [slot]: file.name }));

    const objectUrl = URL.createObjectURL(file);
    previewUrlsRef.current.push(objectUrl);
    setPreviews((current) => ({ ...current, [slot]: objectUrl }));

    try {
      const uploaded = await uploadToCloudinary({
        file,
        folder: slotToFolder[slot],
        resourceType: "image",
      });
      setAssets((current) => ({
        ...current,
        [slotToKey[slot]]: uploaded,
      }));
    } catch (err) {
      setFileNames((current) => ({ ...current, [slot]: undefined }));
      setPreviews((current) => {
        const next = { ...current };
        delete next[slot];
        return next;
      });
      setAssets((current) => {
        const next = { ...current };
        delete next[slotToKey[slot]];
        return next;
      });
      setError(err instanceof Error ? err.message : "Could not upload document");
    } finally {
      setUploadingSlot(null);
      const input = inputRefs.current[slot];
      if (input) input.value = "";
    }
  };

  const goNext = () => {
    if (nextHref) {
      router.push(nextHref);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (uploadingSlot) return;
    setError(null);
    setIsSubmitting(true);
    try {
      setIdentityDocuments(assets);
      goNext();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    if (uploadingSlot) return;
    setIdentityDocuments(assets);
    goNext();
  };

  const isBusy = uploadingSlot !== null;

  return (
    <div className="flex w-full max-w-[505px] flex-col items-center gap-3">
      <SignupStepper activeStepId="verify-identity" />

      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col gap-4 rounded-[10px] border border-brand-dark/50 bg-white p-4 shadow-[0px_10px_10px_rgba(0,0,0,0.03),0px_1px_1px_rgba(0,0,0,0.02)] sm:gap-5 sm:p-6"
        noValidate
      >
        <button
          type="button"
          onClick={() => router.push(backHref)}
          className="self-start font-inter text-sm font-semibold text-brand-dark/50 transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
        >
          ← Back
        </button>

        <header className="flex flex-col gap-1 text-center">
          <h1 className="font-inter text-[clamp(1.5rem,4vw,1.75rem)] font-bold text-[#161616]">
            Verify your identity
          </h1>
          <p className="font-inter text-[15px] text-brand-dark/50">
            Thikana verifies every user to keep the platform safe and broker-free. Your
            information is encrypted and never shared publicly.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-2 rounded-lg border border-[#e5e5e2] bg-[#f9f9f7] px-2 py-3 sm:grid-cols-3 sm:gap-0">
          <p className="border-[#e5e5e2] text-center font-inter text-xs text-brand-dark/50 sm:border-r">
            Encrypted & Secure
          </p>
          <p className="border-[#e5e5e2] text-center font-inter text-xs text-brand-dark/50 sm:border-r">
            Never Shown Publicly
          </p>
          <p className="text-center font-inter text-xs text-brand-dark/50">
            Verified in 24–48 Hours
          </p>
        </div>

        {isBusy ? (
          <p className="rounded-lg bg-amber-50 px-3 py-2 font-inter text-xs font-medium text-amber-900">
            Uploading… other fields are temporarily locked.
          </p>
        ) : null}

        <div className="flex flex-col gap-3">
          {uploadSlots.map(([slot, label]) => {
            const isThisUploading = uploadingSlot === slot;
            const isLocked = isBusy && !isThisUploading;
            const assetKey = slotToKey[slot];
            const uploaded = Boolean(assets[assetKey]);
            const preview = previews[slot];

            return (
              <div key={slot} className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-inter text-[13px] font-semibold text-[#161616]">
                    {label}
                  </p>
                  {uploaded && !isThisUploading ? (
                    <span className="font-inter text-[11px] font-semibold text-emerald-700">
                      Uploaded
                    </span>
                  ) : null}
                </div>
                <label
                  htmlFor={`${formId}-${slot}`}
                  aria-disabled={isLocked || isThisUploading}
                  className={`relative flex min-h-[110px] flex-col items-center justify-center gap-1 overflow-hidden rounded-[10px] border-[1.5px] border-dashed px-3 py-3 text-center transition-colors ${
                    isLocked
                      ? "cursor-not-allowed border-[#e5e5e2] bg-[#f3f3f1] opacity-55"
                      : isThisUploading
                        ? "cursor-wait border-brand-dark/40 bg-[#f7f7f5]"
                        : uploaded
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
                      {isThisUploading
                        ? "Uploading..."
                        : isLocked
                          ? "Wait for current upload"
                          : uploaded
                            ? fileNames[slot] || "Uploaded — click to replace"
                            : "Drag & drop or click to upload"}
                    </span>
                  </div>
                  <input
                    id={`${formId}-${slot}`}
                    ref={(node) => {
                      inputRefs.current[slot] = node;
                    }}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="sr-only"
                    disabled={isLocked || isThisUploading}
                    onChange={(event) =>
                      void handleFileChange(slot, event.target.files)
                    }
                  />
                </label>
              </div>
            );
          })}
        </div>

        {error ? (
          <p role="alert" className="font-inter text-sm font-medium text-red-600">
            {error}
          </p>
        ) : null}

        <div className="flex flex-col gap-2">
          <button
            type="submit"
            disabled={isSubmitting || isBusy}
            className="inline-flex h-[52px] w-full items-center justify-center rounded-[10px] bg-[#0f0f0f] font-inter text-[15px] font-medium text-white transition-colors hover:bg-brand-dark/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Saving…" : "Continue →"}
          </button>
          <button
            type="button"
            disabled={isBusy}
            onClick={handleSkip}
            className="font-inter text-sm font-semibold text-brand-dark/50 transition-opacity hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Skip for now
          </button>
        </div>
      </form>

      <p className="flex flex-wrap items-center justify-center gap-1 font-inter text-base">
        <span className="text-brand-dark/50">Already have an account?</span>
        <Link href={routes.signIn} className="font-bold text-brand-dark">
          Sign In →
        </Link>
      </p>
    </div>
  );
}
