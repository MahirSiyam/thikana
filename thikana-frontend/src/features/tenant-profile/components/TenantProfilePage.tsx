"use client";

import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { ProfileAvatar } from "@/components/ui/ProfileAvatar";
import { ProfilePhotoCropDialog } from "@/components/ui/ProfilePhotoCropDialog";
import { routes } from "@/config/routes";
import { divisions } from "@/features/owner-add-new-listing/data/owner-add-new-listing.mock";
import type {
  ProfileChecklistItem,
  ProfileField,
} from "@/features/tenant-profile/types/tenant-profile.types";
import { ApiError } from "@/lib/api/client";
import {
  deactivateAccount,
  getFullProfile,
  updateProfile,
  type FullProfile,
} from "@/lib/api/profile";
import { uploadToCloudinary } from "@/lib/api/uploads";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useDashboardSignOut } from "@/lib/auth/use-dashboard-sign-out";
import { auth } from "@/lib/firebase/firebase";
import {
  formDraftKeys,
  readSessionJson,
  removeSessionJson,
  writeSessionJson,
} from "@/hooks/use-persisted-state";

type LookingAs = "family" | "bachelor" | "student" | "";

type EditForm = {
  fullName: string;
  phone: string;
  division: string;
  district: string;
  area: string;
  lookingAs: LookingAs;
  preferredLocation: string;
  budgetRange: string;
};

type TenantProfileEditDraft = {
  editing: boolean;
  form: EditForm;
};

const emptyEditForm = (): EditForm => ({
  fullName: "",
  phone: "",
  division: "",
  district: "",
  area: "",
  lookingAs: "",
  preferredLocation: "",
  budgetRange: "",
});

function lookingAsLabel(value: string | null | undefined) {
  if (value === "family") return "Family";
  if (value === "bachelor") return "Bachelor";
  if (value === "student") return "Student";
  return "Not set";
}

function formFromProfile(profile: FullProfile): EditForm {
  return {
    fullName: profile.fullName || "",
    phone: profile.phone || "",
    division: profile.address?.division || "",
    district: profile.address?.district || "",
    area: profile.address?.area || "",
    lookingAs: (profile.tenant?.lookingAs as LookingAs) || "",
    preferredLocation: profile.tenant?.preferredLocation || "",
    budgetRange: profile.tenant?.budgetRange || "",
  };
}

function buildPersonalFields(profile: FullProfile): ProfileField[] {
  const addressParts = [
    profile.address?.area,
    profile.address?.district,
    profile.address?.division,
  ].filter(Boolean);
  return [
    { label: "Full Name", value: profile.fullName || "—" },
    { label: "Phone", value: profile.phone || "—" },
    { label: "Email", value: profile.email || "—" },
    {
      label: "Present Address",
      value: addressParts.length ? addressParts.join(", ") : "—",
    },
    {
      label: "Looking As",
      value: lookingAsLabel(profile.tenant?.lookingAs),
    },
    {
      label: "Preferred Location",
      value: profile.tenant?.preferredLocation || "—",
    },
    {
      label: "Preferred Budget",
      value: profile.tenant?.budgetRange || "—",
    },
  ];
}

function buildChecklist(profile: FullProfile): {
  items: ProfileChecklistItem[];
  percent: number;
} {
  const items: ProfileChecklistItem[] = [
    {
      id: "basic",
      label: "Basic Info",
      done: Boolean(profile.fullName?.trim() && profile.phone?.trim()),
    },
    {
      id: "photo",
      label: "Profile Photo",
      done: Boolean(profile.avatarUrl),
    },
    {
      id: "address",
      label: "Address",
      done: Boolean(
        profile.address?.division?.trim() && profile.address?.district?.trim()
      ),
    },
    {
      id: "preferences",
      label: "Rental Preferences",
      done: Boolean(
        profile.tenant?.lookingAs &&
          profile.tenant?.preferredLocation?.trim() &&
          profile.tenant?.budgetRange?.trim()
      ),
    },
    ...profile.verificationItems.map((item) => ({
      id: item.id,
      label: item.label,
      done: item.verified,
    })),
  ];

  const doneCount = items.filter((item) => item.done).length;
  const percent =
    items.length === 0 ? 0 : Math.round((doneCount / items.length) * 100);

  return { items, percent };
}

