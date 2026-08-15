"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getAdminSiteSettings,
  updateAdminSiteSettings,
} from "@/lib/api/admin";
import { ApiError } from "@/lib/api/client";
import type {
  AdminSiteSettingsData,
  AdminSiteSettingsUpdateInput,
  NotificationChannel,
  NotificationEventSetting,
  SiteCommissionSettings,
  SiteGeneralSettings,
  SiteVerificationSettings,
} from "@/features/admin-site-settings/types/admin-site-settings.types";

type Section = "general" | "verification" | "notifications" | "commission";

type SaveStatus =
  | { kind: "idle" }
  | { kind: "saving" }
  | { kind: "saved"; at: string }
  | { kind: "error"; message: string };

type PageState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; data: AdminSiteSettingsData };

const buildInitialData = (): AdminSiteSettingsData => ({
  general: { siteName: "", tagline: "", supportEmail: "", contactPhone: "" },
  verification: {
    nidRequiredForTenants: true,
    autoApproveDays: "",
    maxListingsPerOwner: "",
  },
  commission: { platformFeePercent: "" },
  notifications: [],
  updatedAt: null,
});

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

function FieldLabel({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: string;
}) {
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
  disabled,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-2">
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <input
        id={id}
        type="text"
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-[#e2e8f0] bg-white p-3 font-inter text-sm text-black outline-none focus-visible:ring-2 focus-visible:ring-brand-dark disabled:cursor-not-allowed disabled:bg-[#f8fafc]"
      />
    </div>
  );
}

function SaveStatusBadge({ status }: { status: SaveStatus }) {
  if (status.kind === "idle") return null;
  if (status.kind === "saving") {
    return (
      <span className="font-inter text-[12px] font-semibold text-brand-dark/60">
        Saving…
      </span>
    );
  }
  if (status.kind === "saved") {
    return (
      <span className="font-inter text-[12px] font-semibold text-[#10b981]">
        Saved
      </span>
    );
  }
  return (
    <span className="font-inter text-[12px] font-semibold text-[#ef4444]">
      {status.message}
    </span>
  );
}

function SectionSaveButton({
  section,
  status,
  onSave,
  disabled,
}: {
  section: Section;
  status: SaveStatus;
  onSave: (section: Section) => void;
  disabled?: boolean;
}) {
  const label =
    section === "general"
      ? "Save Changes"
      : section === "commission"
        ? "Save"
        : section === "verification"
          ? "Save"
          : "Save Preferences";
  return (
    <div className="flex items-center gap-3">
      <SaveStatusBadge status={status} />
      <button
        type="button"
        onClick={() => onSave(section)}
        disabled={disabled || status.kind === "saving"}
        className="rounded-md bg-black px-4 py-2.5 font-inter text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status.kind === "saving" ? "Saving…" : label}
      </button>
    </div>
  );
}

