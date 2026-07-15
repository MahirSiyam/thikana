"use client";

import Image from "next/image";
import { useState } from "react";
import {
  areas,
  defaultListingForm,
  districts,
  divisions,
  listingSteps,
  propertyTypes,
  stepContinueLabels,
  stepPlaceholderCopy,
  whoCanRentOptions,
} from "@/features/owner-add-new-listing/data/owner-add-new-listing.mock";
import type {
  ListingFormState,
  PropertyType,
  WhoCanRent,
} from "@/features/owner-add-new-listing/types/owner-add-new-listing.types";
import { ownerUser } from "@/features/owner/data/owner.mock";

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
        <SelectField
          id="district"
          label="District"
          value={form.district}
          options={districts}
          onChange={(value) => onChange("district", value)}
        />
        <SelectField
          id="area"
          label="Area"
          value={form.area}
          options={areas}
          onChange={(value) => onChange("area", value)}
        />
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

function StepPlaceholder({ stepId }: { stepId: number }) {
  const copy = stepPlaceholderCopy[stepId];
  if (!copy) return null;

  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-[#e5e5e2] bg-[#fafaf9] px-6 py-12 text-center">
      <p className="font-inter text-base font-bold text-brand-dark">{copy.title}</p>
      <p className="max-w-md font-inter text-sm text-[#6b7280]">{copy.description}</p>
    </div>
  );
}

export function OwnerAddNewListingPage() {
  const [activeStep, setActiveStep] = useState(1);
  const [form, setForm] = useState<ListingFormState>(defaultListingForm);

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

  function handleContinue() {
    if (activeStep < listingSteps.length) {
      setActiveStep((current) => current + 1);
    }
  }

  function handleSaveDraft() {
    // Local-only draft save — no API
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
            <div className="relative size-9 overflow-hidden rounded-full">
              <Image
                src={ownerUser.topbarAvatarSrc}
                alt=""
                fill
                className="object-cover"
                sizes="36px"
              />
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
          ) : (
            <StepPlaceholder stepId={activeStep} />
          )}

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-[#e5e5e2] pt-6 sm:flex-row sm:items-center sm:justify-end">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="inline-flex h-11 items-center justify-center rounded-lg border border-brand-dark px-6 font-inter text-sm font-semibold text-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
            >
              Save as Draft
            </button>
            <button
              type="button"
              onClick={handleContinue}
              className="inline-flex h-11 items-center justify-center rounded-lg bg-brand-dark px-6 font-inter text-sm font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
            >
              {stepContinueLabels[activeStep]}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
