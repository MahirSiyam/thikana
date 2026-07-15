"use client";

import Image from "next/image";
import { useState } from "react";
import { tenantUser } from "@/features/tenant/data/tenant.mock";
import { tenantProfile } from "@/features/tenant-profile/data/tenant-profile.mock";

function SecurityActionLabel(action: "change" | "unlink" | "edit") {
  if (action === "change") return "Change";
  if (action === "unlink") return "Unlink";
  return "Edit";
}

export function TenantProfilePage() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(
    tenantProfile.twoFactorEnabled,
  );

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-[50px] lg:py-[30px]">
      <div className="flex w-full flex-col gap-8 lg:gap-12">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h1 className="font-inter text-xl font-bold text-brand-dark">My Profile</h1>

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
                src="/images/tenant/icon-bell.svg"
                alt=""
                width={24}
                height={24}
                aria-hidden="true"
                className="size-6"
              />
            </button>
            <div className="relative size-8 overflow-hidden rounded-2xl">
              <Image
                src={tenantUser.topbarAvatarSrc}
                alt=""
                fill
                className="object-cover"
                sizes="32px"
              />
            </div>
          </div>
        </header>

        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[380px_minmax(0,1fr)]">
            <section className="flex flex-col items-center gap-6 rounded-2xl border border-[#e5e5e2] bg-white p-8">
              <div className="relative size-24">
                <div className="relative size-24 overflow-hidden rounded-full">
                  <Image
                    src={tenantProfile.avatarSrc}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
                <button
                  type="button"
                  aria-label="Change profile photo"
                  className="absolute bottom-0 right-0 flex size-8 items-center justify-center rounded-2xl border-2 border-white bg-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
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

              <div className="flex flex-col items-center gap-2">
                <h2 className="font-outfit text-[22px] font-bold text-brand-dark">
                  {tenantProfile.fullName}
                </h2>
                <div className="flex items-center gap-2">
                  <span className="rounded bg-[#f5f5f3] px-2 py-1 font-inter text-[11px] font-semibold text-[#6b7280]">
                    {tenantProfile.roleBadge}
                  </span>
                  {tenantProfile.idVerified ? (
                    <span className="rounded bg-[#dcfce7] px-2 py-1 font-inter text-[11px] font-semibold text-[#16a34a]">
                      ✓ ID Verified
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="flex w-full flex-col gap-3">
                <div className="flex items-center justify-between font-inter text-xs text-brand-dark">
                  <span className="font-semibold">Profile Complete</span>
                  <span className="font-bold">{tenantProfile.completionPercent}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-[3px] bg-[#f5f5f3]">
                  <div
                    className="h-full bg-brand-dark"
                    style={{ width: `${tenantProfile.completionPercent}%` }}
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
                  <p className="font-inter text-xs text-[#6b7280]">{tenantProfile.email}</p>
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
                  <p className="font-inter text-xs text-[#6b7280]">{tenantProfile.phone}</p>
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
              <div className="flex flex-col gap-3">
                {tenantProfile.personalFields.map((field) => (
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
            </section>
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[380px_minmax(0,1fr)]">
            <section className="flex flex-col gap-5 rounded-2xl border border-[#e5e5e2] bg-white p-6">
              <h2 className="font-inter text-base font-bold text-brand-dark">
                Profile Completion
              </h2>
              <ul className="flex flex-col gap-6">
                {tenantProfile.checklist.map((item) => (
                  <li key={item.id} className="flex items-center justify-between gap-3">
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
                {tenantProfile.securityRows.map((row, index) => {
                  const isLast = index === tenantProfile.securityRows.length - 1;
                  return (
                    <div
                      key={row.id}
                      className={`flex items-center justify-between gap-4 py-4 ${
                        isLast ? "" : "border-b border-[#f0f0ee]"
                      }`}
                    >
                      <div className="flex min-w-0 flex-col gap-1">
                        <p className="font-inter text-sm font-bold text-brand-dark">
                          {row.title}
                        </p>
                        <p className="font-inter text-xs text-[#6b7280]">
                          {row.description}
                        </p>
                      </div>

                      {row.action === "toggle" ? (
                        <button
                          type="button"
                          role="switch"
                          aria-checked={twoFactorEnabled}
                          aria-label="Two-factor authentication"
                          onClick={() => setTwoFactorEnabled((value) => !value)}
                          className={`relative h-[18px] w-8 shrink-0 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 ${
                            twoFactorEnabled ? "bg-brand-dark" : "bg-[#e5e5e2]"
                          }`}
                        >
                          <span
                            aria-hidden="true"
                            className={`absolute top-0.5 size-3.5 rounded-full bg-white transition-transform ${
                              twoFactorEnabled ? "left-[14px]" : "left-0.5"
                            }`}
                          />
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="shrink-0 font-inter text-xs font-bold text-brand-dark underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
                        >
                          {SecurityActionLabel(row.action)}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          <section className="flex flex-col gap-6 rounded-2xl border border-[#fc8181] bg-white p-6">
            <h2 className="font-inter text-base font-bold text-[#dc2626]">Danger Zone</h2>
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
                    Permanently delete all your data and history.
                  </p>
                </div>
                <button
                  type="button"
                  className="w-fit shrink-0 rounded-lg bg-[#dc2626] px-4 py-2 font-inter text-xs font-bold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dc2626] focus-visible:ring-offset-2"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
