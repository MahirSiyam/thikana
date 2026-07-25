"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { routes } from "@/config/routes";
import {
  amenityOptions,
  defaultListingForm,
  divisions,
  listingSteps,
  propertyTypes,
  stepContinueLabels,
  whoCanRentOptions,
} from "@/features/owner-add-new-listing/data/owner-add-new-listing.mock";
import type {
  ListingFormState,
  ListingMediaItem,
  PropertyType,
  WhoCanRent,
} from "@/features/owner-add-new-listing/types/owner-add-new-listing.types";
import { createListing } from "@/lib/api/listings";
import { ApiError } from "@/lib/api/client";
import { uploadToCloudinary } from "@/lib/api/uploads";
import { useAuth } from "@/lib/auth/AuthProvider";

function ListingStepper({ activeStep }: { activeStep: number }) {
  return (
    <ol className="relative flex w-full items-start justify-between gap-2 sm:gap-4">
      <li
        aria-hidden="true"
        className="pointer-events-none absolute top-4 right-[12%] left-[12%] hidden h-px bg-[#e5e5e2] sm:block"
      />
      {listingSteps.map((step) => {
        const isActive = step.id === activeStep;
        const isCompleted = step.id < activeStep;

        return (
          <li
            key={step.id}
            className="relative z-10 flex min-w-0 flex-1 flex-col items-center gap-2"
          >
            <span
              className={`flex size-8 shrink-0 items-center justify-center rounded-full font-inter text-sm font-semibold ${
                isActive
                  ? "bg-brand-dark text-white"
                  : isCompleted
                    ? "border border-brand-dark bg-brand-dark text-white"
                    : "border border-[#d1d5db] bg-white text-[#6b7280]"
              }`}
              aria-current={isActive ? "step" : undefined}
            >
              {step.id}
            </span>
            <span
              className={`max-w-[5.5rem] text-center font-inter text-[11px] leading-tight sm:max-w-none sm:text-xs ${
                isActive ? "font-bold text-brand-dark" : "font-medium text-[#6b7280]"
              }`}
            >
              {step.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function FieldLabel({ htmlFor, children }: { htmlFor?: string; children: React.ReactNode }) {
  return (
    <label
      htmlFor={htmlFor}
      className="font-inter text-sm font-semibold text-brand-dark"
    >
      {children}
    </label>
  );
}

function SelectField({
  id,
  label,
  value,
  options,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  options: { id: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-2">
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-11 w-full appearance-none rounded-lg border border-[#e5e5e2] bg-white py-2 pr-4 pl-9 font-inter text-sm text-brand-dark outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
        >
          {options.map((option) => (
            <option key={option.id} value={option.label}>
              {option.label}
            </option>
          ))}
        </select>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 font-inter text-xs text-[#6b7280]"
        >
          🔽
        </span>
      </div>
    </div>
  );
}

function PropertyInfoStep({
  form,
  onChange,
  onPropertyTypeChange,
  onWhoCanRentToggle,
}: {
  form: ListingFormState;
  onChange: (field: keyof ListingFormState, value: string) => void;
  onPropertyTypeChange: (type: PropertyType) => void;
  onWhoCanRentToggle: (option: WhoCanRent) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <FieldLabel htmlFor="property-title">Property Title</FieldLabel>
        <input
          id="property-title"
          type="text"
          value={form.propertyTitle}
          onChange={(event) => onChange("propertyTitle", event.target.value)}
          placeholder="Spacious 2-Bedroom in Dhanmondi"
          className="h-11 w-full rounded-lg border border-[#e5e5e2] px-4 font-inter text-sm text-brand-dark outline-none placeholder:text-[#9ca3af] focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
        />
      </div>

      <div className="flex flex-col gap-3">
        <FieldLabel>Property Type</FieldLabel>
        <div className="flex flex-wrap gap-2">
          {propertyTypes.map((type) => {
            const isSelected = form.propertyType === type;
            return (
              <button
                key={type}
                type="button"
                onClick={() => onPropertyTypeChange(type)}
                className={`rounded-full px-4 py-2 font-inter text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 ${
                  isSelected
                    ? "bg-brand-dark text-white"
                    : "border border-[#e5e5e2] bg-white text-brand-dark"
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
        <SelectField
          id="division"
          label="Division"
          value={form.division}
          options={divisions}
          onChange={(value) => onChange("division", value)}
        />
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <FieldLabel htmlFor="district">District</FieldLabel>
          <input
            id="district"
            type="text"
            value={form.district}
            onChange={(event) => onChange("district", event.target.value)}
            placeholder="e.g. Dhaka"
            className="h-11 w-full rounded-lg border border-[#e5e5e2] px-4 font-inter text-sm text-brand-dark outline-none placeholder:text-[#9ca3af] focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <FieldLabel htmlFor="area">Area</FieldLabel>
          <input
            id="area"
            type="text"
            value={form.area}
            onChange={(event) => onChange("area", event.target.value)}
            placeholder="e.g. Dhanmondi"
            className="h-11 w-full rounded-lg border border-[#e5e5e2] px-4 font-inter text-sm text-brand-dark outline-none placeholder:text-[#9ca3af] focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-2">
          <FieldLabel htmlFor="floor-level">Floor Level</FieldLabel>
          <input
            id="floor-level"
            type="text"
            inputMode="numeric"
            value={form.floorLevel}
            onChange={(event) => onChange("floorLevel", event.target.value)}
            className="h-11 w-full rounded-lg border border-[#e5e5e2] px-4 font-inter text-sm text-brand-dark outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
          />
        </div>
        <div className="flex flex-col gap-2">
          <FieldLabel htmlFor="size-sqft">Size (sqft)</FieldLabel>
          <input
            id="size-sqft"
            type="text"
            inputMode="numeric"
            value={form.sizeSqft}
            onChange={(event) => onChange("sizeSqft", event.target.value)}
            className="h-11 w-full rounded-lg border border-[#e5e5e2] px-4 font-inter text-sm text-brand-dark outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
          />
        </div>
        <div className="flex flex-col gap-2">
          <FieldLabel htmlFor="monthly-rent">Monthly Rent</FieldLabel>
          <div className="flex h-11 overflow-hidden rounded-lg border border-[#e5e5e2]">
            <span className="inline-flex shrink-0 items-center border-r border-[#e5e5e2] bg-[#f5f5f3] px-3 font-inter text-xs font-semibold text-[#6b7280]">
              BDT
            </span>
            <input
              id="monthly-rent"
              type="text"
              inputMode="numeric"
              value={form.monthlyRent}
              onChange={(event) => onChange("monthlyRent", event.target.value)}
              className="min-w-0 flex-1 px-4 font-inter text-sm text-brand-dark outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-inset"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:max-w-xs">
        <FieldLabel htmlFor="available-from">Available From</FieldLabel>
        <input
          id="available-from"
          type="date"
          value={form.availableFrom}
          onChange={(event) => onChange("availableFrom", event.target.value)}
          className="h-11 w-full rounded-lg border border-[#e5e5e2] px-4 font-inter text-sm text-brand-dark outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
        />
      </div>

      <div className="flex flex-col gap-3">
        <FieldLabel>Who can rent?</FieldLabel>
        <div className="flex flex-wrap gap-2">
          {whoCanRentOptions.map((option) => {
            const isSelected = form.whoCanRent.includes(option);
            return (
              <button
                key={option}
                type="button"
                onClick={() => onWhoCanRentToggle(option)}
                className={`rounded-full px-4 py-2 font-inter text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 ${
                  isSelected
                    ? "bg-brand-dark text-white"
                    : "border border-[#e5e5e2] bg-white text-brand-dark"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function MediaStep({
  images,
  uploading,
  onUpload,
  onRemove,
}: {
  images: ListingMediaItem[];
  uploading: boolean;
  onUpload: (files: FileList | null) => void;
  onRemove: (publicId: string) => void;
}) {
  const inputId = useId();

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="font-inter text-base font-bold text-brand-dark">Photos & media</h2>
        <p className="mt-1 font-inter text-sm text-[#6b7280]">
          Upload clear photos of the property. The first image becomes the cover photo.
        </p>
      </div>

      <label
        htmlFor={inputId}
        className={`flex min-h-[180px] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-[1.5px] border-dashed border-[#ccccca] bg-[#fafafa] px-4 py-8 text-center transition-colors hover:border-brand-dark/50 ${
          uploading ? "pointer-events-none opacity-60" : ""
        }`}
      >
        <Image
          src="/images/signup/icon-cloud-upload.svg"
          alt=""
          width={28}
          height={28}
          aria-hidden="true"
        />
        <span className="font-inter text-sm font-semibold text-brand-dark">
          {uploading ? "Uploading…" : "Drag & drop or click to upload"}
        </span>
        <span className="font-inter text-xs text-[#6b7280]">
          JPG, PNG up to 10 images
        </span>
        <input
          id={inputId}
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          disabled={uploading}
          onChange={(event) => {
            onUpload(event.target.files);
            event.target.value = "";
          }}
        />
      </label>

      {images.length > 0 ? (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {images.map((image, index) => {
            const src = image.previewUrl || image.secureUrl || "";
            return (
              <li
                key={image.publicId}
                className="relative aspect-square overflow-hidden rounded-lg border border-[#e5e5e2] bg-[#f5f5f3]"
              >
                {src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={src} alt="" className="size-full object-cover" />
                ) : null}
                {index === 0 ? (
                  <span className="absolute top-2 left-2 rounded bg-brand-dark px-2 py-0.5 font-inter text-[10px] font-semibold text-white">
                    Cover
                  </span>
                ) : null}
                <button
                  type="button"
                  onClick={() => onRemove(image.publicId)}
                  className="absolute top-2 right-2 inline-flex size-7 items-center justify-center rounded-full bg-black/70 font-inter text-xs font-bold text-white"
                  aria-label="Remove photo"
                >
                  ×
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

function DetailsStep({
  form,
  onChange,
  onAmenityToggle,
}: {
  form: ListingFormState;
  onChange: (field: keyof ListingFormState, value: string) => void;
  onAmenityToggle: (amenity: string) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-inter text-base font-bold text-brand-dark">Property details</h2>
        <p className="mt-1 font-inter text-sm text-[#6b7280]">
          Add amenities, house rules, and extra details tenants should know.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <FieldLabel htmlFor="beds">Bedrooms</FieldLabel>
          <input
            id="beds"
            type="text"
            inputMode="numeric"
            value={form.beds}
            onChange={(event) => onChange("beds", event.target.value)}
            className="h-11 w-full rounded-lg border border-[#e5e5e2] px-4 font-inter text-sm text-brand-dark outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
          />
        </div>
        <div className="flex flex-col gap-2">
          <FieldLabel htmlFor="baths">Bathrooms</FieldLabel>
          <input
            id="baths"
            type="text"
            inputMode="numeric"
            value={form.baths}
            onChange={(event) => onChange("baths", event.target.value)}
            className="h-11 w-full rounded-lg border border-[#e5e5e2] px-4 font-inter text-sm text-brand-dark outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <FieldLabel>Amenities</FieldLabel>
        <div className="flex flex-wrap gap-2">
          {amenityOptions.map((amenity) => {
            const selected = form.amenities.includes(amenity);
            return (
              <button
                key={amenity}
                type="button"
                onClick={() => onAmenityToggle(amenity)}
                className={`rounded-full px-4 py-2 font-inter text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 ${
                  selected
                    ? "bg-brand-dark text-white"
                    : "border border-[#e5e5e2] bg-white text-brand-dark"
                }`}
              >
                {amenity}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <FieldLabel htmlFor="description">Description</FieldLabel>
        <textarea
          id="description"
          value={form.description}
          onChange={(event) => onChange("description", event.target.value)}
          rows={5}
          placeholder="Describe the property, nearby landmarks, and what makes it special..."
          className="w-full resize-y rounded-lg border border-[#e5e5e2] px-4 py-3 font-inter text-sm text-brand-dark outline-none placeholder:text-[#9ca3af] focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
        />
      </div>

      <div className="flex flex-col gap-2">
        <FieldLabel htmlFor="house-rules">House rules</FieldLabel>
        <textarea
          id="house-rules"
          value={form.houseRules}
          onChange={(event) => onChange("houseRules", event.target.value)}
          rows={4}
          placeholder="e.g. No smoking, guests allowed until 10 PM, pets not allowed..."
          className="w-full resize-y rounded-lg border border-[#e5e5e2] px-4 py-3 font-inter text-sm text-brand-dark outline-none placeholder:text-[#9ca3af] focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
        />
      </div>
    </div>
  );
}

function ReviewStep({ form }: { form: ListingFormState }) {
  const cover = form.images[0]?.previewUrl || form.images[0]?.secureUrl;

  return (
    <div className="flex min-h-[280px] flex-col gap-4 rounded-xl border border-[#e5e5e2] bg-[#fafaf9] px-6 py-8">
      <p className="font-inter text-base font-bold text-brand-dark">Review your listing</p>
      <div className="flex flex-col gap-4 sm:flex-row">
        {cover ? (
          <div className="relative size-28 shrink-0 overflow-hidden rounded-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cover} alt="" className="size-full object-cover" />
          </div>
        ) : null}
        <div className="flex min-w-0 flex-col gap-1.5">
          <p className="font-inter text-sm font-semibold text-brand-dark">
            {form.propertyTitle || "Untitled"}
          </p>
          <p className="font-inter text-sm text-[#6b7280]">
            {form.propertyType} · {form.area || "Area"}, {form.district || "District"} ·{" "}
            {form.division}
          </p>
          <p className="font-inter text-sm text-brand-dark">
            Monthly rent: BDT {form.monthlyRent || "0"}
          </p>
          <p className="font-inter text-sm text-[#6b7280]">
            {form.beds || "0"} bed · {form.baths || "0"} bath · {form.images.length} photo
            {form.images.length === 1 ? "" : "s"}
          </p>
          {form.amenities.length > 0 ? (
            <p className="font-inter text-sm text-[#6b7280]">
              Amenities: {form.amenities.join(", ")}
            </p>
          ) : null}
        </div>
      </div>
      <p className="font-inter text-sm text-[#6b7280]">
        Submit sends this listing to admin verification. Save as Draft keeps it private.
      </p>
    </div>
  );
}

function parseMoney(value: string): number {
  const digits = value.replace(/[^\d]/g, "");
  return Number(digits || "0");
}

function buildPayload(form: ListingFormState, submitForReview: boolean) {
  const images = form.images.map(({ previewUrl: _preview, ...asset }) => asset);
  return {
    title: form.propertyTitle.trim(),
    propertyType: form.propertyType,
    description: form.description.trim() || undefined,
    houseRules: form.houseRules.trim() || undefined,
    address: {
      division: form.division,
      district: form.district.trim(),
      area: form.area.trim(),
    },
    floorLevel: form.floorLevel.trim() || undefined,
    sizeSqft: Number(form.sizeSqft.replace(/[^\d]/g, "") || "0"),
    beds: Number(form.beds.replace(/[^\d]/g, "") || "1"),
    baths: Number(form.baths.replace(/[^\d]/g, "") || "1"),
    monthlyRent: parseMoney(form.monthlyRent),
    availableFrom: form.availableFrom || null,
    whoCanRent: form.whoCanRent,
    amenities: form.amenities,
    images,
    coverImageUrl: form.images[0]?.secureUrl || undefined,
    submitForReview,
  };
}

export function OwnerAddNewListingPage() {
  const router = useRouter();
  const { profile } = useAuth();
  const [activeStep, setActiveStep] = useState(1);
  const [form, setForm] = useState<ListingFormState>(defaultListingForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleFieldChange(field: keyof ListingFormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handlePropertyTypeChange(type: PropertyType) {
    setForm((current) => ({ ...current, propertyType: type }));
  }

  function handleWhoCanRentToggle(option: WhoCanRent) {
    setForm((current) => {
      const isSelected = current.whoCanRent.includes(option);
      const whoCanRent = isSelected
        ? current.whoCanRent.filter((item) => item !== option)
        : [...current.whoCanRent, option];
      return { ...current, whoCanRent };
    });
  }

  function handleAmenityToggle(amenity: string) {
    setForm((current) => {
      const selected = current.amenities.includes(amenity);
      return {
        ...current,
        amenities: selected
          ? current.amenities.filter((item) => item !== amenity)
          : [...current.amenities, amenity],
      };
    });
  }

  async function handleUpload(files: FileList | null) {
    if (!files?.length) return;
    setError(null);
    setUploading(true);
    try {
      const remaining = Math.max(0, 10 - form.images.length);
      const selected = Array.from(files).slice(0, remaining);
      const uploaded: ListingMediaItem[] = [];

      for (const file of selected) {
        const asset = await uploadToCloudinary({
          file,
          folder: "listings/photos",
          resourceType: "image",
        });
        uploaded.push({
          ...asset,
          previewUrl: asset.secureUrl || URL.createObjectURL(file),
        });
      }

      setForm((current) => ({
        ...current,
        images: [...current.images, ...uploaded],
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not upload photos");
    } finally {
      setUploading(false);
    }
  }

  function handleRemoveImage(publicId: string) {
    setForm((current) => ({
      ...current,
      images: current.images.filter((image) => image.publicId !== publicId),
    }));
  }

  async function persist(submitForReview: boolean) {
    setError(null);
    if (!form.propertyTitle.trim()) {
      setError("Property title is required.");
      setActiveStep(1);
      return;
    }
    if (!form.district.trim() || !form.area.trim()) {
      setError("District and area are required.");
      setActiveStep(1);
      return;
    }
    if (!form.whoCanRent.length) {
      setError("Select at least one renter type.");
      setActiveStep(1);
      return;
    }
    if (submitForReview && form.images.length === 0) {
      setError("Add at least one photo before submitting for review.");
      setActiveStep(2);
      return;
    }

    setIsSubmitting(true);
    try {
      await createListing(buildPayload(form, submitForReview));
      router.push(routes.ownerMyListings);
    } catch (err) {
      setError(
        err instanceof ApiError || err instanceof Error
          ? err.message
          : "Could not save listing"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleContinue() {
    if (activeStep === 1) {
      if (!form.propertyTitle.trim() || !form.district.trim() || !form.area.trim()) {
        setError("Fill in title, district, and area before continuing.");
        return;
      }
    }
    setError(null);
    if (activeStep < listingSteps.length) {
      setActiveStep((current) => current + 1);
      return;
    }
    void persist(true);
  }

  function handleSaveDraft() {
    void persist(false);
  }

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-[50px] lg:py-[30px]">
      <div className="flex w-full flex-col gap-8">
        <header className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <h1 className="font-inter text-xl font-bold text-brand-dark">Add New Listing</h1>

          <div className="flex h-10 w-full max-w-[309px] items-center gap-2 rounded-[20px] bg-[#f5f5f3] px-4 xl:mx-auto">
            <Image
              src="/images/owner/icon-search.svg"
              alt=""
              width={14}
              height={14}
              aria-hidden="true"
              className="size-3.5 shrink-0"
            />
            <label className="sr-only" htmlFor="owner-add-listing-search">
              Search listings, tenants, messages
            </label>
            <input
              id="owner-add-listing-search"
              type="search"
              placeholder="Search listings, tenants, messages..."
              className="min-w-0 flex-1 bg-transparent font-inter text-[13px] text-brand-dark outline-none placeholder:text-[#6b7280]"
            />
          </div>

          <div className="flex items-center gap-4 xl:justify-end">
            <button
              type="button"
              aria-label="Notifications"
              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
            >
              <Image
                src="/images/owner/icon-bell.svg"
                alt=""
                width={24}
                height={20}
                aria-hidden="true"
                className="h-5 w-6"
              />
            </button>
            <button
              type="button"
              aria-label="Settings"
              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
            >
              <Image
                src="/images/owner/icon-settings.svg"
                alt=""
                width={20}
                height={20}
                aria-hidden="true"
                className="size-5"
              />
            </button>
            <div className="flex size-9 items-center justify-center rounded-full bg-[#f5f5f3] font-inter text-xs font-bold text-brand-dark">
              {(profile?.fullName || "O").slice(0, 1).toUpperCase()}
            </div>
          </div>
        </header>

        <ListingStepper activeStep={activeStep} />

        <section className="rounded-2xl border border-[#e5e5e2] bg-white p-6 sm:p-8">
          {activeStep === 1 ? (
            <PropertyInfoStep
              form={form}
              onChange={handleFieldChange}
              onPropertyTypeChange={handlePropertyTypeChange}
              onWhoCanRentToggle={handleWhoCanRentToggle}
            />
          ) : null}
          {activeStep === 2 ? (
            <MediaStep
              images={form.images}
              uploading={uploading}
              onUpload={(files) => void handleUpload(files)}
              onRemove={handleRemoveImage}
            />
          ) : null}
          {activeStep === 3 ? (
            <DetailsStep
              form={form}
              onChange={handleFieldChange}
              onAmenityToggle={handleAmenityToggle}
            />
          ) : null}
          {activeStep === 4 ? <ReviewStep form={form} /> : null}

          {error ? (
            <p role="alert" className="mt-4 font-inter text-sm font-medium text-red-600">
              {error}
            </p>
          ) : null}

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-[#e5e5e2] pt-6 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              disabled={isSubmitting || activeStep === 1}
              onClick={() => {
                setError(null);
                setActiveStep((current) => Math.max(1, current - 1));
              }}
              className="inline-flex h-11 items-center justify-center rounded-lg px-4 font-inter text-sm font-semibold text-brand-dark/70 disabled:opacity-40"
            >
              ← Back
            </button>
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                disabled={isSubmitting || uploading}
                onClick={handleSaveDraft}
                className="inline-flex h-11 items-center justify-center rounded-lg border border-brand-dark px-6 font-inter text-sm font-semibold text-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 disabled:opacity-60"
              >
                {isSubmitting ? "Saving…" : "Save as Draft"}
              </button>
              <button
                type="button"
                disabled={isSubmitting || uploading}
                onClick={handleContinue}
                className="inline-flex h-11 items-center justify-center rounded-lg bg-brand-dark px-6 font-inter text-sm font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 disabled:opacity-60"
              >
                {isSubmitting
                  ? "Submitting…"
                  : activeStep === listingSteps.length
                    ? "Submit Listing"
                    : stepContinueLabels[activeStep]}
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
