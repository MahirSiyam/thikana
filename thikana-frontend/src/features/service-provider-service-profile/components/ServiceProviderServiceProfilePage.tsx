"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { ProfilePhotoCropDialog } from "@/components/ui/ProfilePhotoCropDialog";
import { ProviderTopbar } from "@/features/service-provider/components/ProviderTopbar";
import { errorMessage } from "@/features/service-provider/lib/format";
import {
  deactivateAccount,
  getFullProfile,
  updateProfile,
  type FullProfile,
} from "@/lib/api/profile";
import { SERVICE_CATEGORY_LABELS, type ServiceCategory } from "@/lib/api/provider";
import { uploadToCloudinary } from "@/lib/api/uploads";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useDashboardSignOut } from "@/lib/auth/use-dashboard-sign-out";

const BIO_MAX_LENGTH = 200;

const CATEGORY_OPTIONS = Object.entries(SERVICE_CATEGORY_LABELS) as [
  ServiceCategory,
  string,
][];

const DAY_OPTIONS = [
  { id: "mon", label: "Mon" },
  { id: "tue", label: "Tue" },
  { id: "wed", label: "Wed" },
  { id: "thu", label: "Thu" },
  { id: "fri", label: "Fri" },
  { id: "sat", label: "Sat" },
  { id: "sun", label: "Sun" },
] as const;

type DayId = (typeof DAY_OPTIONS)[number]["id"];

type PricingRow = { key: string; name: string; priceBdt: number };

type ProfileForm = {
  fullName: string;
  serviceCategory: ServiceCategory;
  yearsOfExperience: string;
  serviceAreas: string[];
  bio: string;
  pricingItems: PricingRow[];
  availabilityDays: DayId[];
  workingHoursStart: string;
  workingHoursEnd: string;
};

const toForm = (profile: FullProfile): ProfileForm => ({
  fullName: profile.fullName || "",
  serviceCategory:
    (profile.serviceProvider?.serviceCategory as ServiceCategory) ||
    "electrician",
  yearsOfExperience: profile.serviceProvider?.yearsOfExperience || "",
  serviceAreas: profile.serviceProvider?.serviceAreas || [],
  bio: profile.serviceProvider?.bio || "",
  pricingItems: (profile.serviceProvider?.pricingItems || []).map((item) => ({
    key: item.id,
    name: item.name,
    priceBdt: item.priceBdt,
  })),
  availabilityDays: (profile.serviceProvider?.availabilityDays ||
    []) as DayId[],
  workingHoursStart: profile.serviceProvider?.workingHours?.start || "09:00",
  workingHoursEnd: profile.serviceProvider?.workingHours?.end || "18:00",
});

function VerificationRow({
  label,
  verified,
}: {
  label: string;
  verified: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="font-inter text-[13px] font-semibold text-brand-dark">
        {label}
      </span>
      <span
        className={`inline-flex rounded-full px-2 py-1 font-inter text-[11px] font-semibold ${
          verified
            ? "bg-[#dcfce7] text-[#16a34a]"
            : "bg-[#fef3c7] text-[#f59e0b]"
        }`}
      >
        {verified ? "✓ Verified" : "Pending"}
      </span>
    </div>
  );
}