export function TenantProfilePage() {
  const { refreshProfile } = useAuth();
  const { signOutUser } = useDashboardSignOut({
    scope: "user",
    redirectTo: routes.home,
  });

  const [profile, setProfile] = useState<FullProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [form, setForm] = useState<EditForm>(emptyEditForm);
  const [draftHydrated, setDraftHydrated] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useLayoutEffect(() => {
    const draft = readSessionJson<TenantProfileEditDraft>(
      formDraftKeys.tenantProfileEdit
    );
    if (draft?.editing && draft.form) {
      setForm({ ...emptyEditForm(), ...draft.form });
      setEditing(true);
    }
    setDraftHydrated(true);
  }, []);

  useEffect(() => {
    if (!draftHydrated) return;
    if (editing) {
      writeSessionJson(formDraftKeys.tenantProfileEdit, { editing: true, form });
    } else {
      removeSessionJson(formDraftKeys.tenantProfileEdit);
    }
  }, [draftHydrated, editing, form]);

  const showAction = (message: string) => {
    setActionMessage(message);
    window.setTimeout(() => setActionMessage(null), 3000);
  };

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const full = await getFullProfile();
      setProfile(full);
      const fromApi = formFromProfile(full);
      const draft = readSessionJson<TenantProfileEditDraft>(
        formDraftKeys.tenantProfileEdit
      );
      if (draft?.editing && draft.form) {
        setForm({ ...emptyEditForm(), ...draft.form });
        setEditing(true);
      } else {
        setForm(fromApi);
      }
      setImageFailed(false);
    } catch (err) {
      setError(
        err instanceof ApiError || err instanceof Error
          ? err.message
          : "Could not load profile"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void load();
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [load]);

  const personalFields = useMemo(
    () => (profile ? buildPersonalFields(profile) : []),
    [profile]
  );

  const { items: checklist, percent: completionPercent } = useMemo(
    () =>
      profile
        ? buildChecklist(profile)
        : { items: [] as ProfileChecklistItem[], percent: 0 },
    [profile]
  );

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
      setImageFailed(false);
      await refreshProfile();
      closeCropper();
      showAction("Profile photo updated.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not update profile photo"
      );
    } finally {
      setUploadingPhoto(false);
    }
  };

  const saveProfile = async () => {
    if (!form.fullName.trim()) {
      setError("Full name is required.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const updated = await updateProfile({
        fullName: form.fullName.trim(),
        phone: form.phone.trim() || null,
        address: {
          division: form.division.trim(),
          district: form.district.trim(),
          area: form.area.trim(),
        },
        lookingAs: form.lookingAs === "" ? null : form.lookingAs,
        preferredLocation: form.preferredLocation.trim() || null,
        budgetRange: form.budgetRange.trim() || null,
      });
      setProfile(updated);
      setForm(formFromProfile(updated));
      setEditing(false);
      removeSessionJson(formDraftKeys.tenantProfileEdit);
      await refreshProfile();
      showAction("Profile updated.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async () => {
    const user = auth.currentUser;
    if (!user?.email) {
      setError("You must be signed in to change password.");
      return;
    }
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      setPasswordOpen(false);
      setCurrentPassword("");
      setNewPassword("");
      showAction("Password updated.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not update password. Check your current password."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = async () => {
    const ok = window.confirm(
      "Deactivate your account? You will be signed out and lose dashboard access until an admin reactivates you."
    );
    if (!ok) return;
    setSaving(true);
    setError(null);
    try {
      await deactivateAccount();
      await signOutUser();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not deactivate account"
      );
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-[50px] lg:py-[30px]">
        <p className="font-inter text-sm text-brand-dark/60">Loading profile…</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-[50px] lg:py-[30px]">
        <p role="alert" className="font-inter text-sm font-medium text-red-600">
          {error || "Profile not found."}
        </p>
      </div>
    );
  }

  const avatarSrc =
    !imageFailed && profile.avatarUrl ? profile.avatarUrl : null;
  const idVerified = profile.verificationItems.some(
    (item) =>
      item.verified &&
      (item.id.includes("nid") ||
        item.id.includes("id") ||
        item.label.toLowerCase().includes("id"))
  );

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-[50px] lg:py-[30px]">
      <div className="flex w-full flex-col gap-8 lg:gap-12">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h1 className="font-inter text-xl font-bold text-brand-dark">
            My Profile
          </h1>

          <div className="flex h-10 w-full max-w-[360px] items-center gap-2 rounded-[20px] bg-[#f5f5f3] px-4">
            <Image
              src="/images/tenant/icon-search.svg"
              alt=""
              width={16}
              height={16}
              aria-hidden="true"
              className="size-4 shrink-0"
            />
            <label className="sr-only" htmlFor="tenant-profile-search">
              Search houses, services
            </label>
            <input
              id="tenant-profile-search"
              type="search"
              placeholder="Search houses, services..."
              className="min-w-0 flex-1 bg-transparent font-inter text-[13px] text-brand-dark outline-none placeholder:text-[#6b7280]"
            />
          </div>

          <div className="flex items-center gap-2 sm:gap-5">
            <button
              type="button"
              disabled={saving}
              onClick={() => {
                if (editing) {
                  void saveProfile();
                } else {
                  setEditing(true);
                  setPasswordOpen(false);
                }
              }}
              className="rounded-lg border border-brand-dark px-4 py-2 font-inter text-[13px] font-semibold text-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 disabled:opacity-60"
            >
              {editing ? (saving ? "Saving…" : "Save changes") : "Edit Profile"}
            </button>
            {editing ? (
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  setForm(formFromProfile(profile));
                }}
                className="font-inter text-[13px] font-semibold text-brand-dark/60 underline"
              >
                Cancel
              </button>
            ) : null}
            <button
              type="button"
              aria-label="Notifications"
              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
            >
              <Image
                src="/images/tenant/icon-bell.svg"
                alt=""
                width={24}
                height={24}
                aria-hidden="true"
                className="size-6"
              />
            </button>
            <ProfileAvatar
              src={avatarSrc}
              size="sm"
              className="!size-8 !rounded-2xl"
              onError={() => setImageFailed(true)}
            />
          </div>
        </header>

        {actionMessage ? (
          <p
            role="status"
            className="rounded-lg border border-[#e5e5e2] bg-[#f5f5f3] px-4 py-2 font-inter text-[13px] text-brand-dark"
          >
            {actionMessage}
          </p>
        ) : null}
        {error ? (
          <p
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 font-inter text-[13px] text-red-700"
          >
            {error}
          </p>
        ) : null}

        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[380px_minmax(0,1fr)]">
            <section className="flex flex-col items-center gap-6 rounded-2xl border border-[#e5e5e2] bg-white p-8">
              <div className="relative size-24">
                <ProfileAvatar
                  src={avatarSrc}
                  size="xl"
                  className="!size-24"
                  onError={() => setImageFailed(true)}
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="sr-only"
                  onChange={(event) => {
                    openCropper(event.target.files?.[0] || null);
                  }}
                />
                <button
                  type="button"
                  aria-label="Change profile photo"
                  disabled={uploadingPhoto}
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 flex size-8 items-center justify-center rounded-2xl border-2 border-white bg-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 disabled:opacity-60"
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
              {uploadingPhoto ? (
                <p className="font-inter text-xs text-brand-dark/55">
                  Uploading photo…
                </p>
              ) : (
                <button
                  type="button"
                  disabled={uploadingPhoto}
                  onClick={() => fileInputRef.current?.click()}
                  className="font-inter text-xs font-semibold text-brand-dark underline"
                >
                  {avatarSrc ? "Change photo" : "Upload profile photo"}
                </button>
              )}

              <div className="flex flex-col items-center gap-2">
                <h2 className="font-outfit text-[22px] font-bold text-brand-dark">
                  {profile.fullName}
                </h2>
                <div className="flex items-center gap-2">
                  <span className="rounded bg-[#f5f5f3] px-2 py-1 font-inter text-[11px] font-semibold text-[#6b7280]">
                    Tenant
                  </span>
                  {idVerified || profile.allVerified ? (
                    <span className="rounded bg-[#dcfce7] px-2 py-1 font-inter text-[11px] font-semibold text-[#16a34a]">
                      ✓ ID Verified
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="flex w-full flex-col gap-3">
                <div className="flex items-center justify-between font-inter text-xs text-brand-dark">
                  <span className="font-semibold">Profile Complete</span>
                  <span className="font-bold">{completionPercent}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-[3px] bg-[#f5f5f3]">
                  <div
                    className="h-full bg-brand-dark"
                    style={{ width: `${completionPercent}%` }}
                  />
                </div>
              </div>

              <div className="flex w-full flex-col gap-2 border-t border-[#f0f0ee] pt-5">
                <div className="flex items-center gap-3">
                  <Image
                    src="/images/tenant/icon-mail.svg"
                    alt=""
                    width={14}
                    height={14}
                    aria-hidden="true"
                    className="size-3.5 shrink-0"
                  />
                  <p className="font-inter text-xs text-[#6b7280]">
                    {profile.email}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Image
                    src="/images/tenant/icon-phone.svg"
                    alt=""
                    width={14}
                    height={14}
                    aria-hidden="true"
                    className="size-3.5 shrink-0"
                  />
                  <p className="font-inter text-xs text-[#6b7280]">
                    {profile.phone || "Not set"}
                  </p>
                </div>
              </div>
            </section>

            <section className="flex flex-col gap-6 rounded-2xl border border-[#e5e5e2] bg-white p-6 xl:min-h-[380px]">
              <div className="flex items-center justify-between">
                <h2 className="font-inter text-base font-bold text-brand-dark">
                  Personal Information
                </h2>
                <button
                  type="button"
                  aria-label="Edit personal information"
                  onClick={() => {
                    setEditing(true);
                    setPasswordOpen(false);
                  }}
                  className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
                >
                  <Image
                    src="/images/tenant/icon-edit.svg"
                    alt=""
                    width={16}
                    height={16}
                    aria-hidden="true"
                    className="size-4"
                  />
                </button>
              </div>

              {editing ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="flex flex-col gap-1.5 sm:col-span-2">
                    <span className="font-inter text-[11px] font-semibold uppercase text-[#6b7280]">
                      Full Name
                    </span>
                    <input
                      value={form.fullName}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          fullName: event.target.value,
                        }))
                      }
                      className="rounded-lg border border-[#e5e5e2] px-3 py-2 font-inter text-sm text-brand-dark outline-none focus-visible:ring-2 focus-visible:ring-brand-dark"
                    />
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span className="font-inter text-[11px] font-semibold uppercase text-[#6b7280]">
                      Phone
                    </span>
                    <input
                      value={form.phone}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          phone: event.target.value,
                        }))
                      }
                      className="rounded-lg border border-[#e5e5e2] px-3 py-2 font-inter text-sm text-brand-dark outline-none focus-visible:ring-2 focus-visible:ring-brand-dark"
                    />
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span className="font-inter text-[11px] font-semibold uppercase text-[#6b7280]">
                      Looking As
                    </span>
                    <select
                      value={form.lookingAs}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          lookingAs: event.target.value as LookingAs,
                        }))
                      }
                      className="rounded-lg border border-[#e5e5e2] px-3 py-2 font-inter text-sm text-brand-dark outline-none focus-visible:ring-2 focus-visible:ring-brand-dark"
                    >
                      <option value="">Select</option>
                      <option value="family">Family</option>
                      <option value="bachelor">Bachelor</option>
                      <option value="student">Student</option>
                    </select>
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span className="font-inter text-[11px] font-semibold uppercase text-[#6b7280]">
                      Preferred Location
                    </span>
                    <input
                      value={form.preferredLocation}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          preferredLocation: event.target.value,
                        }))
                      }
                      placeholder="e.g. Dhanmondi, Dhaka"
                      className="rounded-lg border border-[#e5e5e2] px-3 py-2 font-inter text-sm text-brand-dark outline-none focus-visible:ring-2 focus-visible:ring-brand-dark"
                    />
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span className="font-inter text-[11px] font-semibold uppercase text-[#6b7280]">
                      Preferred Budget
                    </span>
                    <input
                      value={form.budgetRange}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          budgetRange: event.target.value,
                        }))
                      }
                      placeholder="e.g. 15k – 25k BDT"
                      className="rounded-lg border border-[#e5e5e2] px-3 py-2 font-inter text-sm text-brand-dark outline-none focus-visible:ring-2 focus-visible:ring-brand-dark"
                    />
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span className="font-inter text-[11px] font-semibold uppercase text-[#6b7280]">
                      Division
                    </span>
                    <select
                      value={form.division}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          division: event.target.value,
                        }))
                      }
                      className="rounded-lg border border-[#e5e5e2] px-3 py-2 font-inter text-sm text-brand-dark outline-none focus-visible:ring-2 focus-visible:ring-brand-dark"
                    >
                      <option value="">Select division</option>
                      {divisions.map((item) => (
                        <option key={item.id} value={item.label}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span className="font-inter text-[11px] font-semibold uppercase text-[#6b7280]">
                      District
                    </span>
                    <input
                      value={form.district}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          district: event.target.value,
                        }))
                      }
                      className="rounded-lg border border-[#e5e5e2] px-3 py-2 font-inter text-sm text-brand-dark outline-none focus-visible:ring-2 focus-visible:ring-brand-dark"
                    />
                  </label>
                  <label className="flex flex-col gap-1.5 sm:col-span-2">
                    <span className="font-inter text-[11px] font-semibold uppercase text-[#6b7280]">
                      Area
                    </span>
                    <input
                      value={form.area}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          area: event.target.value,
                        }))
                      }
                      className="rounded-lg border border-[#e5e5e2] px-3 py-2 font-inter text-sm text-brand-dark outline-none focus-visible:ring-2 focus-visible:ring-brand-dark"
                    />
                  </label>
                  <p className="font-inter text-xs text-[#6b7280] sm:col-span-2">
                    Email: {profile.email} (managed via account)
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {personalFields.map((field) => (
                    <div key={field.label} className="flex flex-col gap-1.5">
                      <p className="font-inter text-[11px] font-semibold uppercase text-[#6b7280]">
                        {field.label}
                      </p>
                      <p className="font-inter text-sm font-semibold text-brand-dark">
                        {field.value}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[380px_minmax(0,1fr)]">
            <section className="flex flex-col gap-5 rounded-2xl border border-[#e5e5e2] bg-white p-6">
              <h2 className="font-inter text-base font-bold text-brand-dark">
                Profile Completion
              </h2>
              <ul className="flex flex-col gap-6">
                {checklist.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5">
                      {item.done ? (
                        <span className="flex size-[18px] items-center justify-center rounded bg-brand-dark">
                          <Image
                            src="/images/tenant/icon-check-white.svg"
                            alt=""
                            width={10}
                            height={10}
                            aria-hidden="true"
                            className="size-2.5"
                          />
                        </span>
                      ) : (
                        <span
                          aria-hidden="true"
                          className="size-[18px] rounded-[9px] border-2 border-[#e5e5e2]"
                        />
                      )}
                      <span className="font-inter text-[13px] text-brand-dark">
                        {item.label}
                      </span>
                    </div>
                    {item.done ? (
                      <span className="font-inter text-[11px] font-semibold text-[#16a34a]">
                        Done
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setEditing(true);
                          setPasswordOpen(false);
                        }}
                        className="font-inter text-[11px] font-semibold text-brand-dark underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
                      >
                        Complete Now →
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </section>

            <section className="flex flex-col gap-6 rounded-2xl border border-[#e5e5e2] bg-white p-6">
              <h2 className="font-inter text-base font-bold text-brand-dark">
                Account & Security
              </h2>
              <div className="flex flex-col">
                <div className="flex items-center justify-between gap-4 border-b border-[#f0f0ee] py-4">
                  <div className="flex min-w-0 flex-col gap-1">
                    <p className="font-inter text-sm font-bold text-brand-dark">
                      Password
                    </p>
                    <p className="font-inter text-xs text-[#6b7280]">
                      Change your account password
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPasswordOpen(true)}
                    className="shrink-0 font-inter text-xs font-bold text-brand-dark underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
                  >
                    Change
                  </button>
                </div>
                <div className="flex items-center justify-between gap-4 border-b border-[#f0f0ee] py-4">
                  <div className="flex min-w-0 flex-col gap-1">
                    <p className="font-inter text-sm font-bold text-brand-dark">
                      Email verification
                    </p>
                    <p className="font-inter text-xs text-[#6b7280]">
                      {profile.emailVerified
                        ? "Your email is verified"
                        : "Verify your email for extra security"}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2 py-1 font-inter text-[11px] font-semibold ${
                      profile.emailVerified
                        ? "bg-[#dcfce7] text-[#16a34a]"
                        : "bg-[#fef3c7] text-[#b45309]"
                    }`}
                  >
                    {profile.emailVerified ? "Verified" : "Pending"}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 py-4">
                  <div className="flex min-w-0 flex-col gap-1">
                    <p className="font-inter text-sm font-bold text-brand-dark">
                      Phone number
                    </p>
                    <p className="font-inter text-xs text-[#6b7280]">
                      {profile.phone || "Add a phone number to your profile"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(true);
                      setPasswordOpen(false);
                    }}
                    className="shrink-0 font-inter text-xs font-bold text-brand-dark underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
                  >
                    Edit
                  </button>
                </div>
              </div>

              {passwordOpen ? (
                <div className="flex flex-col gap-3 rounded-xl border border-[#e5e5e2] bg-[#fafaf8] p-4">
                  <p className="font-inter text-sm font-semibold text-brand-dark">
                    Change password
                  </p>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(event) => setCurrentPassword(event.target.value)}
                    placeholder="Current password"
                    className="rounded-lg border border-[#e5e5e2] bg-white px-3 py-2 font-inter text-sm outline-none focus-visible:ring-2 focus-visible:ring-brand-dark"
                  />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    placeholder="New password (min 8 chars)"
                    className="rounded-lg border border-[#e5e5e2] bg-white px-3 py-2 font-inter text-sm outline-none focus-visible:ring-2 focus-visible:ring-brand-dark"
                  />
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => void changePassword()}
                      className="rounded-lg bg-brand-dark px-4 py-2 font-inter text-xs font-bold text-white disabled:opacity-60"
                    >
                      Update password
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPasswordOpen(false);
                        setCurrentPassword("");
                        setNewPassword("");
                      }}
                      className="font-inter text-xs font-semibold text-brand-dark underline"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : null}
            </section>
          </div>

          <section className="flex flex-col gap-6 rounded-2xl border border-[#fc8181] bg-white p-6">
            <h2 className="font-inter text-base font-bold text-[#dc2626]">
              Danger Zone
            </h2>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 flex-col gap-1">
                  <p className="font-inter text-sm font-bold text-brand-dark">
                    Deactivate Account
                  </p>
                  <p className="font-inter text-xs text-[#6b7280]">
                    Temporarily hide your profile and active requests.
                  </p>
                </div>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => void handleDeactivate()}
                  className="w-fit shrink-0 rounded-lg border border-[#dc2626] px-4 py-2 font-inter text-xs font-bold text-[#dc2626] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dc2626] focus-visible:ring-offset-2 disabled:opacity-60"
                >
                  Deactivate
                </button>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 flex-col gap-1">
                  <p className="font-inter text-sm font-bold text-brand-dark">
                    Delete Account
                  </p>
                  <p className="font-inter text-xs text-[#6b7280]">
                    Permanently delete all your data and history.
                  </p>
                </div>
                <a
                  href={routes.contactUs}
                  className="w-fit shrink-0 rounded-lg bg-[#dc2626] px-4 py-2 font-inter text-xs font-bold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dc2626] focus-visible:ring-offset-2"
                >
                  Contact support
                </a>
              </div>
            </div>
          </section>
        </div>
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