export function AdminSiteSettingsPage() {
  const [state, setState] = useState<PageState>({ status: "loading" });
  const [general, setGeneral] = useState<SiteGeneralSettings>(
    buildInitialData().general
  );
  const [verification, setVerification] = useState<SiteVerificationSettings>(
    buildInitialData().verification
  );
  const [notifications, setNotifications] = useState<NotificationEventSetting[]>(
    []
  );
  const [commission, setCommission] = useState<SiteCommissionSettings>(
    buildInitialData().commission
  );
  const [saveStatus, setSaveStatus] = useState<Record<Section, SaveStatus>>({
    general: { kind: "idle" },
    verification: { kind: "idle" },
    notifications: { kind: "idle" },
    commission: { kind: "idle" },
  });

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const data = await getAdminSiteSettings();
        if (cancelled) return;
        setGeneral(data.general);
        setVerification(data.verification);
        setNotifications(data.notifications);
        setCommission(data.commission);
        setState({ status: "ready", data });
      } catch (error) {
        if (cancelled) return;
        const message =
          error instanceof ApiError
            ? error.message
            : error instanceof Error
              ? error.message
              : "Failed to load site settings";
        setState({ status: "error", message });
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSave = useCallback(
    async (section: Section) => {
      setSaveStatus((current) => ({ ...current, [section]: { kind: "saving" } }));
      try {
        const payload: AdminSiteSettingsUpdateInput = {};
        if (section === "general") payload.general = general;
        if (section === "verification") payload.verification = verification;
        if (section === "commission") payload.commission = commission;
        if (section === "notifications") {
          payload.notifications = notifications.flatMap((row) => [
            { id: row.id, channel: "email" as const, value: row.email },
            { id: row.id, channel: "sms" as const, value: row.sms },
            { id: row.id, channel: "inApp" as const, value: row.inApp },
          ]);
        }
        const updated = await updateAdminSiteSettings(payload);
        setGeneral(updated.general);
        setVerification(updated.verification);
        setNotifications(updated.notifications);
        setCommission(updated.commission);
        setState({ status: "ready", data: updated });
        setSaveStatus((current) => ({
          ...current,
          [section]: {
            kind: "saved",
            at: new Date().toISOString(),
          },
        }));
      } catch (error) {
        const message =
          error instanceof ApiError
            ? error.message
            : error instanceof Error
              ? error.message
              : "Could not save settings";
        setSaveStatus((current) => ({
          ...current,
          [section]: { kind: "error", message },
        }));
      }
    },
    [commission, general, notifications, verification]
  );

  const toggleNotification = useCallback(
    (id: string, channel: NotificationChannel) => {
      setNotifications((current) =>
        current.map((row) =>
          row.id === id ? { ...row, [channel]: !row[channel] } : row
        )
      );
    },
    []
  );

  const isLoading = state.status === "loading";
  const isError = state.status === "error";

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-[50px] lg:py-[30px]">
      <div className="flex w-full flex-col gap-6">
        <h1 className="font-outfit text-[clamp(1.5rem,3vw,1.75rem)] font-bold text-black">
          Site Settings
        </h1>

        {isError ? (
          <div
            role="alert"
            className="rounded-md border border-[#fecaca] bg-[#fef2f2] px-4 py-3 font-inter text-[13px] text-[#b91c1c]"
          >
            {state.message}
          </div>
        ) : null}

        <div className="flex flex-col gap-6">
          <section className="flex flex-col gap-4 rounded-lg bg-white p-6 shadow-[0px_4px_6px_rgba(0,0,0,0.04)]">
            <h2 className="font-inter text-base font-bold text-black">
              General Settings
            </h2>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-4 md:flex-row">
                <TextField
                  id="site-name"
                  label="Site Name"
                  value={general.siteName}
                  onChange={(siteName) =>
                    setGeneral((current) => ({ ...current, siteName }))
                  }
                  disabled={isLoading}
                />
                <TextField
                  id="tagline"
                  label="Tagline"
                  value={general.tagline}
                  onChange={(tagline) =>
                    setGeneral((current) => ({ ...current, tagline }))
                  }
                  disabled={isLoading}
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
                  disabled={isLoading}
                />
                <TextField
                  id="contact-phone"
                  label="Contact Phone"
                  value={general.contactPhone}
                  onChange={(contactPhone) =>
                    setGeneral((current) => ({ ...current, contactPhone }))
                  }
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <SectionSaveButton
                section="general"
                status={saveStatus.general}
                onSave={handleSave}
                disabled={isLoading || isError}
              />
            </div>
          </section>

          <section className="flex flex-col gap-5 rounded-lg bg-white p-6 shadow-[0px_4px_6px_rgba(0,0,0,0.04)]">
            <h2 className="font-inter text-base font-bold text-black">
              Verification Settings
            </h2>
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
                  disabled={isLoading}
                  onChange={(event) =>
                    setVerification((current) => ({
                      ...current,
                      autoApproveDays: event.target.value,
                    }))
                  }
                  className="w-[60px] rounded border border-[#e2e8f0] px-3 py-1.5 text-center font-inter text-sm font-semibold text-black outline-none focus-visible:ring-2 focus-visible:ring-brand-dark disabled:cursor-not-allowed disabled:bg-[#f8fafc]"
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
                  disabled={isLoading}
                  onChange={(event) =>
                    setVerification((current) => ({
                      ...current,
                      maxListingsPerOwner: event.target.value,
                    }))
                  }
                  className="w-[60px] rounded border border-[#e2e8f0] px-3 py-1.5 text-center font-inter text-sm font-semibold text-black outline-none focus-visible:ring-2 focus-visible:ring-brand-dark disabled:cursor-not-allowed disabled:bg-[#f8fafc]"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <SectionSaveButton
                section="verification"
                status={saveStatus.verification}
                onSave={handleSave}
                disabled={isLoading || isError}
              />
            </div>
          </section>

          <section className="flex flex-col gap-5 rounded-lg bg-white p-6 shadow-[0px_4px_6px_rgba(0,0,0,0.04)]">
            <h2 className="font-inter text-base font-bold text-black">
              Notification Settings
            </h2>
            <p className="font-inter text-[13px] text-brand-dark/50">
              Send notifications for:
            </p>
            {notifications.length === 0 && !isLoading ? (
              <p className="font-inter text-[13px] text-[#94a3b8]">
                No notification events configured yet.
              </p>
            ) : (
              <div className="overflow-x-auto rounded-lg">
                <table className="min-w-[520px] w-full border-collapse text-left">
                  <thead>
                    <tr className="bg-[#fafafa]">
                      <th className="p-3 font-inter text-xs font-bold text-brand-dark/50">
                        EVENT
                      </th>
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
                    {notifications.map((row, index) => (
                      <tr
                        key={row.id}
                        className={index % 2 === 1 ? "bg-[#fafafa]" : "bg-white"}
                      >
                        <td className="p-3 font-inter text-sm text-black">
                          {row.event}
                        </td>
                        {(["email", "sms", "inApp"] as const).map((channel) => (
                          <td key={channel} className="p-3">
                            <div className="flex justify-center">
                              <SettingsToggle
                                checked={row[channel]}
                                label={`${row.event} ${channel}`}
                                onChange={() =>
                                  toggleNotification(row.id, channel)
                                }
                              />
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="flex justify-end">
              <SectionSaveButton
                section="notifications"
                status={saveStatus.notifications}
                onSave={handleSave}
                disabled={isLoading || isError}
              />
            </div>
          </section>

          <section className="flex flex-col gap-5 rounded-lg bg-white p-6 shadow-[0px_4px_6px_rgba(0,0,0,0.04)]">
            <h2 className="font-inter text-base font-bold text-black">
              Commission & Fees
            </h2>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex w-full flex-col gap-2 sm:w-[200px] sm:shrink-0">
                <FieldLabel htmlFor="platform-fee">Platform Fee %</FieldLabel>
                <div className="flex items-center gap-2 rounded-lg border border-black p-3">
                  <input
                    id="platform-fee"
                    type="text"
                    inputMode="numeric"
                    value={commission.platformFeePercent}
                    disabled={isLoading}
                    onChange={(event) =>
                      setCommission({
                        platformFeePercent: event.target.value,
                      })
                    }
                    className="w-8 bg-transparent font-inter text-xl font-bold text-black outline-none disabled:cursor-not-allowed"
                  />
                  <span className="font-inter text-base text-brand-dark/50">
                    %
                  </span>
                </div>
              </div>
              <p className="min-w-0 flex-1 font-inter text-[13px] text-brand-dark/50">
                Applied to each completed booking.
              </p>
              <SectionSaveButton
                section="commission"
                status={saveStatus.commission}
                onSave={handleSave}
                disabled={isLoading || isError}
              />
            </div>
          </section>

          <section className="flex flex-col gap-5 rounded-lg border-2 border-[#ef4444] bg-white p-6">
            <h2 className="font-inter text-base font-bold text-[#ef4444]">
              Danger Zone
            </h2>
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
                  disabled
                  className="w-fit shrink-0 rounded-md bg-[#ef4444] px-4 py-2.5 font-inter text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ef4444] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
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
                  disabled
                  className="w-fit shrink-0 rounded-md border border-black px-4 py-2.5 font-inter text-sm font-semibold text-black transition-colors hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
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
