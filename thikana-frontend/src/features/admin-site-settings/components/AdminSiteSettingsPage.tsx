"use client";

import { useState } from "react";
import {
  defaultCommissionSettings,
  defaultGeneralSettings,
  defaultNotificationSettings,
  defaultVerificationSettings,
} from "@/features/admin-site-settings/data/admin-site-settings.mock";
import type {
  NotificationChannel,
  NotificationEventSetting,
} from "@/features/admin-site-settings/types/admin-site-settings.types";

function SettingsToggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`relative h-5 w-9 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 ${
        checked ? "bg-brand-dark" : "bg-brand-dark/50"
      }`}
    >
      <span
        className={`absolute top-0.5 size-4 rounded-full bg-white transition-transform ${
          checked ? "left-[18px]" : "left-0.5"
        }`}
      />
    </button>
  );
}

function FieldLabel({ htmlFor, children }: { htmlFor: string; children: string }) {
  return (
    <label
      htmlFor={htmlFor}
      className="font-inter text-[13px] font-semibold text-brand-dark/80"
    >
      {children}
    </label>
  );
}

function TextField({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-2">
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-[#e2e8f0] bg-white p-3 font-inter text-sm text-black outline-none focus-visible:ring-2 focus-visible:ring-brand-dark"
      />
    </div>
  );
}

export function AdminSiteSettingsPage() {
  const [general, setGeneral] = useState(defaultGeneralSettings);
  const [verification, setVerification] = useState(defaultVerificationSettings);
  const [notifications, setNotifications] = useState(defaultNotificationSettings);
  const [commission, setCommission] = useState(defaultCommissionSettings);

  const toggleNotification = (id: string, channel: NotificationChannel) => {
    setNotifications((current) =>
      current.map((row) =>
        row.id === id ? { ...row, [channel]: !row[channel] } : row,
      ),
    );
  };

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-[50px] lg:py-[30px]">
      <div className="flex w-full flex-col gap-6">
        <h1 className="font-outfit text-[clamp(1.5rem,3vw,1.75rem)] font-bold text-black">
          Site Settings
        </h1>

        <div className="flex flex-col gap-6">
          <section className="flex flex-col gap-4 rounded-lg bg-white p-6 shadow-[0px_4px_6px_rgba(0,0,0,0.04)]">
            <h2 className="font-inter text-base font-bold text-black">General Settings</h2>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-4 md:flex-row">
                <TextField
                  id="site-name"
                  label="Site Name"
                  value={general.siteName}
                  onChange={(siteName) => setGeneral((current) => ({ ...current, siteName }))}
                />
                <TextField
                  id="tagline"
                  label="Tagline"
                  value={general.tagline}
                  onChange={(tagline) => setGeneral((current) => ({ ...current, tagline }))}
                />
              </div>
              <div className="flex flex-col gap-4 md:flex-row">
                <TextField
                  id="support-email"
                  label="Support Email"
                  value={general.supportEmail}
                  onChange={(supportEmail) =>
                    setGeneral((current) => ({ ...current, supportEmail }))
                  }
                />
                <TextField
                  id="contact-phone"
                  label="Contact Phone"
                  value={general.contactPhone}
                  onChange={(contactPhone) =>
                    setGeneral((current) => ({ ...current, contactPhone }))
                  }
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                className="rounded-md bg-black px-4 py-2.5 font-inter text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
              >
                Save Changes
              </button>
            </div>
          </section>

          <section className="flex flex-col gap-5 rounded-lg bg-white p-6 shadow-[0px_4px_6px_rgba(0,0,0,0.04)]">
            <h2 className="font-inter text-base font-bold text-black">Verification Settings</h2>
            <div className="flex flex-col">
              <div className="flex items-center justify-between gap-4 border-b border-[#e2e8f0] py-3">
                <p className="font-inter text-sm font-medium text-black">
                  NID Required for Tenants?
                </p>
                <SettingsToggle
                  checked={verification.nidRequiredForTenants}
                  label="NID required for tenants"
                  onChange={() =>
                    setVerification((current) => ({
                      ...current,
                      nidRequiredForTenants: !current.nidRequiredForTenants,
                    }))
                  }
                />
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-[#e2e8f0] py-3">
                <p className="font-inter text-sm font-medium text-black">
                  Auto-approve after X days
                </p>
                <input
                  type="text"
                  inputMode="numeric"
                  aria-label="Auto-approve after X days"
                  value={verification.autoApproveDays}
                  onChange={(event) =>
                    setVerification((current) => ({
                      ...current,
                      autoApproveDays: event.target.value,
                    }))
                  }
                  className="w-[60px] rounded border border-[#e2e8f0] px-3 py-1.5 text-center font-inter text-sm font-semibold text-black outline-none focus-visible:ring-2 focus-visible:ring-brand-dark"
                />
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-[#e2e8f0] py-3">
                <p className="font-inter text-sm font-medium text-black">
                  Max listings per owner
                </p>
                <input
                  type="text"
                  inputMode="numeric"
                  aria-label="Max listings per owner"
                  value={verification.maxListingsPerOwner}
                  onChange={(event) =>
                    setVerification((current) => ({
                      ...current,
                      maxListingsPerOwner: event.target.value,
                    }))
                  }
                  className="w-[60px] rounded border border-[#e2e8f0] px-3 py-1.5 text-center font-inter text-sm font-semibold text-black outline-none focus-visible:ring-2 focus-visible:ring-brand-dark"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                className="rounded-md bg-black px-4 py-2.5 font-inter text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
              >
                Save
              </button>
            </div>
          </section>

          <section className="flex flex-col gap-5 rounded-lg bg-white p-6 shadow-[0px_4px_6px_rgba(0,0,0,0.04)]">
            <h2 className="font-inter text-base font-bold text-black">Notification Settings</h2>
            <p className="font-inter text-[13px] text-brand-dark/50">Send notifications for:</p>
            <div className="overflow-x-auto rounded-lg">
              <table className="min-w-[520px] w-full border-collapse text-left">
                <thead>
                  <tr className="bg-[#fafafa]">
                    <th className="p-3 font-inter text-xs font-bold text-brand-dark/50">EVENT</th>
                    <th className="w-20 p-3 text-center font-inter text-xs font-bold text-brand-dark/50">
                      EMAIL
                    </th>
                    <th className="w-20 p-3 text-center font-inter text-xs font-bold text-brand-dark/50">
                      SMS
                    </th>
                    <th className="w-20 p-3 text-center font-inter text-xs font-bold text-brand-dark/50">
                      IN-APP
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {notifications.map((row: NotificationEventSetting, index) => (
                    <tr
                      key={row.id}
                      className={index % 2 === 1 ? "bg-[#fafafa]" : "bg-white"}
                    >
                      <td className="p-3 font-inter text-sm text-black">{row.event}</td>
                      {(["email", "sms", "inApp"] as const).map((channel) => (
                        <td key={channel} className="p-3">
                          <div className="flex justify-center">
                            <SettingsToggle
                              checked={row[channel]}
                              label={`${row.event} ${channel}`}
                              onChange={() => toggleNotification(row.id, channel)}
                            />
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="flex flex-col gap-5 rounded-lg bg-white p-6 shadow-[0px_4px_6px_rgba(0,0,0,0.04)]">
            <h2 className="font-inter text-base font-bold text-black">Commission & Fees</h2>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex w-full flex-col gap-2 sm:w-[200px] sm:shrink-0">
                <FieldLabel htmlFor="platform-fee">Platform Fee %</FieldLabel>
                <div className="flex items-center gap-2 rounded-lg border border-black p-3">
                  <input
                    id="platform-fee"
                    type="text"
                    inputMode="numeric"
                    value={commission.platformFeePercent}
                    onChange={(event) =>
                      setCommission({ platformFeePercent: event.target.value })
                    }
                    className="w-8 bg-transparent font-inter text-xl font-bold text-black outline-none"
                  />
                  <span className="font-inter text-base text-brand-dark/50">%</span>
                </div>
              </div>
              <p className="min-w-0 flex-1 font-inter text-[13px] text-brand-dark/50">
                Applied to each completed booking.
              </p>
              <button
                type="button"
                className="w-fit shrink-0 rounded-md bg-black px-4 py-2.5 font-inter text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
              >
                Save
              </button>
            </div>
          </section>

          <section className="flex flex-col gap-5 rounded-lg border-2 border-[#ef4444] bg-white p-6">
            <h2 className="font-inter text-base font-bold text-[#ef4444]">Danger Zone</h2>
            <div className="flex flex-col">
              <div className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 flex-col gap-1">
                  <p className="font-inter text-sm font-bold text-black">
                    Clear All Draft Listings
                  </p>
                  <p className="font-inter text-xs text-brand-dark/50">
                    Permanently removes all draft listings from the platform.
                  </p>
                </div>
                <button
                  type="button"
                  className="w-fit shrink-0 rounded-md bg-[#ef4444] px-4 py-2.5 font-inter text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ef4444] focus-visible:ring-offset-2"
                >
                  Clear Drafts
                </button>
              </div>
              <div className="h-px w-full bg-[#e2e8f0]" />
              <div className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 flex-col gap-1">
                  <p className="font-inter text-sm font-bold text-black">
                    Enable Maintenance Mode
                  </p>
                  <p className="font-inter text-xs text-brand-dark/50">
                    Takes site offline, shows maintenance page to users.
                  </p>
                </div>
                <button
                  type="button"
                  className="w-fit shrink-0 rounded-md border border-black px-4 py-2.5 font-inter text-sm font-semibold text-black transition-colors hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
                >
                  Enable Maintenance
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
