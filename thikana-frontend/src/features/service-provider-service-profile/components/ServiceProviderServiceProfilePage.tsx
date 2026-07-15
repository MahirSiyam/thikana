"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { serviceProviderUser } from "@/features/service-provider/data/service-provider.mock";
import {
  serviceProfileCategories,
  serviceProviderServiceProfile,
} from "@/features/service-provider-service-profile/data/service-provider-service-profile.mock";
import type {
  ServiceProfileCategoryId,
  ServiceProfilePricingItem,
  ServiceProfileSecurityRow,
  ServiceProfileVerificationItem,
} from "@/features/service-provider-service-profile/types/service-provider-service-profile.types";

function VerificationRow({ item }: { item: ServiceProfileVerificationItem }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="font-inter text-[13px] font-semibold text-brand-dark">
        {item.label}
      </span>
      {item.verified ? (
        <span className="inline-flex rounded-full bg-[#dcfce7] px-2 py-1 font-inter text-[11px] font-semibold text-[#16a34a]">
          ✓ Verified
        </span>
      ) : null}
    </div>
  );
}

function SecurityRowBox({
  row,
  onEdit,
}: {
  row: ServiceProfileSecurityRow;
  onEdit: (id: string) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-[#e5e5e2] px-4 py-3">
      <div className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
        <p className="w-full shrink-0 font-inter text-[13px] font-semibold text-brand-dark sm:w-[120px]">
          {row.label}
        </p>
        {row.badge === "enabled" ? (
          <span className="inline-flex w-fit rounded-full bg-[#dcfce7] px-2 py-1 font-inter text-[11px] font-semibold text-[#16a34a]">
            {row.value}
          </span>
        ) : (
          <p className="min-w-0 font-inter text-[13px] text-[#6b7280]">{row.value}</p>
        )}
      </div>
      <button
        type="button"
        onClick={() => onEdit(row.id)}
        className="shrink-0 font-inter text-[13px] font-semibold text-brand-dark underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
      >
        Edit
      </button>
    </div>
  );
}

export function ServiceProviderServiceProfilePage() {
  const formId = useId();
  const initial = serviceProviderServiceProfile;

  const [displayName, setDisplayName] = useState(initial.displayName);
  const [categories, setCategories] = useState<ServiceProfileCategoryId[]>(
    initial.categories,
  );
  const [yearsOfExperience, setYearsOfExperience] = useState(
    initial.yearsOfExperience,
  );
  const [serviceAreas, setServiceAreas] = useState<string[]>(initial.serviceAreas);
  const [shortBio, setShortBio] = useState(initial.shortBio);
  const [pricingItems, setPricingItems] = useState<ServiceProfilePricingItem[]>(
    initial.pricingItems,
  );
  const [availabilityDays, setAvailabilityDays] = useState(
    initial.availabilityDays,
  );
  const [workingHoursStart, setWorkingHoursStart] = useState(
    initial.workingHoursStart,
  );
  const [workingHoursEnd, setWorkingHoursEnd] = useState(initial.workingHoursEnd);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  function showStatus(message: string) {
    setStatusMessage(message);
    window.setTimeout(() => setStatusMessage(null), 2500);
  }

  function toggleCategory(id: ServiceProfileCategoryId) {
    setCategories((current) =>
      current.includes(id)
        ? current.length > 1
          ? current.filter((item) => item !== id)
          : current
        : [...current, id],
    );
  }

  function removeServiceArea(area: string) {
    setServiceAreas((current) => current.filter((item) => item !== area));
  }

  function toggleAvailabilityDay(id: string) {
    setAvailabilityDays((current) =>
      current.map((day) =>
        day.id === id ? { ...day, active: !day.active } : day,
      ),
    );
  }

  function handleAddService() {
    const nextIndex = pricingItems.length + 1;
    setPricingItems((current) => [
      ...current,
      {
        id: `new-service-${nextIndex}`,
        name: "New Service",
        price: 0,
      },
    ]);
    showStatus("New service row added.");
  }

  function handlePricingChange(
    id: string,
    field: "name" | "price",
    value: string,
  ) {
    setPricingItems((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: field === "price" ? Number(value) || 0 : value,
            }
          : item,
      ),
    );
  }

  function handleSave() {
    showStatus("Changes saved locally.");
  }

  function handleCancel() {
    setDisplayName(initial.displayName);
    setCategories(initial.categories);
    setYearsOfExperience(initial.yearsOfExperience);
    setServiceAreas(initial.serviceAreas);
    setShortBio(initial.shortBio);
    setPricingItems(initial.pricingItems);
    setAvailabilityDays(initial.availabilityDays);
    setWorkingHoursStart(initial.workingHoursStart);
    setWorkingHoursEnd(initial.workingHoursEnd);
    showStatus("Changes discarded.");
  }

  function handleSecurityEdit(id: string) {
    const labels: Record<string, string> = {
      email: "email",
      phone: "phone number",
      password: "password",
      "2fa": "two-factor authentication",
      notifications: "notification preferences",
    };
    showStatus(`Edit ${labels[id] ?? "setting"} — coming soon.`);
  }

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-[50px] lg:py-[30px]">
      <div className="flex w-full flex-col gap-8 lg:gap-10">
        <header className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <h1 className="font-inter text-xl font-bold text-brand-dark">Profile</h1>

          <div className="flex h-10 w-full max-w-[309px] items-center gap-2 rounded-[20px] bg-[#f5f5f3] px-4">
            <Image
              src="/images/service-provider/icon-search.svg"
              alt=""
              width={16}
              height={16}
              aria-hidden="true"
              className="size-4 shrink-0"
            />
            <label className="sr-only" htmlFor={`${formId}-search`}>
              Search service profile
            </label>
            <input
              id={`${formId}-search`}
              type="search"
              placeholder="Search..."
              className="min-w-0 flex-1 bg-transparent font-inter text-[13px] text-brand-dark outline-none placeholder:text-[#6b7280]"
            />
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              aria-label="Notifications"
              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
            >
              <Image
                src="/images/service-provider/icon-bell.svg"
                alt=""
                width={24}
                height={24}
                aria-hidden="true"
                className="size-6"
              />
            </button>
            <button
              type="button"
              aria-label="Settings"
              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
            >
              <Image
                src="/images/service-provider/icon-settings.svg"
                alt=""
                width={24}
                height={24}
                aria-hidden="true"
                className="size-6"
              />
            </button>
            <div className="relative size-9 overflow-hidden rounded-full">
              <Image
                src={serviceProviderUser.topbarAvatarSrc}
                alt=""
                fill
                className="object-cover"
                sizes="36px"
              />
            </div>
          </div>
        </header>

        {statusMessage ? (
          <p
            role="status"
            className="rounded-lg border border-[#e5e5e2] bg-[#f5f5f3] px-4 py-2 font-inter text-[13px] text-brand-dark"
          >
            {statusMessage}
          </p>
        ) : null}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <section className="flex flex-col gap-6 rounded-2xl border border-[#e5e5e2] bg-white p-6">
            <h2 className="font-inter text-base font-bold text-brand-dark">
              Basic Information
            </h2>

            <div className="flex flex-col items-center gap-2 sm:items-start">
              <div className="relative size-24">
                <div className="relative size-24 overflow-hidden rounded-full">
                  <Image
                    src={initial.avatarSrc}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
                <button
                  type="button"
                  aria-label="Change profile photo"
                  onClick={() => showStatus("Change profile photo — coming soon.")}
                  className="absolute bottom-0 right-0 flex size-8 items-center justify-center rounded-full border-2 border-white bg-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
                >
                  <Image
                    src="/images/tenant/icon-camera.svg"
                    alt=""
                    width={14}
                    height={14}
                    aria-hidden="true"
                    className="size-3.5"
                  />
                </button>
              </div>
              <p className="font-inter text-xs text-[#6b7280]">
                JPG or PNG. Max size of 800K.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor={`${formId}-display-name`}
                className="font-inter text-[13px] font-semibold text-brand-dark"
              >
                Display Name
              </label>
              <input
                id={`${formId}-display-name`}
                type="text"
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                className="h-[52px] w-full rounded-[10px] border border-[#e5e5e2] bg-white px-4 font-inter text-[15px] text-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
              />
            </div>

            <fieldset className="flex flex-col gap-2">
              <legend className="font-inter text-[13px] font-semibold text-brand-dark">
                Service Category
              </legend>
              <div className="flex flex-wrap gap-2.5">
                {serviceProfileCategories.map((option) => {
                  const selected = categories.includes(option.id);
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => toggleCategory(option.id)}
                      aria-pressed={selected}
                      className={`inline-flex items-center rounded-[10px] px-4 py-2.5 font-inter text-[13px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 ${
                        selected
                          ? "bg-brand-dark text-white"
                          : "border border-[#e5e5e2] bg-white text-[#6b7280] hover:border-brand-dark/30"
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
                className="font-inter text-[13px] font-semibold text-brand-dark"
              >
                Years of Experience
              </label>
              <input
                id={`${formId}-experience`}
                type="text"
                inputMode="numeric"
                value={yearsOfExperience}
                onChange={(event) => setYearsOfExperience(event.target.value)}
                className="h-[52px] w-full rounded-[10px] border border-[#e5e5e2] bg-white px-4 font-inter text-[15px] text-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
              />
            </div>

            <div className="flex flex-col gap-2">
              <p className="font-inter text-[13px] font-semibold text-brand-dark">
                Service Areas
              </p>
              <div className="flex min-h-[52px] flex-wrap items-center gap-2 rounded-[10px] border border-[#e5e5e2] bg-white p-2">
                {serviceAreas.map((area) => (
                  <span
                    key={area}
                    className="inline-flex items-center gap-1 rounded-md bg-[#f0f0ed] px-2.5 py-1.5 font-inter text-[13px]"
                  >
                    <span className="font-semibold text-brand-dark">{area}</span>
                    <button
                      type="button"
                      aria-label={`Remove ${area}`}
                      onClick={() => removeServiceArea(area)}
                      className="text-[#6b7280] transition-opacity hover:opacity-70"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor={`${formId}-bio`}
                className="font-inter text-[13px] font-semibold text-brand-dark"
              >
                Short Bio
              </label>
              <div className="relative">
                <textarea
                  id={`${formId}-bio`}
                  value={shortBio}
                  maxLength={initial.bioMaxLength}
                  onChange={(event) => setShortBio(event.target.value)}
                  rows={4}
                  className="min-h-[100px] w-full resize-none rounded-[10px] border border-[#e5e5e2] bg-white p-4 pb-8 font-inter text-sm text-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
                />
                <span className="pointer-events-none absolute right-4 bottom-3 font-inter text-xs text-[#9b9b98]">
                  {shortBio.length} / {initial.bioMaxLength}
                </span>
              </div>
            </div>
          </section>

          <div className="flex flex-col gap-6">
            <section className="flex flex-col gap-5 rounded-2xl border border-[#e5e5e2] bg-white p-6">
              <h2 className="font-inter text-base font-bold text-brand-dark">
                Verification Status
              </h2>
              <div className="flex flex-col gap-4">
                {initial.verificationItems.map((item) => (
                  <VerificationRow key={item.id} item={item} />
                ))}
              </div>
              {initial.allVerified ? (
                <div className="flex justify-center pt-1">
                  <span className="inline-flex items-center gap-2 rounded-full bg-brand-dark px-4 py-2 font-inter text-[11px] font-semibold text-white">
                    <Image
                      src="/images/service-provider/icon-star.svg"
                      alt=""
                      width={14}
                      height={14}
                      aria-hidden="true"
                      className="size-3.5 brightness-0 invert"
                    />
                    Verified Badge Earned
                  </span>
                </div>
              ) : null}
            </section>

            <section className="flex flex-col gap-4 rounded-2xl border border-[#e5e5e2] bg-white p-6">
              <h2 className="font-inter text-base font-bold text-brand-dark">
                Account & Security
              </h2>
              <div className="flex flex-col gap-3">
                {initial.securityRows.map((row) => (
                  <SecurityRowBox
                    key={row.id}
                    row={row}
                    onEdit={handleSecurityEdit}
                  />
                ))}
              </div>
            </section>
          </div>
        </div>

        <section className="flex flex-col gap-4 rounded-2xl border border-[#e5e5e2] bg-white p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-inter text-base font-bold text-brand-dark">
              Pricing List
            </h2>
            <button
              type="button"
              onClick={handleAddService}
              className="w-fit rounded-lg border border-brand-dark px-4 py-2 font-inter text-[13px] font-semibold text-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
            >
              + Add Service
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[#e5e5e2]">
                  <th className="px-4 py-3 font-inter text-[11px] font-semibold uppercase text-[#6b7280]">
                    Service
                  </th>
                  <th className="px-4 py-3 text-right font-inter text-[11px] font-semibold uppercase text-[#6b7280]">
                    Price (BDT)
                  </th>
                </tr>
              </thead>
              <tbody>
                {pricingItems.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`border-b border-[#f0f0ee] last:border-b-0 ${
                      index % 2 === 1 ? "bg-[#fafafa]" : "bg-white"
                    }`}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(event) =>
                          handlePricingChange(item.id, "name", event.target.value)
                        }
                        aria-label={`Service name for row ${index + 1}`}
                        className="w-full bg-transparent font-inter text-[13px] font-semibold text-brand-dark outline-none"
                      />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <input
                        type="number"
                        min={0}
                        value={item.price}
                        onChange={(event) =>
                          handlePricingChange(item.id, "price", event.target.value)
                        }
                        aria-label={`Price for ${item.name}`}
                        className="w-24 bg-transparent text-right font-inter text-[13px] font-semibold text-brand-dark outline-none"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="flex flex-col gap-6 rounded-2xl border border-[#e5e5e2] bg-white p-6">
          <h2 className="font-inter text-base font-bold text-brand-dark">
            Availability
          </h2>

          <div className="flex flex-col gap-4">
            <p className="font-inter text-[13px] font-semibold text-brand-dark">
              Working Days
            </p>
            <div className="flex flex-wrap gap-3">
              {availabilityDays.map((day) => (
                <button
                  key={day.id}
                  type="button"
                  aria-pressed={day.active}
                  aria-label={`${day.label} ${day.active ? "active" : "inactive"}`}
                  onClick={() => toggleAvailabilityDay(day.id)}
                  className={`flex size-12 items-center justify-center rounded-full font-inter text-[11px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 ${
                    day.active
                      ? "bg-brand-dark text-white"
                      : "border border-[#e5e5e2] bg-white text-[#6b7280]"
                  }`}
                >
                  {day.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
            <p className="font-inter text-[13px] font-semibold text-brand-dark sm:pb-3">
              Working Hours
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <input
                id={`${formId}-hours-start`}
                type="text"
                value={workingHoursStart}
                onChange={(event) => setWorkingHoursStart(event.target.value)}
                aria-label="Working hours start"
                className="h-[52px] w-full min-w-[140px] rounded-[10px] border border-[#e5e5e2] bg-white px-4 font-inter text-[15px] text-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 sm:w-auto"
              />
              <span className="font-inter text-sm text-[#6b7280]">–</span>
              <input
                id={`${formId}-hours-end`}
                type="text"
                value={workingHoursEnd}
                onChange={(event) => setWorkingHoursEnd(event.target.value)}
                aria-label="Working hours end"
                className="h-[52px] w-full min-w-[140px] rounded-[10px] border border-[#e5e5e2] bg-white px-4 font-inter text-[15px] text-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 sm:w-auto"
              />
            </div>
          </div>
        </section>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:gap-4">
          <button
            type="button"
            onClick={handleCancel}
            className="font-inter text-[13px] font-semibold text-[#6b7280] underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex h-[52px] w-full items-center justify-center rounded-[10px] bg-brand-dark px-6 font-inter text-[15px] font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 sm:w-auto"
          >
            Save Changes
          </button>
        </div>

        <section className="flex flex-col gap-6 rounded-2xl border border-[#fc8181] bg-white p-6">
          <h2 className="font-inter text-base font-bold text-[#dc2626]">Danger Zone</h2>
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 flex-col gap-1">
                <p className="font-inter text-sm font-bold text-brand-dark">
                  Deactivate Account
                </p>
                <p className="font-inter text-xs text-[#6b7280]">
                  Temporarily hide your profile and stop receiving job requests.
                </p>
              </div>
              <button
                type="button"
                onClick={() => showStatus("Deactivate account — coming soon.")}
                className="w-fit shrink-0 rounded-lg border border-[#dc2626] px-4 py-2 font-inter text-xs font-bold text-[#dc2626] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dc2626] focus-visible:ring-offset-2"
              >
                Deactivate
              </button>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 flex-col gap-1">
                <p className="font-inter text-sm font-bold text-brand-dark">
                  Delete Permanently
                </p>
                <p className="font-inter text-xs text-[#6b7280]">
                  Permanently delete your profile and all service history.
                </p>
              </div>
              <button
                type="button"
                onClick={() => showStatus("Delete permanently — coming soon.")}
                className="w-fit shrink-0 rounded-lg bg-[#dc2626] px-4 py-2 font-inter text-xs font-bold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dc2626] focus-visible:ring-offset-2"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
