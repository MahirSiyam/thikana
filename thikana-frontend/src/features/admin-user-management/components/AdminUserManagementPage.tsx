"use client";

import { useCallback, useEffect, useState } from "react";
import {
  approveAdminUser,
  getAdminUser,
  listAdminUsers,
  reactivateAdminUser,
  rejectAdminUser,
  suspendAdminUser,
  type AdminUserDetails,
} from "@/lib/api/admin";
import type {
  AccountStatus,
  ApprovalStatus,
  AppRole,
  MeUser,
} from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";

type TabId = "all" | "tenants" | "owners" | "providers" | "admins" | "suspended";

type ActionKind = "approve" | "reject" | "suspend" | "reactivate" | "view";

const tabs: { id: TabId; label: string }[] = [
  { id: "all", label: "All Users" },
  { id: "tenants", label: "Tenants" },
  { id: "owners", label: "Owners" },
  { id: "providers", label: "Providers" },
  { id: "admins", label: "Admins" },
  { id: "suspended", label: "Suspended" },
];

const roleLabel = (role?: AppRole | null) => {
  if (!role) return "—";
  if (role === "service_provider") return "Provider";
  return role.charAt(0).toUpperCase() + role.slice(1);
};

const formatDate = (value?: string | Date | null) => {
  if (!value) return "—";
  return new Date(value).toLocaleString();
};

const formatAddress = (address?: {
  division?: string;
  district?: string;
  area?: string;
}) => {
  if (!address) return "—";
  const parts = [address.area, address.district, address.division].filter(
    Boolean
  );
  return parts.length ? parts.join(", ") : "—";
};

function DetailRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="font-inter text-[11px] font-semibold uppercase tracking-wide text-brand-dark/45">
        {label}
      </dt>
      <dd className="font-inter text-sm text-brand-dark">{value || "—"}</dd>
    </div>
  );
}

function DocumentCard({
  label,
  url,
}: {
  label: string;
  url?: string | null;
}) {
  if (!url) {
    return (
      <div className="flex min-h-[140px] flex-col items-center justify-center rounded-lg border border-dashed border-[#d9d9d6] bg-[#fafaf8] px-3 py-4 text-center">
        <p className="font-inter text-xs font-semibold text-brand-dark/50">
          {label}
        </p>
        <p className="mt-1 font-inter text-[11px] text-brand-dark/40">
          Not uploaded
        </p>
      </div>
    );
  }

  const isPdf =
    url.toLowerCase().includes(".pdf") || url.toLowerCase().includes("/raw/");

  return (
    <div className="overflow-hidden rounded-lg border border-[#e5e5e2] bg-white">
      <div className="flex items-center justify-between gap-2 border-b border-[#e5e5e2] px-3 py-2">
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
        <div className="flex min-h-[140px] items-center justify-center bg-[#f7f7f5] px-3 py-6">
          <p className="font-inter text-sm font-medium text-brand-dark/70">
            PDF document
          </p>
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt={label}
          className="h-[160px] w-full object-cover bg-[#f7f7f5]"
        />
      )}
    </div>
  );
}

