"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { ProviderDocument, ProviderVerificationTabId } from "@/features/admin-provider-verification/types/admin-provider-verification.types";
import {
  approveAdminUser,
  getAdminUser,
  listAdminUsers,
  rejectAdminUser,
  suspendAdminUser,
  type AdminListUser,
  type AdminUserDetails,
} from "@/lib/api/admin";
import { ApiError } from "@/lib/api/client";

const PAGE_LIMIT = 20;

const SERVICE_CATEGORY_LABELS: Record<string, string> = {
  electrician: "Electrical",
  plumber: "Plumbing",
  cleaner: "Cleaning",
  "house-mover": "Moving",
};

function categoryLabel(value?: string | null) {
  if (!value) return "Service";
  return SERVICE_CATEGORY_LABELS[value] || value;
}

function initialOf(name?: string) {
  const trimmed = name?.trim();
  return trimmed ? trimmed.charAt(0).toUpperCase() : "?";
}

function formatJoined(value?: string | Date | null) {
  if (!value) return "Joined recently";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Joined recently";

  const diffMs = Date.now() - date.getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  if (hours < 1) return "Joined just now";
  if (hours < 24) return `Joined ${hours} hour${hours === 1 ? "" : "s"} ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `Joined ${days} day${days === 1 ? "" : "s"} ago`;
  if (days < 30) {
    const weeks = Math.floor(days / 7);
    return `Joined ${weeks} week${weeks === 1 ? "" : "s"} ago`;
  }

  return `Joined ${date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  })}`;
}

function formatApprovalDate(value?: string | Date | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatLocation(provider: AdminListUser) {
  const areas = provider.providerProfile?.serviceAreas?.filter(Boolean);
  if (areas?.length) return areas.join(", ");

  const address = provider.address;
  if (!address) return "Location not set";
  const parts = [address.area, address.district, address.division].filter(
    Boolean
  );
  return parts.length ? parts.join(", ") : "Location not set";
}

function documentList(provider: AdminListUser): ProviderDocument[] {
  const status = provider.documentStatus;
  return [
    {
      id: "nid",
      label: "NID",
      status: status?.nid ? "ready" : "pending",
    },
    {
      id: "selfie",
      label: "Selfie",
      status: status?.selfie ? "ready" : "pending",
    },
    {
      id: "cert",
      label: "Cert",
      status: status?.cert ? "ready" : "pending",
    },
  ];
}

function hasCompleteDocuments(provider: AdminListUser) {
  const status = provider.documentStatus;
  return Boolean(status?.nid && status?.selfie && status?.cert);
}

function tabToApprovalStatus(
  tab: ProviderVerificationTabId
): "pending" | "approved" | "rejected" {
  if (tab === "verified") return "approved";
  if (tab === "rejected") return "rejected";
  return "pending";
}

function DocumentBadge({ document }: { document: ProviderDocument }) {
  const isReady = document.status === "ready";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 font-inter text-[10px] font-semibold sm:gap-1.5 sm:px-2 sm:py-1 sm:text-[11px] md:text-xs ${
        isReady
          ? "border-[#10b981] bg-[#e8f5e9] text-[#10b981]"
          : "border-[#f59e0b] bg-[#fff8e1] text-[#f59e0b]"
      }`}
    >
      <Image
        src={isReady ? "/images/admin/icon-doc-check.svg" : "/images/admin/icon-doc-clock.svg"}
        alt=""
        width={10}
        height={10}
        aria-hidden="true"
        className="size-2 sm:size-2.5"
      />
      {document.label}
    </span>
  );
}

