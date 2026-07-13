"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  managedUsers,
  userManagementPagination,
  userManagementTabs,
} from "@/features/admin-user-management/data/admin-user-management.mock";
import type {
  ManagedUser,
  UserRole,
  UserTabId,
  UserVerification,
} from "@/features/admin-user-management/types/admin-user-management.types";

const roleStyles: Record<UserRole, string> = {
  Tenant: "bg-[#f1f5f9] text-[#0a0a0a]",
  Owner: "bg-[#e2e8f0] text-[#0a0a0a]",
  Provider: "bg-[#0a0a0a] text-white",
  Admin: "bg-[#0a0a0a] text-white",
};

const verificationStyles: Record<UserVerification, string> = {
  Verified: "bg-[#e8f5e9] text-[#10b981]",
  Pending: "bg-[#fff3e0] text-[#f59e0b]",
  Failed: "bg-[#ffebee] text-[#ef4444]",
};

const verificationIcons: Record<UserVerification, string> = {
  Verified: "✓",
  Pending: "⏳",
  Failed: "✗",
};

function matchesTab(user: ManagedUser, tab: UserTabId): boolean {
  switch (tab) {
    case "tenants":
      return user.role === "Tenant";
    case "owners":
      return user.role === "Owner";
    case "providers":
      return user.role === "Provider";
    case "admins":
      return user.role === "Admin";
    case "suspended":
      return user.status === "Suspended";
    default:
      return true;
  }
}