function UserReviewPanel({
  details,
  loading,
  pendingAction,
  reason,
  busy,
  onReasonChange,
  onClose,
  onApprove,
  onReject,
  onConfirmPending,
  onCancelPending,
}: {
  details: AdminUserDetails | null;
  loading: boolean;
  pendingAction: "approve" | "reject" | null;
  reason: string;
  busy: boolean;
  onReasonChange: (value: string) => void;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
  onConfirmPending: () => void;
  onCancelPending: () => void;
}) {
  const user = details?.user;
  const profile = details?.profile;
  const docs = details?.documents;
  const isPending = user?.approvalStatus === "pending";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 px-3 py-3 sm:items-center sm:px-4">
      <div className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex items-start justify-between gap-3 border-b border-[#e5e5e2] px-5 py-4">
          <div>
            <h2 className="font-inter text-lg font-bold text-brand-dark">
              Registration review
            </h2>
            <p className="mt-1 font-inter text-sm text-brand-dark/60">
              {user
                ? `${user.fullName || "User"} · ${roleLabel(user.role)}`
                : "Loading user details…"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="rounded-lg border border-[#e5e5e2] px-3 py-1.5 font-inter text-sm font-semibold text-brand-dark/70"
          >
            Close
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          {loading || !details || !user ? (
            <p className="font-inter text-sm text-brand-dark/60">
              Loading full registration details…
            </p>
          ) : (
            <div className="flex flex-col gap-5">
              <section className="rounded-xl border border-[#e5e5e2] bg-[#fafaf8] p-4">
                <h3 className="mb-3 font-inter text-sm font-bold text-brand-dark">
                  Account overview
                </h3>
                <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <DetailRow label="Full name" value={user.fullName} />
                  <DetailRow label="Email" value={user.email} />
                  <DetailRow label="Phone" value={user.phone} />
                  <DetailRow label="Role" value={roleLabel(user.role)} />
                  <DetailRow
                    label="Email verified"
                    value={user.emailVerified ? "Yes" : "No"}
                  />
                  <DetailRow
                    label="Approval"
                    value={user.approvalStatus || "—"}
                  />
                  <DetailRow
                    label="Account status"
                    value={user.accountStatus || "—"}
                  />
                  <DetailRow
                    label="Address"
                    value={formatAddress(user.address)}
                  />
                  <DetailRow
                    label="Registered"
                    value={formatDate(user.createdAt)}
                  />
                </dl>
              </section>

              {profile ? (
                <section className="rounded-xl border border-[#e5e5e2] p-4">
                  <h3 className="mb-3 font-inter text-sm font-bold text-brand-dark">
                    Role details
                  </h3>
                  <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {user.role === "tenant" ? (
                      <>
                        <DetailRow label="Looking as" value={profile.lookingAs} />
                        <DetailRow
                          label="Preferred location"
                          value={profile.preferredLocation}
                        />
                        <DetailRow
                          label="Budget range"
                          value={profile.budgetRange}
                        />
                      </>
                    ) : null}
                    {user.role === "owner" ? (
                      <>
                        <DetailRow
                          label="Properties"
                          value={profile.propertyCount}
                        />
                        <DetailRow
                          label="Preferred contact"
                          value={profile.preferredContactMethod}
                        />
                      </>
                    ) : null}
                    {user.role === "service_provider" ? (
                      <>
                        <DetailRow
                          label="Service category"
                          value={profile.serviceCategory}
                        />
                        <DetailRow
                          label="Experience"
                          value={profile.yearsOfExperience}
                        />
                        <DetailRow
                          label="Service areas"
                          value={
                            profile.serviceAreas?.length
                              ? profile.serviceAreas.join(", ")
                              : "—"
                          }
                        />
                        <DetailRow label="Bio" value={profile.bio} />
                      </>
                    ) : null}
                  </dl>
                </section>
              ) : null}

              <section>
                <h3 className="mb-3 font-inter text-sm font-bold text-brand-dark">
                  Identity & documents
                </h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <DocumentCard label="NID — Front" url={docs?.nidFrontUrl} />
                  <DocumentCard label="NID — Back" url={docs?.nidBackUrl} />
                  <DocumentCard label="Selfie" url={docs?.selfieUrl} />
                  {user.role === "owner" ? (
                    <DocumentCard
                      label="Ownership proof"
                      url={docs?.ownershipProofUrl}
                    />
                  ) : null}
                  {user.role === "service_provider" ? (
                    <DocumentCard
                      label="Trade certificate"
                      url={docs?.tradeCertificateUrl}
                    />
                  ) : null}
                </div>
              </section>

              {details.adminMeta?.rejectionReason ||
              details.adminMeta?.suspensionReason ? (
                <section className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <h3 className="mb-2 font-inter text-sm font-bold text-amber-900">
                    Admin notes
                  </h3>
                  {details.adminMeta.rejectionReason ? (
                    <p className="font-inter text-sm text-amber-900">
                      Rejection: {details.adminMeta.rejectionReason}
                    </p>
                  ) : null}
                  {details.adminMeta.suspensionReason ? (
                    <p className="mt-1 font-inter text-sm text-amber-900">
                      Suspension: {details.adminMeta.suspensionReason}
                    </p>
                  ) : null}
                </section>
              ) : null}
            </div>
          )}
        </div>

        <div className="border-t border-[#e5e5e2] px-5 py-4">
          {pendingAction ? (
            <div className="flex flex-col gap-3">
              <label className="font-inter text-sm font-semibold text-brand-dark">
                {pendingAction === "approve"
                  ? "Optional note"
                  : "Rejection reason (optional)"}
              </label>
              <textarea
                value={reason}
                onChange={(event) => onReasonChange(event.target.value)}
                rows={2}
                className="w-full rounded-lg border border-[#e5e5e2] p-3 font-inter text-sm outline-none focus-visible:ring-2 focus-visible:ring-brand-dark/20"
                placeholder={
                  pendingAction === "approve"
                    ? "Add an internal note…"
                    : "Tell the user why they were rejected…"
                }
              />
              <div className="flex flex-wrap justify-end gap-2">
                <button
                  type="button"
                  onClick={onCancelPending}
                  disabled={busy}
                  className="rounded-lg border border-[#e5e5e2] px-3 py-2 font-inter text-sm font-semibold"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={onConfirmPending}
                  disabled={busy || !user?.id}
                  className={`rounded-lg px-3 py-2 font-inter text-sm font-semibold text-white disabled:opacity-60 ${
                    pendingAction === "approve" ? "bg-brand-dark" : "bg-red-600"
                  }`}
                >
                  {busy
                    ? "Working…"
                    : pendingAction === "approve"
                      ? "Confirm approve"
                      : "Confirm reject"}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap justify-end gap-2">
              {isPending ? (
                <>
                  <button
                    type="button"
                    onClick={onReject}
                    disabled={busy || loading}
                    className="rounded-lg border border-red-300 px-3 py-2 font-inter text-sm font-semibold text-red-600 disabled:opacity-60"
                  >
                    Reject
                  </button>
                  <button
                    type="button"
                    onClick={onApprove}
                    disabled={busy || loading}
                    className="rounded-lg bg-brand-dark px-3 py-2 font-inter text-sm font-semibold text-white disabled:opacity-60"
                  >
                    Approve
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg border border-[#e5e5e2] px-3 py-2 font-inter text-sm font-semibold"
                >
                  Done
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function AdminUserManagementPage() {
  const [activeTab, setActiveTab] = useState<TabId>("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState<MeUser[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionUser, setActionUser] = useState<MeUser | null>(null);
  const [actionKind, setActionKind] = useState<ActionKind | null>(null);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [details, setDetails] = useState<AdminUserDetails | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [reviewPendingAction, setReviewPendingAction] = useState<
    "approve" | "reject" | null
  >(null);

  const buildFilters = useCallback(() => {
    const filters: {
      role?: AppRole;
      accountStatus?: AccountStatus;
      approvalStatus?: ApprovalStatus;
    } = {};

    if (activeTab === "tenants") filters.role = "tenant";
    if (activeTab === "owners") filters.role = "owner";
    if (activeTab === "providers") filters.role = "service_provider";
    if (activeTab === "admins") filters.role = "admin";
    if (activeTab === "suspended") filters.accountStatus = "suspended";

    return filters;
  }, [activeTab]);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await listAdminUsers({
        page,
        limit: 20,
        search: query.trim() || undefined,
        ...buildFilters(),
        sortBy: "createdAt",
        sortOrder: "desc",
      });
      setUsers(result.items);
      setTotalPages(result.pagination?.totalPages || 1);
      setTotal(result.pagination?.total || result.items.length);
    } catch (err) {
      setError(
        err instanceof ApiError || err instanceof Error
          ? err.message
          : "Could not load users"
      );
    } finally {
      setLoading(false);
    }
  }, [buildFilters, page, query]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void loadUsers();
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [loadUsers]);

  const openAction = (user: MeUser, kind: ActionKind) => {
    setActionUser(user);
    setActionKind(kind);
    setReason("");
    setDetails(null);
    setReviewPendingAction(null);

    if ((kind === "view" || kind === "approve" || kind === "reject") && user.id) {
      setDetailsLoading(true);
      void getAdminUser(user.id)
        .then((result) => {
          setDetails(result);
          if (kind === "approve") setReviewPendingAction("approve");
          if (kind === "reject") setReviewPendingAction("reject");
        })
        .catch((err) =>
          setError(err instanceof Error ? err.message : "Could not load details")
        )
        .finally(() => setDetailsLoading(false));
    }
  };

  const closeAction = () => {
    setActionUser(null);
    setActionKind(null);
    setReason("");
    setDetails(null);
    setReviewPendingAction(null);
    setDetailsLoading(false);
  };

  const runAction = async (
    kind: Exclude<ActionKind, "view">,
    userId: string
  ) => {
    setBusy(true);
    setError(null);
    try {
      if (kind === "approve") {
        await approveAdminUser(userId, reason || undefined);
      } else if (kind === "reject") {
        await rejectAdminUser(userId, { reason: reason || undefined });
      } else if (kind === "suspend") {
        await suspendAdminUser(userId, { reason: reason || undefined });
      } else if (kind === "reactivate") {
        await reactivateAdminUser(userId, reason || undefined);
      }
      closeAction();
      await loadUsers();
    } catch (err) {
      setError(
        err instanceof ApiError || err instanceof Error
          ? err.message
          : "Action failed"
      );
    } finally {
      setBusy(false);
    }
  };

  const showReview =
    actionUser &&
    actionKind &&
    (actionKind === "view" ||
      actionKind === "approve" ||
      actionKind === "reject");

  const showSimpleAction =
    actionUser &&
    actionKind &&
    (actionKind === "suspend" || actionKind === "reactivate");

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-[50px] lg:py-[30px]">
      <div className="flex w-full flex-col gap-6">
        <header className="flex flex-col gap-2">
          <h1 className="font-inter text-[clamp(1.5rem,3vw,1.75rem)] font-bold text-black">
            User Management
          </h1>
          <p className="font-inter text-sm text-brand-dark/60">
            Review registrations, check documents, approve accounts, and manage
            access across all roles.
          </p>
        </header>

        <div className="flex flex-wrap gap-2 border-b border-[#e5e5e2] pb-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id);
                setPage(1);
              }}
              className={`rounded-full px-3 py-1.5 font-inter text-sm font-semibold ${
                activeTab === tab.id
                  ? "bg-brand-dark text-white"
                  : "bg-[#f5f5f3] text-brand-dark/70"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <input
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder="Search by name, email, phone, or ID"
            className="h-11 w-full max-w-md rounded-lg border border-[#e5e5e2] bg-white px-3 font-inter text-sm outline-none focus-visible:ring-2 focus-visible:ring-brand-dark/20"
          />
          <p className="font-inter text-sm text-brand-dark/50">{total} users</p>
        </div>

        {error ? (
          <p role="alert" className="font-inter text-sm font-medium text-red-600">
            {error}
          </p>
        ) : null}

        <div className="overflow-hidden rounded-xl border border-[#e5e5e2] bg-white">
          {loading ? (
            <p className="p-6 font-inter text-sm text-brand-dark/60">
              Loading users…
            </p>
          ) : users.length === 0 ? (
            <p className="p-6 font-inter text-sm text-brand-dark/60">
              No users found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead className="bg-[#f5f5f3] font-inter text-[11px] font-semibold uppercase text-[#6b7280]">
                  <tr>
                    <th className="px-4 py-3">User</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Email Verified</th>
                    <th className="px-4 py-3">Approval</th>
                    <th className="px-4 py-3">Account</th>
                    <th className="px-4 py-3">Registered</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user.id || user.firebaseUid}
                      className="border-t border-[#e5e5e2]"
                    >
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <span className="font-inter text-sm font-semibold text-brand-dark">
                            {user.fullName || "—"}
                          </span>
                          <span className="font-inter text-xs text-brand-dark/50">
                            {user.email}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-inter text-sm">
                        {roleLabel(user.role)}
                      </td>
                      <td className="px-4 py-3 font-inter text-sm">
                        {user.emailVerified ? "Yes" : "No"}
                      </td>
                      <td className="px-4 py-3 font-inter text-sm capitalize">
                        {user.approvalStatus || "—"}
                      </td>
                      <td className="px-4 py-3 font-inter text-sm capitalize">
                        {user.accountStatus || "—"}
                      </td>
                      <td className="px-4 py-3 font-inter text-sm text-brand-dark/60">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openAction(user, "view")}
                            className="rounded border border-[#e5e5e2] px-2 py-1 font-inter text-xs font-semibold"
                          >
                            Review
                          </button>
                          {user.approvalStatus === "pending" ? (
                            <>
                              <button
                                type="button"
                                onClick={() => openAction(user, "approve")}
                                className="rounded bg-brand-dark px-2 py-1 font-inter text-xs font-semibold text-white"
                              >
                                Approve
                              </button>
                              <button
                                type="button"
                                onClick={() => openAction(user, "reject")}
                                className="rounded border border-red-300 px-2 py-1 font-inter text-xs font-semibold text-red-600"
                              >
                                Reject
                              </button>
                            </>
                          ) : null}
                          {user.approvalStatus === "approved" &&
                          user.accountStatus === "active" ? (
                            <button
                              type="button"
                              onClick={() => openAction(user, "suspend")}
                              className="rounded border border-amber-300 px-2 py-1 font-inter text-xs font-semibold text-amber-700"
                            >
                              Suspend
                            </button>
                          ) : null}
                          {user.accountStatus === "suspended" ? (
                            <button
                              type="button"
                              onClick={() => openAction(user, "reactivate")}
                              className="rounded border border-emerald-300 px-2 py-1 font-inter text-xs font-semibold text-emerald-700"
                            >
                              Reactivate
                            </button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            disabled={page <= 1 || loading}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            className="rounded-lg border border-[#e5e5e2] px-3 py-2 font-inter text-sm disabled:opacity-40"
          >
            Previous
          </button>
          <p className="font-inter text-sm text-brand-dark/60">
            Page {page} of {totalPages}
          </p>
          <button
            type="button"
            disabled={page >= totalPages || loading}
            onClick={() => setPage((current) => current + 1)}
            className="rounded-lg border border-[#e5e5e2] px-3 py-2 font-inter text-sm disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>

      {showReview ? (
        <UserReviewPanel
          details={details}
          loading={detailsLoading}
          pendingAction={reviewPendingAction}
          reason={reason}
          busy={busy}
          onReasonChange={setReason}
          onClose={closeAction}
          onApprove={() => setReviewPendingAction("approve")}
          onReject={() => setReviewPendingAction("reject")}
          onCancelPending={() => {
            setReviewPendingAction(null);
            setReason("");
          }}
          onConfirmPending={() => {
            if (!actionUser?.id || !reviewPendingAction) return;
            void runAction(reviewPendingAction, actionUser.id);
          }}
        />
      ) : null}

      {showSimpleAction ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-5 shadow-xl">
            <h2 className="font-inter text-lg font-bold text-brand-dark">
              {`${actionKind.charAt(0).toUpperCase()}${actionKind.slice(1)} user`}
            </h2>
            <p className="mt-1 font-inter text-sm text-brand-dark/60">
              {actionUser.fullName} · {actionUser.email}
            </p>
            <div className="mt-4">
              <label className="font-inter text-sm font-semibold text-brand-dark">
                {actionKind === "reactivate"
                  ? "Optional note"
                  : "Reason (optional)"}
              </label>
              <textarea
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                rows={3}
                className="mt-1 w-full rounded-lg border border-[#e5e5e2] p-3 font-inter text-sm outline-none focus-visible:ring-2 focus-visible:ring-brand-dark/20"
              />
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeAction}
                disabled={busy}
                className="rounded-lg border border-[#e5e5e2] px-3 py-2 font-inter text-sm font-semibold"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!actionUser.id) return;
                  void runAction(actionKind, actionUser.id);
                }}
                disabled={busy}
                className="rounded-lg bg-brand-dark px-3 py-2 font-inter text-sm font-semibold text-white disabled:opacity-60"
              >
                {busy ? "Working…" : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