function SecurityRowBox({
  label,
  value,
  badge,
}: {
  label: string;
  value: string;
  badge?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-[#e5e5e2] px-4 py-3">
      <div className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
        <p className="w-full shrink-0 font-inter text-[13px] font-semibold text-brand-dark sm:w-[120px]">
          {label}
        </p>
        {badge ? (
          <span className="inline-flex w-fit rounded-full bg-[#dcfce7] px-2 py-1 font-inter text-[11px] font-semibold text-[#16a34a]">
            {value}
          </span>
        ) : (
          <p className="min-w-0 truncate font-inter text-[13px] text-[#6b7280]">
            {value}
          </p>
        )}
      </div>
    </div>
  );
}

export function ServiceProviderServiceProfilePage() {
  const formId = useId();
  const { refreshProfile } = useAuth();
  const { signOutUser } = useDashboardSignOut({ scope: "user" });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<FullProfile | null>(null);
  const [form, setForm] = useState<ProfileForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [areaDraft, setAreaDraft] = useState("");
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [deactivating, setDeactivating] = useState(false);

  const showStatus = (message: string) => {
    setStatus(message);
    window.setTimeout(() => setStatus(null), 2500);
  };

  const load = useCallback(async () => {
    try {
      const data = await getFullProfile();
      setProfile(data);
      setForm(toForm(data));
      setError(null);
    } catch (caught) {
      setError(errorMessage(caught, "Could not load your profile"));
    }
  }, []);

  useEffect(() => {
    let active = true;
    void load().finally(() => {
      if (active) setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [load]);

  const patch = (changes: Partial<ProfileForm>) =>
    setForm((current) => (current ? { ...current, ...changes } : current));

  const closeCropper = () => {
    if (cropSrc) URL.revokeObjectURL(cropSrc);
    setCropSrc(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const openCropper = (file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file (JPG, PNG, or WebP).");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError("Image must be under 8MB.");
      return;
    }
    setError(null);
    if (cropSrc) URL.revokeObjectURL(cropSrc);
    setCropSrc(URL.createObjectURL(file));
  };

  const uploadCroppedPhoto = async (file: File) => {
    setUploadingPhoto(true);
    setError(null);
    try {
      const uploaded = await uploadToCloudinary({
        file,
        folder: "profile/avatar",
      });
      const updated = await updateProfile({
        profileImage: {
          publicId: uploaded.publicId,
          resourceType: uploaded.resourceType || "image",
          format: uploaded.format || "jpg",
          bytes: uploaded.bytes,
          uploadedAt: uploaded.uploadedAt,
          secureUrl: (uploaded as { secureUrl?: string }).secureUrl,
        },
      });
      setProfile(updated);
      await refreshProfile();
      closeCropper();
      showStatus("Profile photo updated.");
    } catch (caught) {
      setError(errorMessage(caught, "Could not update profile photo"));
    } finally {
      setUploadingPhoto(false);
    }
  };

  const save = async () => {
    if (!form) return;
    if (!form.fullName.trim()) {
      setError("Display name is required.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const updated = await updateProfile({
        fullName: form.fullName.trim(),
        serviceCategory: form.serviceCategory,
        yearsOfExperience: form.yearsOfExperience.trim(),
        serviceAreas: form.serviceAreas,
        bio: form.bio.trim(),
        pricingItems: form.pricingItems
          .filter((item) => item.name.trim())
          .map((item) => ({
            name: item.name.trim(),
            priceBdt: Number(item.priceBdt) || 0,
          })),
        availabilityDays: form.availabilityDays,
        workingHours: {
          start: form.workingHoursStart,
          end: form.workingHoursEnd,
        },
      });
      setProfile(updated);
      setForm(toForm(updated));
      await refreshProfile();
      showStatus("Profile saved.");
    } catch (caught) {
      setError(errorMessage(caught, "Could not save your profile"));
    } finally {
      setSaving(false);
    }
  };

  const deactivate = async () => {
    if (
      !window.confirm(
        "Deactivate your account? Your profile will be hidden and you will stop receiving job requests."
      )
    ) {
      return;
    }
    setDeactivating(true);
    setError(null);
    try {
      await deactivateAccount();
      await signOutUser();
    } catch (caught) {
      setError(errorMessage(caught, "Could not deactivate your account"));
      setDeactivating(false);
    }
  };

  if (loading) {
    return (
      <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-[50px] lg:py-[30px]">
        <p className="rounded-2xl border border-[#e5e5e2] bg-white p-6 font-inter text-sm text-[#6b7280]">
          Loading your profile…
        </p>
      </div>
    );
  }

  if (!profile || !form) {
    return (
      <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-[50px] lg:py-[30px]">
        <p className="rounded-2xl border border-[#fecaca] bg-[#fef2f2] p-6 font-inter text-sm text-[#b91c1c]">
          {error || "Could not load your profile."}
        </p>
      </div>
    );
  }

  const allVerified = profile.allVerified;

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-[50px] lg:py-[30px]">
      <div className="flex w-full flex-col gap-6 sm:gap-8 lg:gap-10">
        <ProviderTopbar
          title="Profile"
          searchId={`${formId}-search`}
          searchLabel="Search service profile"
        />

        {status ? (
          <p
            role="status"
            className="rounded-lg border border-[#e5e5e2] bg-[#f5f5f3] px-4 py-2 font-inter text-[13px] text-brand-dark"
          >
            {status}
          </p>
        ) : null}

        {error ? (
          <p className="rounded-lg border border-[#fecaca] bg-[#fef2f2] px-4 py-2 font-inter text-[13px] text-[#b91c1c]">
            {error}
          </p>
        ) : null}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <section className="flex flex-col gap-5 rounded-2xl border border-[#e5e5e2] bg-white p-4 sm:gap-6 sm:p-6">
            <h2 className="font-inter text-base font-bold text-brand-dark">
              Basic Information
            </h2>

            <div className="flex flex-col items-center gap-2 sm:items-start">
              <div className="relative size-24">
                {profile.avatarUrl ? (
                  <div className="relative size-24 overflow-hidden rounded-full">
                    <Image
                      src={profile.avatarUrl}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>
                ) : (
                  <div className="flex size-24 items-center justify-center rounded-full bg-[#f0f0ed] font-outfit text-2xl font-bold text-[#6b7280]">
                    {(profile.fullName || profile.email)
                      .slice(0, 1)
                      .toUpperCase()}
                  </div>
                )}
                <button
                  type="button"
                  aria-label="Change profile photo"
                  disabled={uploadingPhoto}
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 flex size-8 items-center justify-center rounded-full border-2 border-white bg-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 disabled:opacity-60"
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
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) =>
                    openCropper(event.target.files?.[0] ?? null)
                  }
                />
              </div>
              <p className="font-inter text-xs text-[#6b7280]">
                JPG or PNG. Max size of 8MB.
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
                value={form.fullName}
                onChange={(event) => patch({ fullName: event.target.value })}
                className="h-12 w-full rounded-[10px] border border-[#e5e5e2] bg-white px-4 font-inter text-sm text-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 sm:h-[52px] sm:text-[15px]"
              />
            </div>

            <fieldset className="flex flex-col gap-2">
              <legend className="font-inter text-[13px] font-semibold text-brand-dark">
                Service Category
              </legend>
              <div className="flex flex-wrap gap-2 sm:gap-2.5">
                {CATEGORY_OPTIONS.map(([id, label]) => {
                  const selected = form.serviceCategory === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => patch({ serviceCategory: id })}
                      aria-pressed={selected}
                      className={`inline-flex items-center rounded-[10px] px-3 py-2 font-inter text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 sm:px-4 sm:py-2.5 sm:text-[13px] ${
                        selected
                          ? "bg-brand-dark text-white"
                          : "border border-[#e5e5e2] bg-white text-[#6b7280] hover:border-brand-dark/30"
                      }`}
                    >
                      {label}
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
                value={form.yearsOfExperience}
                onChange={(event) =>
                  patch({ yearsOfExperience: event.target.value })
                }
                className="h-12 w-full rounded-[10px] border border-[#e5e5e2] bg-white px-4 font-inter text-sm text-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 sm:h-[52px] sm:text-[15px]"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor={`${formId}-area`}
                className="font-inter text-[13px] font-semibold text-brand-dark"
              >
                Service Areas
              </label>
              <div className="flex min-h-[52px] flex-wrap items-center gap-2 rounded-[10px] border border-[#e5e5e2] bg-white p-2">
                {form.serviceAreas.map((area) => (
                  <span
                    key={area}
                    className="inline-flex items-center gap-1 rounded-md bg-[#f0f0ed] px-2.5 py-1.5 font-inter text-[13px]"
                  >
                    <span className="font-semibold text-brand-dark">
                      {area}
                    </span>
                    <button
                      type="button"
                      aria-label={`Remove ${area}`}
                      onClick={() =>
                        patch({
                          serviceAreas: form.serviceAreas.filter(
                            (item) => item !== area
                          ),
                        })
                      }
                      className="text-[#6b7280] transition-opacity hover:opacity-70"
                    >
                      ×
                    </button>
                  </span>
                ))}
                <input
                  id={`${formId}-area`}
                  type="text"
                  value={areaDraft}
                  placeholder="Add area…"
                  onChange={(event) => setAreaDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key !== "Enter") return;
                    event.preventDefault();
                    const value = areaDraft.trim();
                    if (!value || form.serviceAreas.includes(value)) return;
                    patch({ serviceAreas: [...form.serviceAreas, value] });
                    setAreaDraft("");
                  }}
                  className="min-w-[120px] flex-1 bg-transparent px-1 font-inter text-[13px] text-brand-dark outline-none placeholder:text-[#9b9b98]"
                />
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
                  value={form.bio}
                  maxLength={BIO_MAX_LENGTH}
                  onChange={(event) => patch({ bio: event.target.value })}
                  rows={4}
                  className="min-h-[100px] w-full resize-none rounded-[10px] border border-[#e5e5e2] bg-white p-4 pb-8 font-inter text-sm text-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
                />
                <span className="pointer-events-none absolute bottom-3 right-4 font-inter text-xs text-[#9b9b98]">
                  {form.bio.length} / {BIO_MAX_LENGTH}
                </span>
              </div>
            </div>
          </section>

          <div className="flex flex-col gap-6">
            <section className="flex flex-col gap-4 rounded-2xl border border-[#e5e5e2] bg-white p-4 sm:gap-5 sm:p-6">
              <h2 className="font-inter text-base font-bold text-brand-dark">
                Verification Status
              </h2>
              <div className="flex flex-col gap-4">
                {profile.verificationItems.map((item) => (
                  <VerificationRow
                    key={item.id}
                    label={item.label}
                    verified={item.verified}
                  />
                ))}
                <VerificationRow
                  label="Trade Certificate"
                  verified={Boolean(profile.serviceProvider?.tradeCertificateUrl)}
                />
                <VerificationRow
                  label="Admin Approval"
                  verified={profile.approvalStatus === "approved"}
                />
              </div>
              {allVerified ? (
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

            <section className="flex flex-col gap-4 rounded-2xl border border-[#e5e5e2] bg-white p-4 sm:p-6">
              <h2 className="font-inter text-base font-bold text-brand-dark">
                Account &amp; Security
              </h2>
              <div className="flex flex-col gap-3">
                <SecurityRowBox label="Email" value={profile.email} />
                <SecurityRowBox
                  label="Phone"
                  value={profile.phone || "Not added"}
                />
                <SecurityRowBox
                  label="Email Status"
                  value={profile.emailVerified ? "Verified" : "Not verified"}
                  badge={profile.emailVerified}
                />
                <SecurityRowBox
                  label="Member Since"
                  value={profile.memberSince}
                />
                <SecurityRowBox label="Location" value={profile.location} />
              </div>
            </section>
          </div>
        </div>

        <section className="flex flex-col gap-4 rounded-2xl border border-[#e5e5e2] bg-white p-4 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-inter text-base font-bold text-brand-dark">
              Pricing List
            </h2>
            <button
              type="button"
              onClick={() =>
                patch({
                  pricingItems: [
                    ...form.pricingItems,
                    {
                      key: `new-${Date.now()}`,
                      name: "",
                      priceBdt: 0,
                    },
                  ],
                })
              }
              className="w-fit rounded-lg border border-brand-dark px-4 py-2 font-inter text-[13px] font-semibold text-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
            >
              + Add Service
            </button>
          </div>

          {form.pricingItems.length === 0 ? (
            <p className="font-inter text-[13px] text-[#6b7280]">
              No services listed yet. Add one so tenants know your rates.
            </p>
          ) : (
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
                    <th className="w-16 px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {form.pricingItems.map((item, index) => (
                    <tr
                      key={item.key}
                      className={`border-b border-[#f0f0ee] last:border-b-0 ${
                        index % 2 === 1 ? "bg-[#fafafa]" : "bg-white"
                      }`}
                    >
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={item.name}
                          placeholder="Service name"
                          onChange={(event) =>
                            patch({
                              pricingItems: form.pricingItems.map((row) =>
                                row.key === item.key
                                  ? { ...row, name: event.target.value }
                                  : row
                              ),
                            })
                          }
                          aria-label={`Service name for row ${index + 1}`}
                          className="w-full bg-transparent font-inter text-[13px] font-semibold text-brand-dark outline-none placeholder:font-normal placeholder:text-[#9b9b98]"
                        />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <input
                          type="number"
                          min={0}
                          value={item.priceBdt}
                          onChange={(event) =>
                            patch({
                              pricingItems: form.pricingItems.map((row) =>
                                row.key === item.key
                                  ? {
                                      ...row,
                                      priceBdt: Number(event.target.value) || 0,
                                    }
                                  : row
                              ),
                            })
                          }
                          aria-label={`Price for row ${index + 1}`}
                          className="w-24 bg-transparent text-right font-inter text-[13px] font-semibold text-brand-dark outline-none"
                        />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          aria-label={`Remove row ${index + 1}`}
                          onClick={() =>
                            patch({
                              pricingItems: form.pricingItems.filter(
                                (row) => row.key !== item.key
                              ),
                            })
                          }
                          className="font-inter text-[13px] font-semibold text-[#dc2626] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dc2626] focus-visible:ring-offset-2"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="flex flex-col gap-5 rounded-2xl border border-[#e5e5e2] bg-white p-4 sm:gap-6 sm:p-6">
          <h2 className="font-inter text-base font-bold text-brand-dark">
            Availability
          </h2>

          <div className="flex flex-col gap-4">
            <p className="font-inter text-[13px] font-semibold text-brand-dark">
              Working Days
            </p>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {DAY_OPTIONS.map((day) => {
                const active = form.availabilityDays.includes(day.id);
                return (
                  <button
                    key={day.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() =>
                      patch({
                        availabilityDays: active
                          ? form.availabilityDays.filter(
                              (item) => item !== day.id
                            )
                          : [...form.availabilityDays, day.id],
                      })
                    }
                    className={`flex size-11 items-center justify-center rounded-full font-inter text-[11px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 sm:size-12 ${
                      active
                        ? "bg-brand-dark text-white"
                        : "border border-[#e5e5e2] bg-white text-[#6b7280]"
                    }`}
                  >
                    {day.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
            <p className="font-inter text-[13px] font-semibold text-brand-dark sm:pb-3">
              Working Hours
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <input
                id={`${formId}-hours-start`}
                type="time"
                value={form.workingHoursStart}
                onChange={(event) =>
                  patch({ workingHoursStart: event.target.value })
                }
                aria-label="Working hours start"
                className="h-12 w-full min-w-[140px] rounded-[10px] border border-[#e5e5e2] bg-white px-4 font-inter text-sm text-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 sm:h-[52px] sm:w-auto sm:text-[15px]"
              />
              <span className="font-inter text-sm text-[#6b7280]">–</span>
              <input
                id={`${formId}-hours-end`}
                type="time"
                value={form.workingHoursEnd}
                onChange={(event) =>
                  patch({ workingHoursEnd: event.target.value })
                }
                aria-label="Working hours end"
                className="h-12 w-full min-w-[140px] rounded-[10px] border border-[#e5e5e2] bg-white px-4 font-inter text-sm text-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 sm:h-[52px] sm:w-auto sm:text-[15px]"
              />
            </div>
          </div>
        </section>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:gap-4">
          <button
            type="button"
            onClick={() => {
              setForm(toForm(profile));
              showStatus("Changes discarded.");
            }}
            className="font-inter text-[13px] font-semibold text-[#6b7280] underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void save()}
            disabled={saving}
            className="inline-flex h-12 w-full items-center justify-center rounded-[10px] bg-brand-dark px-6 font-inter text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 disabled:opacity-60 sm:h-[52px] sm:w-auto sm:text-[15px]"
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>

        <section className="flex flex-col gap-5 rounded-2xl border border-[#fc8181] bg-white p-4 sm:gap-6 sm:p-6">
          <h2 className="font-inter text-base font-bold text-[#dc2626]">
            Danger Zone
          </h2>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 flex-col gap-1">
              <p className="font-inter text-sm font-bold text-brand-dark">
                Deactivate Account
              </p>
              <p className="font-inter text-xs text-[#6b7280]">
                Hide your profile and stop receiving job requests. Contact
                support to restore it.
              </p>
            </div>
            <button
              type="button"
              disabled={deactivating}
              onClick={() => void deactivate()}
              className="w-fit shrink-0 rounded-lg border border-[#dc2626] px-4 py-2 font-inter text-xs font-bold text-[#dc2626] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dc2626] focus-visible:ring-offset-2 disabled:opacity-60"
            >
              {deactivating ? "Deactivating…" : "Deactivate"}
            </button>
          </div>
        </section>
      </div>

      {cropSrc ? (
        <ProfilePhotoCropDialog
          imageSrc={cropSrc}
          busy={uploadingPhoto}
          onCancel={closeCropper}
          onConfirm={(file) => {
            void uploadCroppedPhoto(file);
          }}
        />
      ) : null}
    </div>
  );
}
