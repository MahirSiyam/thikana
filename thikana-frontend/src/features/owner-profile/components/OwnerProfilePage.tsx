"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  OwnerListedProperty,
  OwnerSecurityRow,
  OwnerVerificationItem,
} from "@/features/owner-profile/types/owner-profile.types";
import { ApiError } from "@/lib/api/client";
import { listMyListings, type ListingDto } from "@/lib/api/listings";
import {
  deactivateAccount,
  getFullProfile,
  updateProfile,
  type FullProfile,
} from "@/lib/api/profile";
import { uploadToCloudinary } from "@/lib/api/uploads";
import { useAuth } from "@/lib/auth/AuthProvider";
import { auth } from "@/lib/firebase/firebase";
import { useDashboardSignOut } from "@/lib/auth/use-dashboard-sign-out";

const FALLBACK_IMAGE = "/images/tenant/property-dhanmondi.png";

function VerificationRow({ item }: { item: OwnerVerificationItem }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="font-inter text-[13px] font-semibold text-brand-dark">
        {item.label}
      </span>
      {item.verified ? (
        <span className="inline-flex rounded-full bg-[#dcfce7] px-2 py-1 font-inter text-[11px] font-semibold text-[#16a34a]">
          ✓ Verified
        </span>
      ) : (
        <span className="inline-flex rounded-full bg-[#fef3c7] px-2 py-1 font-inter text-[11px] font-semibold text-[#b45309]">
          Pending
        </span>
      )}
    </div>
  );
}