function ProviderVerificationCard({
  provider,
  busy,
  onView,
  onApprove,
  onReject,
}: {
  provider: AdminListUser;
  busy?: boolean;
  onView: () => void;
  onApprove: () => void;
  onReject: () => void;
}) {
  const documents = documentList(provider);
  const canApprove = provider.approvalStatus === "pending";
  const canReject = provider.approvalStatus === "pending";

  const actionBtn =
    "inline-flex w-full items-center justify-center rounded-md px-2.5 py-2 font-inter text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-60 min-[480px]:w-auto min-[480px]:min-w-24 sm:px-3 sm:py-2.5 sm:text-[13px] sm:min-w-28 md:min-w-[7.5rem]";

  return (
    <article className="flex flex-col gap-3 rounded-lg bg-white p-3 shadow-[0px_4px_6px_rgba(0,0,0,0.04)] sm:gap-4 sm:p-4 md:gap-5 md:p-5">
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-start sm:justify-between sm:gap-4 md:gap-6">
        <div className="flex min-w-0 items-center gap-2.5 sm:gap-3 md:gap-4">
          {provider.avatarUrl ? (
            <Image
              src={provider.avatarUrl}
              alt=""
              width={56}
              height={56}
              className="size-10 shrink-0 rounded-full object-cover sm:size-12 md:size-14"
            />
          ) : (
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#e2e8f0] sm:size-12 md:size-14">
              <span className="font-outfit text-base font-bold text-[#475569] sm:text-lg md:text-xl">
                {initialOf(provider.fullName)}
              </span>
            </div>
          )}
          <div className="flex min-w-0 flex-col gap-0.5 sm:gap-1">
            <h2 className="truncate font-inter text-[13px] font-bold text-black sm:text-sm md:text-[15px]">
              {provider.fullName || provider.email}
            </h2>
            <span className="inline-flex w-fit rounded bg-[#0f0f0f] px-1.5 py-0.5 font-inter text-[9px] font-semibold text-white sm:px-2 sm:text-[10px] md:text-[11px]">
              {categoryLabel(provider.providerProfile?.serviceCategory)}
            </span>
          </div>
        </div>

        <div className="min-w-0 font-inter text-xs sm:max-w-[40%] sm:text-right sm:text-[13px] md:text-sm">
          <p className="text-[#475569]">{formatJoined(provider.createdAt)}</p>
          <p className="mt-0.5 break-words text-[#94a3b8]">
            {formatLocation(provider)}
          </p>
          {provider.emailVerified ? null : (
            <p className="mt-0.5 text-[#f59e0b]">Email not verified</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2.5 border-t border-[#f1f5f9] pt-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:pt-4 md:gap-4">
        <div className="flex min-w-0 flex-col gap-1.5 sm:gap-2">
          <p className="font-inter text-[10px] font-semibold uppercase text-[#94a3b8] sm:text-[11px] md:text-xs">
            Documents
          </p>
          <div className="flex flex-wrap gap-1 sm:gap-1.5">
            {documents.map((document) => (
              <DocumentBadge key={document.id} document={document} />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-1.5 min-[480px]:grid-cols-3 sm:flex sm:flex-wrap sm:justify-end sm:gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={onView}
            className={`${actionBtn} border border-[#e2e8f0] text-black hover:bg-[#f8fafc] focus-visible:ring-brand-dark`}
          >
            View Profile
          </button>
          {canApprove ? (
            <button
              type="button"
              disabled={busy}
              onClick={onApprove}
              className={`${actionBtn} bg-[#0f0f0f] text-white hover:opacity-90 focus-visible:ring-brand-dark`}
            >
              Approve ✓
            </button>
          ) : null}
          {canReject ? (
            <button
              type="button"
              disabled={busy}
              onClick={onReject}
              className={`${actionBtn} border border-[#ef4444] text-[#ef4444] hover:bg-[#ef4444]/5 focus-visible:ring-[#ef4444]`}
            >
              Reject ✗
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function RecentlyVerifiedTable({
  providers,
  busy,
  onRevoke,
}: {
  providers: AdminListUser[];
  busy?: boolean;
  onRevoke: (provider: AdminListUser) => void;
}) {
  return (
    <section className="flex w-full flex-col gap-4">
      <h2 className="font-outfit text-lg font-semibold text-black">
        Recently Verified Providers
      </h2>
      <div className="overflow-hidden rounded-[20px] bg-white shadow-[0px_4px_12px_rgba(0,0,0,0.04)]">
        <div className="overflow-x-auto">
          <table className="min-w-[720px] w-full border-collapse text-left">
            <thead>
              <tr className="bg-[#fafafa]">
                <th className="px-5 py-3 font-inter text-[11px] font-bold text-[#94a3b8]">
                  NAME
                </th>
                <th className="w-[150px] px-0 py-3 font-inter text-[11px] font-bold text-[#94a3b8]">
                  CATEGORY
                </th>
                <th className="w-[150px] px-0 py-3 font-inter text-[11px] font-bold text-[#94a3b8]">
                  APPROVAL DATE
                </th>
                <th className="w-[120px] px-0 py-3 font-inter text-[11px] font-bold text-[#94a3b8]">
                  STATUS
                </th>
                <th className="w-20 px-5 py-3 text-right font-inter text-[11px] font-bold text-[#94a3b8]">
                  ACTION
                </th>
              </tr>
            </thead>
            <tbody>
              {providers.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-8 font-inter text-sm text-[#94a3b8]"
                  >
                    No verified providers yet.
                  </td>
                </tr>
              ) : (
                providers.map((provider) => (
                  <tr key={provider.id} className="border-b border-[#f1f5f9]">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-2xl bg-[#0f0f0f]">
                          <span className="font-inter text-xs font-bold text-white">
                            {initialOf(provider.fullName)}
                          </span>
                        </div>
                        <p className="font-inter text-sm font-semibold text-black">
                          {provider.fullName || provider.email}
                        </p>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="inline-flex rounded bg-[#0f0f0f] px-2 py-1 font-inter text-[11px] font-semibold text-white">
                        {categoryLabel(provider.providerProfile?.serviceCategory)}
                      </span>
                    </td>
                    <td className="py-4 font-inter text-[13px] text-[#475569]">
                      {formatApprovalDate(provider.approvedAt)}
                    </td>
                    <td className="py-4">
                      <span className="inline-flex items-center gap-1 rounded bg-[#e8f5e9] px-2 py-1 font-inter text-[11px] text-[#10b981]">
                        <span className="font-bold">✓</span>
                        <span className="font-semibold">Verified</span>
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        disabled={busy || provider.accountStatus === "suspended"}
                        onClick={() => onRevoke(provider)}
                        className="font-inter text-[13px] font-semibold text-[#ef4444] underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ef4444] focus-visible:ring-offset-2 disabled:opacity-50"
                      >
                        {provider.accountStatus === "suspended"
                          ? "Revoked"
                          : "Revoke"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function DocumentPreview({
  label,
  url,
}: {
  label: string;
  url?: string | null;
}) {
  if (!url) {
    return (
      <div className="flex min-h-[160px] flex-col items-center justify-center rounded-lg border border-dashed border-[#e2e8f0] bg-[#fafaf8] px-3 py-4 text-center">
        <p className="font-inter text-xs font-semibold text-[#94a3b8]">{label}</p>
        <p className="mt-1 font-inter text-[11px] text-[#94a3b8]/70">
          Not uploaded
        </p>
      </div>
    );
  }

  const isPdf =
    url.toLowerCase().includes(".pdf") || url.toLowerCase().includes("/raw/");

  return (
    <div className="overflow-hidden rounded-lg border border-[#e2e8f0] bg-white">
      <div className="flex items-center justify-between gap-2 border-b border-[#e2e8f0] px-3 py-2">
        <p className="font-inter text-xs font-semibold text-brand-dark">{label}</p>
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="font-inter text-[11px] font-semibold text-brand-dark/60 underline-offset-2 hover:underline"
        >
          Open
        </a>
      </div>
      {isPdf ? (
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="flex min-h-[160px] items-center justify-center bg-[#f7f7f5] px-3 py-6 font-inter text-sm font-medium text-brand-dark/70 hover:bg-[#f1f1ef]"
        >
          PDF document — open
        </a>
      ) : (
        <a href={url} target="_blank" rel="noreferrer" className="block">
          {/* Cloudinary signed URLs — native img avoids Next optimizer auth issues */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt={label}
            className="h-[160px] w-full bg-[#f7f7f5] object-cover"
          />
        </a>
      )}
    </div>
  );
}

function ProfileModal({
  provider,
  details,
  loading,
  busy,
  onClose,
  onApprove,
  onReject,
}: {
  provider: AdminListUser;
  details: AdminUserDetails | null;
  loading: boolean;
  busy?: boolean;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
}) {
  const docs = details?.documents;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Provider profile"
        className="max-h-[90dvh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5 shadow-xl sm:p-6"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-outfit text-xl font-bold text-black">
              {provider.fullName || provider.email}
            </h2>
            <p className="mt-1 font-inter text-sm text-[#64748b]">
              {categoryLabel(provider.providerProfile?.serviceCategory)} ·{" "}
              {provider.email}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-2 py-1 font-inter text-sm font-semibold text-[#64748b] hover:bg-[#f8fafc]"
          >
            Close
          </button>
        </div>

        {loading ? (
          <p className="mt-6 font-inter text-sm text-[#64748b]">
            Loading profile…
          </p>
        ) : (
          <div className="mt-6 flex flex-col gap-5">
            <dl className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="font-inter text-[11px] font-semibold uppercase text-[#94a3b8]">
                  Phone
                </dt>
                <dd className="font-inter text-sm text-black">
                  {details?.user.phone || "—"}
                </dd>
              </div>
              <div>
                <dt className="font-inter text-[11px] font-semibold uppercase text-[#94a3b8]">
                  Experience
                </dt>
                <dd className="font-inter text-sm text-black">
                  {details?.profile?.yearsOfExperience || "—"}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="font-inter text-[11px] font-semibold uppercase text-[#94a3b8]">
                  Service areas
                </dt>
                <dd className="font-inter text-sm text-black">
                  {details?.profile?.serviceAreas?.join(", ") ||
                    formatLocation(provider)}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="font-inter text-[11px] font-semibold uppercase text-[#94a3b8]">
                  Bio
                </dt>
                <dd className="font-inter text-sm text-black">
                  {details?.profile?.bio || "—"}
                </dd>
              </div>
            </dl>

            <div className="grid gap-3 sm:grid-cols-3">
              <DocumentPreview label="NID Front" url={docs?.nidFrontUrl} />
              <DocumentPreview label="Selfie" url={docs?.selfieUrl} />
              <DocumentPreview
                label="Trade Cert"
                url={docs?.tradeCertificateUrl}
              />
            </div>

            {provider.approvalStatus === "pending" ? (
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  disabled={busy}
                  onClick={onReject}
                  className="rounded-md border border-[#ef4444] px-4 py-2.5 font-inter text-sm font-semibold text-[#ef4444] disabled:opacity-60"
                >
                  Reject
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={onApprove}
                  className="rounded-md bg-[#0f0f0f] px-4 py-2.5 font-inter text-sm font-semibold text-white disabled:opacity-60"
                >
                  Approve
                </button>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

export function AdminProviderVerificationPage() {
  const [activeTab, setActiveTab] = useState<ProviderVerificationTabId>("pending");
  const [providers, setProviders] = useState<AdminListUser[]>([]);
  const [recentProviders, setRecentProviders] = useState<AdminListUser[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [tabCounts, setTabCounts] = useState({
    pending: 0,
    "under-review": 0,
    verified: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentLoading, setRecentLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [selected, setSelected] = useState<AdminListUser | null>(null);
  const [details, setDetails] = useState<AdminUserDetails | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const loadTabCounts = useCallback(async () => {
    const [pending, approved, rejected] = await Promise.all([
      listAdminUsers({
        role: "service_provider",
        approvalStatus: "pending",
        limit: 100,
        page: 1,
        sortBy: "createdAt",
        sortOrder: "desc",
      }),
      listAdminUsers({
        role: "service_provider",
        approvalStatus: "approved",
        limit: 1,
        page: 1,
      }),
      listAdminUsers({
        role: "service_provider",
        approvalStatus: "rejected",
        limit: 1,
        page: 1,
      }),
    ]);

    const underReview = pending.items.filter(hasCompleteDocuments).length;
    setPendingCount(pending.pagination?.total || pending.items.length);
    setTabCounts({
      pending: pending.pagination?.total || pending.items.length,
      "under-review": underReview,
      verified: approved.pagination?.total || 0,
      rejected: rejected.pagination?.total || 0,
    });
  }, []);

  const loadProviders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const approvalStatus = tabToApprovalStatus(activeTab);
      const result = await listAdminUsers({
        role: "service_provider",
        approvalStatus,
        page: 1,
        limit: PAGE_LIMIT,
        sortBy: "createdAt",
        sortOrder: "desc",
      });

      const items =
        activeTab === "under-review"
          ? result.items.filter(hasCompleteDocuments)
          : activeTab === "pending"
            ? result.items
            : result.items;

      setProviders(items);
    } catch (err) {
      setError(
        err instanceof ApiError || err instanceof Error
          ? err.message
          : "Could not load providers"
      );
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  const loadRecent = useCallback(async () => {
    setRecentLoading(true);
    try {
      const result = await listAdminUsers({
        role: "service_provider",
        approvalStatus: "approved",
        page: 1,
        limit: 8,
        sortBy: "createdAt",
        sortOrder: "desc",
      });
      setRecentProviders(result.items);
    } catch {
      setRecentProviders([]);
    } finally {
      setRecentLoading(false);
    }
  }, []);

  const refreshAll = useCallback(async () => {
    await Promise.all([loadProviders(), loadRecent(), loadTabCounts()]);
  }, [loadProviders, loadRecent, loadTabCounts]);

  useEffect(() => {
    void loadProviders();
  }, [loadProviders]);

  useEffect(() => {
    void loadRecent();
    void loadTabCounts();
  }, [loadRecent, loadTabCounts]);

  const tabs = useMemo(
    () =>
      [
        { id: "pending" as const, label: `Pending (${tabCounts.pending})` },
        {
          id: "under-review" as const,
          label: `Under Review (${tabCounts["under-review"]})`,
        },
        { id: "verified" as const, label: `Verified (${tabCounts.verified})` },
        { id: "rejected" as const, label: `Rejected (${tabCounts.rejected})` },
      ] as const,
    [tabCounts]
  );

  const openProfile = (provider: AdminListUser) => {
    if (!provider.id) return;
    setSelected(provider);
    setDetails(null);
    setDetailsLoading(true);
    void getAdminUser(provider.id)
      .then((result) => setDetails(result))
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Could not load profile")
      )
      .finally(() => setDetailsLoading(false));
  };

  const closeProfile = () => {
    setSelected(null);
    setDetails(null);
    setDetailsLoading(false);
  };

  const runApprove = async (provider: AdminListUser) => {
    if (!provider.id) return;
    setBusyId(provider.id);
    setError(null);
    try {
      await approveAdminUser(provider.id);
      closeProfile();
      await refreshAll();
    } catch (err) {
      setError(
        err instanceof ApiError || err instanceof Error
          ? err.message
          : "Could not approve provider"
      );
    } finally {
      setBusyId(null);
    }
  };

  const runReject = async (provider: AdminListUser) => {
    if (!provider.id) return;
    const reason = window.prompt(
      "Rejection reason (optional):",
      "Documents incomplete or unclear"
    );
    if (reason === null) return;

    setBusyId(provider.id);
    setError(null);
    try {
      await rejectAdminUser(provider.id, {
        reason: reason.trim() || undefined,
      });
      closeProfile();
      await refreshAll();
    } catch (err) {
      setError(
        err instanceof ApiError || err instanceof Error
          ? err.message
          : "Could not reject provider"
      );
    } finally {
      setBusyId(null);
    }
  };

  const runRevoke = async (provider: AdminListUser) => {
    if (!provider.id) return;
    const reason = window.prompt(
      "Revoke / suspend reason (optional):",
      "Verification revoked by admin"
    );
    if (reason === null) return;

    setBusyId(provider.id);
    setError(null);
    try {
      await suspendAdminUser(provider.id, {
        reason: reason.trim() || undefined,
      });
      await refreshAll();
    } catch (err) {
      setError(
        err instanceof ApiError || err instanceof Error
          ? err.message
          : "Could not revoke provider"
      );
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-[50px] lg:py-[30px]">
      <div className="flex w-full flex-col gap-10">
        <div className="flex flex-col gap-6">
          <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:pb-6">
            <h1 className="font-outfit text-[clamp(1.5rem,3vw,1.75rem)] font-bold text-black">
              Service Provider Verification
            </h1>
            <span className="inline-flex w-fit items-center rounded bg-[#f59e0b] px-3 py-1.5 font-inter text-[13px] font-bold text-white">
              {pendingCount} Pending
            </span>
          </header>

          {error ? (
            <p role="alert" className="font-inter text-sm font-medium text-red-600">
              {error}
            </p>
          ) : null}

          <div className="flex flex-col gap-4">
            <div
              role="tablist"
              aria-label="Provider verification filters"
              className="flex gap-1.5 overflow-x-auto pb-1 sm:gap-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {tabs.map((tab) => {
                const isActive = tab.id === activeTab;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveTab(tab.id)}
                    className={`shrink-0 rounded-full border border-[#e2e8f0] px-2.5 py-1.5 font-inter text-[11px] whitespace-nowrap transition-colors sm:px-3.5 sm:py-2 sm:text-xs md:px-4 md:py-2.5 md:text-[13px] ${
                      isActive
                        ? "bg-[#0f0f0f] font-bold text-white"
                        : "bg-white font-medium text-[#475569]"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-col gap-4">
              {loading ? (
                <p className="rounded-lg bg-white p-6 font-inter text-sm text-[#64748b] shadow-[0px_4px_6px_rgba(0,0,0,0.04)]">
                  Loading providers…
                </p>
              ) : providers.length === 0 ? (
                <p className="rounded-lg bg-white p-6 font-inter text-sm text-[#64748b] shadow-[0px_4px_6px_rgba(0,0,0,0.04)]">
                  No providers in this tab.
                </p>
              ) : (
                providers.map((provider) => (
                  <ProviderVerificationCard
                    key={provider.id}
                    provider={provider}
                    busy={busyId === provider.id}
                    onView={() => openProfile(provider)}
                    onApprove={() => void runApprove(provider)}
                    onReject={() => void runReject(provider)}
                  />
                ))
              )}
            </div>
          </div>
        </div>

        {recentLoading ? (
          <p className="font-inter text-sm text-[#64748b]">
            Loading recently verified…
          </p>
        ) : (
          <RecentlyVerifiedTable
            providers={recentProviders}
            busy={Boolean(busyId)}
            onRevoke={(provider) => void runRevoke(provider)}
          />
        )}
      </div>

      {selected ? (
        <ProfileModal
          provider={selected}
          details={details}
          loading={detailsLoading}
          busy={busyId === selected.id}
          onClose={closeProfile}
          onApprove={() => void runApprove(selected)}
          onReject={() => void runReject(selected)}
        />
      ) : null}
    </div>
  );
}
