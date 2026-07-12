"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useState, type FormEvent } from "react";
import { routes } from "@/config/routes";
import { SignupStepper } from "@/features/signup/components/SignupStepper";

type UploadSlot = "nid-front" | "nid-back" | "selfie";

export function TenantVerifyIdentityForm() {
  const router = useRouter();
  const formId = useId();
  const [files, setFiles] = useState<Partial<Record<UploadSlot, string>>>({});

  const handleFileChange = (slot: UploadSlot, fileList: FileList | null) => {
    const file = fileList?.[0];
    setFiles((current) => ({
      ...current,
      [slot]: file ? file.name : undefined,
    }));
  };

  const goToDetails = () => {
    router.push(routes.signUpTenantDetails);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    goToDetails();
  };

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
          onClick={() => router.push(routes.signUpTenantVerifyOtp)}
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

        <div className="flex flex-col gap-3">
          <p className="font-inter text-sm font-semibold text-black">National ID Card</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <UploadBox
              id={`${formId}-nid-front`}
              title="NID — Front Side"
              hint="Clear photo, all 4 corners visible"
              iconSrc="/images/signup/icon-cloud-upload.svg"
              fileName={files["nid-front"]}
              onChange={(fileList) => handleFileChange("nid-front", fileList)}
            />
            <UploadBox
              id={`${formId}-nid-back`}
              title="NID — Back Side"
              hint="Clear photo, all 4 corners visible"
              iconSrc="/images/signup/icon-cloud-upload.svg"
              fileName={files["nid-back"]}
              onChange={(fileList) => handleFileChange("nid-back", fileList)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <p className="font-inter text-sm font-semibold text-black">Selfie Verification</p>
          <UploadBox
            id={`${formId}-selfie`}
            title="Take a Live Selfie"
            hint="This confirms the NID belongs to you. No sunglasses or filters."
            iconSrc="/images/signup/icon-camera.svg"
            fileName={files.selfie}
            tall
            onChange={(fileList) => handleFileChange("selfie", fileList)}
          />
        </div>

        <div className="flex flex-col items-center gap-3">
          <button
            type="submit"
            className="inline-flex h-[52px] w-full items-center justify-center rounded-[10px] bg-[#0f0f0f] font-inter text-[15px] font-medium text-white transition-colors hover:bg-brand-dark/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
          >
            Continue →
          </button>
          <button
            type="button"
            onClick={goToDetails}
            className="font-inter text-sm font-semibold text-brand-dark/50 transition-opacity hover:opacity-70"
          >
            Skip for now - verify later
          </button>
          <div className="flex items-center gap-1.5 rounded bg-[#fffbeb] p-2">
            <Image
              src="/images/signup/icon-alert-triangle.svg"
              alt=""
              width={14}
              height={14}
              aria-hidden="true"
              className="size-3.5 shrink-0"
            />
            <p className="font-inter text-xs font-medium text-[#b45309]">
              Unverified tenants may have limited booking access
            </p>
          </div>
        </div>
      </form>

      <p className="flex flex-wrap items-center justify-center gap-1 font-inter text-base">
        <span className="text-brand-dark/50">Already have an account?</span>
        <Link
          href={routes.signIn}
          className="font-bold text-brand-dark transition-opacity hover:opacity-70"
        >
          Sign In →
        </Link>
      </p>
    </div>
  );
}

function UploadBox({
  id,
  title,
  hint,
  iconSrc,
  fileName,
  tall = false,
  onChange,
}: {
  id: string;
  title: string;
  hint: string;
  iconSrc: string;
  fileName?: string;
  tall?: boolean;
  onChange: (files: FileList | null) => void;
}) {
  return (
    <label
      htmlFor={id}
      className={`flex cursor-pointer flex-col items-center justify-center gap-1 rounded-[10px] border-[1.5px] border-dashed border-[#ccccca] bg-[#fafafa] px-3 text-center transition-colors hover:border-brand-dark/50 ${
        tall ? "min-h-[120px] py-4" : "min-h-[100px] py-3"
      }`}
    >
      <Image
        src={iconSrc}
        alt=""
        width={24}
        height={24}
        aria-hidden="true"
        className="size-6"
      />
      <span className="font-inter text-[13px] font-semibold text-[#161616]">{title}</span>
      <span className="font-inter text-xs text-brand-dark/50">
        {fileName ?? hint}
      </span>
      <input
        id={id}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(event) => onChange(event.target.files)}
      />
    </label>
  );
}
