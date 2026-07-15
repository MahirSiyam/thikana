"use client";

import Image from "next/image";
import { useState } from "react";
import { ownerUser } from "@/features/owner/data/owner.mock";
import { ownerProfile } from "@/features/owner-profile/data/owner-profile.mock";
import type {
  OwnerListedProperty,
  OwnerSecurityRow,
  OwnerVerificationItem,
} from "@/features/owner-profile/types/owner-profile.types";

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
      ) : null}
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

function ListedPropertyThumb({ property }: { property: OwnerListedProperty }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-2">
      <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl">
        <Image
          src={property.imageSrc}
          alt={property.label}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 180px"
        />
      </div>
      <p className="font-inter text-[13px] font-semibold text-brand-dark">{property.label}</p>
    </div>
  );
}

export function OwnerProfilePage() {
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  function showAction(message: string) {
    setActionMessage(message);
    window.setTimeout(() => setActionMessage(null), 2500);
  }

  function handleSecurityEdit(id: string) {
    const labels: Record<string, string> = {
      email: "email",
      phone: "phone number",
      password: "password",
      "2fa": "two-factor authentication",
      notifications: "notification preferences",
    };
    showAction(`Edit ${labels[id] ?? "setting"} — coming soon.`);
  }

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
              placeholder="Search profile settings..."
              className="min-w-0 flex-1 bg-transparent font-inter text-[13px] text-brand-dark outline-none placeholder:text-[#6b7280]"
            />
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => showAction("Edit Profile — coming soon.")}
              className="rounded-lg border border-brand-dark px-4 py-2 font-inter text-[13px] font-semibold text-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
            >
              Edit Profile
            </button>
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

        {actionMessage ? (
          <p
            role="status"
            className="rounded-lg border border-[#e5e5e2] bg-[#f5f5f3] px-4 py-2 font-inter text-[13px] text-brand-dark"
          >
            {actionMessage}
          </p>
        ) : null}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
          <div className="flex flex-col gap-6">
            <section className="flex flex-col items-center gap-5 rounded-2xl border border-[#e5e5e2] bg-white p-6">
              <div className="relative size-24">
                <div className="relative size-24 overflow-hidden rounded-full">
                  <Image
                    src={ownerProfile.avatarSrc}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
                <button
                  type="button"
                  aria-label="Change profile photo"
                  onClick={() => showAction("Change profile photo — coming soon.")}
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

              <div className="flex w-full flex-col items-center gap-2 text-center">
                <h2 className="font-inter text-[18px] font-bold text-brand-dark">
                  {ownerProfile.fullName}
                </h2>
                <span className="font-inter text-[13px] text-[#6b7280]">
                  {ownerProfile.roleBadge}
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
                    {ownerProfile.location}
                  </span>
                </div>
                <p className="font-inter text-xs text-[#6b7280]">
                  Member since {ownerProfile.memberSince}
                </p>
              </div>
            </section>

            <section className="flex flex-col gap-5 rounded-2xl border border-[#e5e5e2] bg-white p-6">
              <h2 className="font-inter text-base font-bold text-brand-dark">
                Verification Status
              </h2>
              <div className="flex flex-col gap-4">
                {ownerProfile.verificationItems.map((item) => (
                  <VerificationRow key={item.id} item={item} />
                ))}
              </div>
              {ownerProfile.allVerified ? (
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
              ) : null}
            </section>
          </div>

          <div className="flex flex-col gap-6">
            <section className="flex flex-col gap-4 rounded-2xl border border-[#e5e5e2] bg-white p-6">
              <h2 className="font-inter text-base font-bold text-brand-dark">
                Account & Security
              </h2>
              <div className="flex flex-col gap-3">
                {ownerProfile.securityRows.map((row) => (
                  <SecurityRowBox
                    key={row.id}
                    row={row}
                    onEdit={handleSecurityEdit}
                  />
                ))}
              </div>
            </section>

            <section className="flex flex-col gap-4 rounded-2xl border border-[#e5e5e2] bg-white p-6">
              <h2 className="font-inter text-base font-bold text-brand-dark">
                Listed Properties
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {ownerProfile.listedProperties.map((property) => (
                  <ListedPropertyThumb key={property.id} property={property} />
                ))}
              </div>
            </section>
          </div>
        </div>

        <section className="flex flex-col gap-6 rounded-2xl border border-[#e5e5e2] bg-white p-6">
          <h2 className="font-inter text-base font-bold text-[#dc2626]">Danger Zone</h2>
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 flex-col gap-1">
                <p className="font-inter text-sm font-bold text-brand-dark">
                  Deactivate Account
                </p>
                <p className="font-inter text-xs text-[#6b7280]">
                  Temporarily hide your account and listings.
                </p>
              </div>
              <button
                type="button"
                onClick={() => showAction("Deactivate account — coming soon.")}
                className="w-fit shrink-0 rounded-lg border border-[#dc2626] px-4 py-2 font-inter text-xs font-bold text-[#dc2626] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dc2626] focus-visible:ring-offset-2"
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
                  Permanently delete your account and all data.
                </p>
              </div>
              <button
                type="button"
                onClick={() => showAction("Delete account — coming soon.")}
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