function SecurityRowBox({
  row,
  onEdit,
}: {
  row: OwnerSecurityRow;
  onEdit: (id: string) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-[#e5e5e2] px-4 py-3">
      <div className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
        <p className="w-full shrink-0 font-inter text-[13px] font-semibold text-brand-dark sm:w-[140px]">
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
      {row.id === "email" || row.id === "2fa" || row.id === "notifications" ? (
        <span className="shrink-0 font-inter text-[12px] text-brand-dark/40">
          Managed
        </span>
      ) : (
        <button
          type="button"
          onClick={() => onEdit(row.id)}
          className="shrink-0 font-inter text-[13px] font-semibold text-brand-dark underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
        >
          Edit
        </button>
      )}
    </div>
  );
}

function ListedPropertyThumb({ property }: { property: OwnerListedProperty }) {
  return (
    <Link href={routes.ownerMyListings} className="flex min-w-0 flex-1 flex-col gap-2">
      <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl bg-[#f5f5f3]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={property.imageSrc}
          alt={property.label}
          className="size-full object-cover"
        />
      </div>
      <p className="font-inter text-[13px] font-semibold text-brand-dark">
        {property.label}
      </p>
    </Link>
  );
}

function listingToThumb(listing: ListingDto): OwnerListedProperty {
  return {
    id: listing.id,
    label: listing.title,
    imageSrc:
      listing.images[0]?.secureUrl ||
      listing.coverImageUrl ||
      FALLBACK_IMAGE,
  };
}

type EditForm = {
  fullName: string;
  phone: string;
  division: string;
  district: string;
  area: string;
  preferredContactMethod: "phone" | "whatsapp" | "in-app";
  propertyCount: string;
};

export function OwnerProfilePage() {
  const { refreshProfile } = useAuth();
  const { signOutUser } = useDashboardSignOut({
    scope: "user",
    redirectTo: routes.home,
  });

  const [profile, setProfile] = useState<FullProfile | null>(null);
  const [listings, setListings] = useState<ListingDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<EditForm>({
    fullName: "",
    phone: "",
    division: "",
    district: "",
    area: "",
    preferredContactMethod: "phone",
    propertyCount: "",
  });
  const [imageFailed, setImageFailed] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showAction = (message: string) => {
    setActionMessage(message);
    window.setTimeout(() => setActionMessage(null), 3000);
  };

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [full, mine] = await Promise.all([
        getFullProfile(),
        listMyListings({ limit: 6, sortBy: "createdAt", sortOrder: "desc" }),
      ]);
      setProfile(full);
      setListings(mine.data || []);
      setForm({
        fullName: full.fullName || "",
        phone: full.phone || "",
        division: full.address?.division || "",
        district: full.address?.district || "",
        area: full.address?.area || "",
        preferredContactMethod:
          full.owner?.preferredContactMethod || "phone",
        propertyCount: full.owner?.propertyCount || "",
      });
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

  const securityRows: OwnerSecurityRow[] = useMemo(() => {
    if (!profile) return [];
    return [
      { id: "email", label: "Email Address", value: profile.email },
      {
        id: "phone",
        label: "Phone Number",
        value: profile.phone || "Not set",
      },
      { id: "password", label: "Account Password", value: "••••••••••••" },
      {
        id: "2fa",
        label: "Two-Factor Auth",
        value: profile.emailVerified ? "Email verified" : "Email pending",
        badge: profile.emailVerified ? "enabled" : undefined,
      },
      {
        id: "notifications",
        label: "Preferred contact",
        value:
          profile.owner?.preferredContactMethod === "whatsapp"
            ? "WhatsApp"
            : profile.owner?.preferredContactMethod === "in-app"
              ? "In-app"
              : "Phone",
      },
    ];
  }, [profile]);

  const listedProperties = useMemo(
    () => listings.map(listingToThumb),
    [listings]
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

  const matchesSearch = (text: string) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return text.toLowerCase().includes(q);
  };

  const showIdentity = matchesSearch("profile verification identity");
  const showSecurity = matchesSearch(
    "account security email phone password notification contact"
  );
  const showListings = matchesSearch("listed properties listings homes");
  const showDanger = matchesSearch("danger deactivate delete account");

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
        preferredContactMethod: form.preferredContactMethod,
        propertyCount: form.propertyCount.trim(),
      });
      setProfile(updated);
      setEditing(false);
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

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-[50px] lg:py-[30px]">
      <div className="flex w-full flex-col gap-8 lg:gap-10">
        <header className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <h1 className="font-inter text-xl font-bold text-brand-dark">My Profile</h1>

          <div className="flex h-10 w-full max-w-[309px] items-center gap-2 rounded-[20px] bg-[#f5f5f3] px-4">
            <Image
              src="/images/owner/icon-search.svg"
              alt=""
              width={14}
              height={14}
              aria-hidden="true"
              className="size-3.5 shrink-0"
            />
            <label className="sr-only" htmlFor="owner-profile-search">
              Search profile settings
            </label>
            <input
              id="owner-profile-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search profile settings..."
              className="min-w-0 flex-1 bg-transparent font-inter text-[13px] text-brand-dark outline-none placeholder:text-[#6b7280]"
            />
          </div>

          <div className="flex items-center gap-4">
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
                  setForm({
                    fullName: profile.fullName || "",
                    phone: profile.phone || "",
                    division: profile.address?.division || "",
                    district: profile.address?.district || "",
                    area: profile.address?.area || "",
                    preferredContactMethod:
                      profile.owner?.preferredContactMethod || "phone",
                    propertyCount: profile.owner?.propertyCount || "",
                  });
                }}
                className="font-inter text-[13px] font-semibold text-brand-dark/60 underline"
              >
                Cancel
              </button>
            ) : null}
            <div className="relative">
              <ProfileAvatar
                src={avatarSrc}
                size="sm"
                className="!size-9"
                onError={() => setImageFailed(true)}
              />
            </div>
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

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
          <div className="flex flex-col gap-6">
            {showIdentity ? (
              <section className="flex flex-col items-center gap-5 rounded-2xl border border-[#e5e5e2] bg-white p-6">
                <div className="relative size-28">
                  <ProfileAvatar
                    src={avatarSrc}
                    size="xl"
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
                    className="absolute right-0 bottom-0 flex size-8 items-center justify-center rounded-full border-2 border-white bg-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 disabled:opacity-60"
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

                <div className="flex w-full flex-col items-center gap-2 text-center">
                  {editing ? (
                    <div className="flex w-full flex-col gap-3 text-left">
                      <label className="flex flex-col gap-1">
                        <span className="font-inter text-[11px] font-semibold uppercase tracking-wide text-brand-dark/40">
                          Full name
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
                      <label className="flex flex-col gap-1">
                        <span className="font-inter text-[11px] font-semibold uppercase tracking-wide text-brand-dark/40">
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
                      <label className="flex flex-col gap-1">
                        <span className="font-inter text-[11px] font-semibold uppercase tracking-wide text-brand-dark/40">
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
                      <label className="flex flex-col gap-1">
                        <span className="font-inter text-[11px] font-semibold uppercase tracking-wide text-brand-dark/40">
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
                      <label className="flex flex-col gap-1">
                        <span className="font-inter text-[11px] font-semibold uppercase tracking-wide text-brand-dark/40">
                          Properties owned
                        </span>
                        <input
                          value={form.propertyCount}
                          onChange={(event) =>
                            setForm((current) => ({
                              ...current,
                              propertyCount: event.target.value,
                            }))
                          }
                          placeholder="e.g. 1-2"
                          className="rounded-lg border border-[#e5e5e2] px-3 py-2 font-inter text-sm text-brand-dark outline-none focus-visible:ring-2 focus-visible:ring-brand-dark"
                        />
                      </label>
                      <label className="flex flex-col gap-1">
                        <span className="font-inter text-[11px] font-semibold uppercase tracking-wide text-brand-dark/40">
                          Preferred contact
                        </span>
                        <select
                          value={form.preferredContactMethod}
                          onChange={(event) =>
                            setForm((current) => ({
                              ...current,
                              preferredContactMethod: event.target
                                .value as EditForm["preferredContactMethod"],
                            }))
                          }
                          className="rounded-lg border border-[#e5e5e2] px-3 py-2 font-inter text-sm text-brand-dark outline-none focus-visible:ring-2 focus-visible:ring-brand-dark"
                        >
                          <option value="phone">Phone</option>
                          <option value="whatsapp">WhatsApp</option>
                          <option value="in-app">In-app</option>
                        </select>
                      </label>
                    </div>
                  ) : (
                    <>
                      <h2 className="font-inter text-[18px] font-bold text-brand-dark">
                        {profile.fullName}
                      </h2>
                      <span className="font-inter text-[13px] text-[#6b7280]">
                        Property Owner
                      </span>
                      <div className="flex items-center gap-1.5">
                        <Image
                          src="/images/owner/icon-map-pin.svg"
                          alt=""
                          width={12}
                          height={12}
                          aria-hidden="true"
                          className="size-3 shrink-0"
                        />
                        <span className="font-inter text-xs text-[#6b7280]">
                          {profile.location}
                        </span>
                      </div>
                      <p className="font-inter text-xs text-[#6b7280]">
                        Member since {profile.memberSince}
                      </p>
                      {profile.owner?.propertyCount ? (
                        <p className="font-inter text-xs text-[#6b7280]">
                          Properties: {profile.owner.propertyCount}
                        </p>
                      ) : null}
                    </>
                  )}
                </div>
              </section>
            ) : null}

            {showIdentity ? (
              <section className="flex flex-col gap-5 rounded-2xl border border-[#e5e5e2] bg-white p-6">
                <h2 className="font-inter text-base font-bold text-brand-dark">
                  Verification Status
                </h2>
                <div className="flex flex-col gap-4">
                  {profile.verificationItems.map((item) => (
                    <VerificationRow key={item.id} item={item} />
                  ))}
                </div>
                {profile.allVerified ? (
                  <div className="flex justify-center pt-1">
                    <span className="inline-flex items-center gap-2 rounded-full bg-brand-dark px-4 py-2 font-inter text-[11px] font-semibold text-white">
                      <Image
                        src="/images/tenant/icon-star.svg"
                        alt=""
                        width={14}
                        height={14}
                        aria-hidden="true"
                        className="size-3.5 brightness-0 invert"
                      />
                      Verified Badge Earned
                    </span>
                  </div>
                ) : (
                  <p className="font-inter text-xs text-brand-dark/50">
                    Complete identity checks and wait for admin approval to earn
                    the verified badge.
                  </p>
                )}
              </section>
            ) : null}
          </div>

          <div className="flex flex-col gap-6">
            {showSecurity ? (
              <section className="flex flex-col gap-4 rounded-2xl border border-[#e5e5e2] bg-white p-6">
                <h2 className="font-inter text-base font-bold text-brand-dark">
                  Account & Security
                </h2>
                <div className="flex flex-col gap-3">
                  {securityRows.map((row) => (
                    <SecurityRowBox
                      key={row.id}
                      row={row}
                      onEdit={(id) => {
                        if (id === "phone") {
                          setEditing(true);
                          return;
                        }
                        if (id === "password") {
                          setPasswordOpen(true);
                        }
                      }}
                    />
                  ))}
                </div>

                {editing ? (
                  <label className="flex flex-col gap-1">
                    <span className="font-inter text-[11px] font-semibold uppercase tracking-wide text-brand-dark/40">
                      Phone number
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
                ) : null}

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
            ) : null}

            {showListings ? (
              <section className="flex flex-col gap-4 rounded-2xl border border-[#e5e5e2] bg-white p-6">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="font-inter text-base font-bold text-brand-dark">
                    Listed Properties
                  </h2>
                  <Link
                    href={routes.ownerMyListings}
                    className="font-inter text-xs font-semibold text-brand-dark underline"
                  >
                    View all
                  </Link>
                </div>
                {listedProperties.length ? (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {listedProperties.map((property) => (
                      <ListedPropertyThumb
                        key={property.id}
                        property={property}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <p className="font-inter text-sm text-brand-dark/55">
                      No listings yet.
                    </p>
                    <Link
                      href={routes.ownerAddNewListing}
                      className="inline-flex w-fit rounded-lg bg-brand-dark px-4 py-2 font-inter text-xs font-bold text-white"
                    >
                      Add a listing
                    </Link>
                  </div>
                )}
              </section>
            ) : null}
          </div>
        </div>

        {showDanger ? (
          <section className="flex flex-col gap-6 rounded-2xl border border-[#e5e5e2] bg-white p-6">
            <h2 className="font-inter text-base font-bold text-[#dc2626]">
              Danger Zone
            </h2>
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 flex-col gap-1">
                  <p className="font-inter text-sm font-bold text-brand-dark">
                    Deactivate Account
                  </p>
                  <p className="font-inter text-xs text-[#6b7280]">
                    Temporarily disable dashboard access. Contact support to
                    reactivate later.
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
                    Permanent deletion requires support review to protect
                    bookings and listings.
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
        ) : null}
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