export function AdminUserManagementPage() {
  const [activeTab, setActiveTab] = useState<UserTabId>("all");
  const [query, setQuery] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>(() =>
    managedUsers.filter((user) => user.selectedByDefault).map((user) => user.id),
  );
  const [currentPage, setCurrentPage] = useState(userManagementPagination.currentPage);

  const visibleUsers = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return managedUsers.filter((user) => {
      if (!matchesTab(user, activeTab)) return false;
      if (!normalized) return true;
      return (
        user.name.toLowerCase().includes(normalized) ||
        user.email.toLowerCase().includes(normalized)
      );
    });
  }, [activeTab, query]);

  const allVisibleSelected =
    visibleUsers.length > 0 && visibleUsers.every((user) => selectedIds.includes(user.id));

  const toggleUser = (id: string) => {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  const toggleAllVisible = () => {
    if (allVisibleSelected) {
      setSelectedIds((current) =>
        current.filter((id) => !visibleUsers.some((user) => user.id === id)),
      );
      return;
    }
    setSelectedIds((current) => [
      ...new Set([...current, ...visibleUsers.map((user) => user.id)]),
    ]);
  };

  const selectedVisibleCount = visibleUsers.filter((user) =>
    selectedIds.includes(user.id),
  ).length;

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-[50px] lg:py-[30px]">
      <div className="flex w-full flex-col gap-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:pb-6">
          <h1 className="font-inter text-[clamp(1.5rem,3vw,1.75rem)] font-bold text-black">
            User Management
          </h1>
          <button
            type="button"
            className="inline-flex w-fit items-center gap-2 rounded-md border border-black bg-white px-4 py-2.5 font-inter text-sm font-semibold text-black transition-colors hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
          >
            <Image
              src="/images/admin/icon-plus.svg"
              alt=""
              width={14}
              height={14}
              aria-hidden="true"
              className="size-3.5"
            />
            Invite Admin
          </button>
        </header>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-0">
            <div
              role="tablist"
              aria-label="User filters"
              className="flex gap-4 overflow-x-auto border-b border-dashed border-brand-dark/50 sm:gap-8"
            >
              {userManagementTabs.map((tab) => {
                const isActive = tab.id === activeTab;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveTab(tab.id)}
                    className={`shrink-0 border-b-2 pb-3 font-inter text-sm whitespace-nowrap transition-colors ${
                      isActive
                        ? "border-brand-dark font-bold text-brand-dark"
                        : "border-transparent font-normal text-brand-dark"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-col gap-3 pt-4 lg:flex-row lg:flex-wrap lg:items-center lg:gap-3">
              <label className="flex w-full items-center gap-2.5 rounded-md border border-brand-dark bg-white px-3 py-2.5 lg:w-[320px]">
                <Image
                  src="/images/admin/icon-search.svg"
                  alt=""
                  width={16}
                  height={16}
                  aria-hidden="true"
                  className="size-4 shrink-0"
                />
                <span className="sr-only">Search users</span>
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search by name, email..."
                  className="min-w-0 flex-1 bg-transparent font-inter text-sm text-brand-dark outline-none placeholder:text-brand-dark"
                />
              </label>

              <button
                type="button"
                className="inline-flex w-fit items-center rounded-md border border-brand-dark bg-white px-3 py-2.5 font-inter text-sm text-black"
              >
                Role ▼
              </button>
              <button
                type="button"
                className="inline-flex w-fit items-center rounded-md border border-brand-dark bg-white px-3 py-2.5 font-inter text-sm text-black"
              >
                Status ▼
              </button>

              <div className="flex items-center gap-2">
                <span className="font-inter text-sm text-black">Verified</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={verifiedOnly}
                  aria-label="Verified only"
                  onClick={() => setVerifiedOnly((value) => !value)}
                  className={`relative h-[18px] w-8 rounded-full transition-colors ${
                    verifiedOnly ? "bg-brand-dark" : "bg-[#e2e8f0]"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 size-3.5 rounded-full bg-white transition-transform ${
                      verifiedOnly ? "left-[15px]" : "left-0.5"
                    }`}
                  />
                </button>
              </div>

              <div className="hidden flex-1 lg:block" aria-hidden="true" />

              <button
                type="button"
                className="inline-flex w-fit items-center justify-center rounded-full bg-brand-dark px-4 py-2.5 font-inter text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
              >
                Export CSV
              </button>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl bg-white shadow-[0px_4px_12px_rgba(10,10,10,0.1)]">
            {selectedVisibleCount > 0 ? (
              <div className="flex flex-wrap items-center gap-3 bg-[#fff8e1] p-3">
                <span
                  className="size-[18px] shrink-0 rounded bg-brand-dark"
                  aria-hidden="true"
                />
                <p className="font-inter text-[13px] font-semibold text-brand-dark">
                  {selectedVisibleCount} users selected
                </p>
                <button
                  type="button"
                  className="rounded bg-[#f59e0b] px-3 py-1.5 font-inter text-xs font-bold text-white"
                >
                  Suspend
                </button>
                <button
                  type="button"
                  className="rounded bg-[#ef4444] px-3 py-1.5 font-inter text-xs font-bold text-white"
                >
                  Delete
                </button>
              </div>
            ) : null}

            <div className="overflow-x-auto">
              <table className="min-w-[980px] w-full border-collapse text-left">
                <thead>
                  <tr className="bg-[#fafafa]">
                    <th className="px-5 py-4">
                      <input
                        type="checkbox"
                        checked={allVisibleSelected}
                        onChange={toggleAllVisible}
                        aria-label="Select all users"
                        className="size-[18px] rounded border border-[#e2e8f0] accent-brand-dark"
                      />
                    </th>
                    <th className="px-0 py-4 font-inter text-xs font-semibold text-brand-dark">
                      USER
                    </th>
                    <th className="w-[100px] py-4 font-inter text-xs font-semibold text-brand-dark">
                      ROLE
                    </th>
                    <th className="w-[120px] py-4 font-inter text-xs font-semibold text-brand-dark">
                      JOINED
                    </th>
                    <th className="w-[120px] py-4 font-inter text-xs font-semibold text-brand-dark">
                      VERIFICATION
                    </th>
                    <th className="w-[100px] py-4 font-inter text-xs font-semibold text-brand-dark">
                      STATUS
                    </th>
                    <th className="w-[100px] py-4 font-inter text-xs font-semibold text-brand-dark">
                      LAST ACTIVE
                    </th>
                    <th className="w-10 py-4" />
                  </tr>
                </thead>
                <tbody>
                  {visibleUsers.map((user, index) => {
                    const selected = selectedIds.includes(user.id);
                    const rowBg = index % 2 === 1 ? "bg-[#fafafa]" : "bg-white";
                    return (
                      <tr
                        key={user.id}
                        className={`${rowBg} border-b border-[#f1f5f9]`}
                      >
                        <td className="px-5 py-4">
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() => toggleUser(user.id)}
                            aria-label={`Select ${user.name}`}
                            className="size-[18px] rounded border border-[#e2e8f0] accent-brand-dark"
                          />
                        </td>
                        <td className="py-4 pr-6">
                          <div className="flex items-center gap-3">
                            <div className="flex size-8 shrink-0 items-center justify-center rounded-2xl bg-brand-dark">
                              <span className="font-inter text-xs font-bold text-white">
                                {user.initial}
                              </span>
                            </div>
                            <div className="min-w-0">
                              <p className="font-inter text-sm font-semibold text-brand-dark">
                                {user.name}
                              </p>
                              <p className="font-inter text-xs text-brand-dark">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <span
                            className={`inline-flex rounded px-2 py-1 font-inter text-[11px] font-semibold ${roleStyles[user.role]}`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="py-4 font-inter text-[13px] text-brand-dark">
                          {user.joined}
                        </td>
                        <td className="py-4">
                          <span
                            className={`inline-flex items-center gap-1 rounded px-2 py-1 font-inter text-[11px] ${verificationStyles[user.verification]}`}
                          >
                            <span className="font-bold">
                              {verificationIcons[user.verification]}
                            </span>
                            <span className="font-semibold">{user.verification}</span>
                          </span>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-1.5">
                            <Image
                              src={
                                user.status === "Active"
                                  ? "/images/admin/icon-status-active.svg"
                                  : "/images/admin/icon-status-suspended.svg"
                              }
                              alt=""
                              width={8}
                              height={8}
                              aria-hidden="true"
                              className="size-2"
                            />
                            <span className="font-inter text-[13px] text-brand-dark">
                              {user.status}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 font-inter text-[13px] text-brand-dark">
                          {user.lastActive}
                        </td>
                        <td className="py-4 pr-5">
                          <button
                            type="button"
                            aria-label={`Actions for ${user.name}`}
                            className="inline-flex size-5 items-center justify-center"
                          >
                            <Image
                              src="/images/admin/icon-more-horizontal.svg"
                              alt=""
                              width={20}
                              height={20}
                              aria-hidden="true"
                              className="size-5"
                            />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-inter text-[13px] text-brand-dark">
                {userManagementPagination.summary}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Previous page"
                  className="inline-flex size-8 items-center justify-center rounded border border-[#e2e8f0]"
                >
                  <Image
                    src="/images/admin/icon-chevron-left.svg"
                    alt=""
                    width={14}
                    height={14}
                    aria-hidden="true"
                    className="size-3.5"
                  />
                </button>
                {userManagementPagination.pages.map((page) => {
                  const isActive = page === currentPage;
                  return (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      className={`inline-flex size-8 items-center justify-center rounded font-inter text-[13px] ${
                        isActive
                          ? "bg-brand-dark font-bold text-white"
                          : "border border-[#e2e8f0] font-normal text-brand-dark"
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                <button
                  type="button"
                  aria-label="Next page"
                  className="inline-flex size-8 items-center justify-center rounded border border-[#e2e8f0]"
                >
                  <Image
                    src="/images/admin/icon-chevron-right.svg"
                    alt=""
                    width={14}
                    height={14}
                    aria-hidden="true"
                    className="size-3.5"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
