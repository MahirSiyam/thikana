"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  pendingProviderCount,
  pendingProviders,
  providerVerificationTabs,
  recentlyVerifiedProviders,
} from "@/features/admin-provider-verification/data/admin-provider-verification.mock";
import type {
  PendingProvider,
  ProviderDocument,
  ProviderVerificationTabId,
  RecentlyVerifiedProvider,
} from "@/features/admin-provider-verification/types/admin-provider-verification.types";

function DocumentBadge({ document }: { document: ProviderDocument }) {
  const isReady = document.status === "ready";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded border px-2 py-1 font-inter text-[11px] font-semibold ${
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
        className="size-2.5"
      />
      {document.label}
    </span>
  );
}

function ProviderVerificationCard({ provider }: { provider: PendingProvider }) {
  return (
    <article className="flex flex-col gap-5 rounded-lg bg-white p-5 shadow-[0px_4px_6px_rgba(0,0,0,0.04)] lg:flex-row lg:items-center lg:gap-6">
      <div className="flex min-w-0 items-center gap-4 lg:w-[220px] lg:shrink-0">
        <div className="flex size-[60px] shrink-0 items-center justify-center rounded-full bg-[#e2e8f0]">
          <span className="font-outfit text-xl font-bold text-[#475569]">{provider.initial}</span>
        </div>
        <div className="flex min-w-0 flex-col gap-1">
          <h2 className="font-inter text-[15px] font-bold text-black">{provider.name}</h2>
          <span className="inline-flex w-fit rounded bg-[#0f0f0f] px-2 py-0.5 font-inter text-[10px] font-semibold text-white">
            {provider.category}
          </span>
        </div>
      </div>

      <div className="flex w-full flex-col gap-2 lg:w-[240px] lg:shrink-0">
        <p className="font-inter text-[11px] font-semibold uppercase text-[#94a3b8]">Documents</p>
        <div className="flex flex-wrap gap-1">
          {provider.documents.map((document) => (
            <DocumentBadge key={document.id} document={document} />
          ))}
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1 font-inter text-[13px]">
        <p className="text-[#475569]">{provider.joined}</p>
        <p className="text-[#94a3b8]">{provider.location}</p>
        {provider.rating && provider.reviews ? (
          <div className="flex items-center gap-1">
            <span className="font-semibold text-[#f59e0b]">{provider.rating}</span>
            <span className="text-[#94a3b8]">{provider.reviews}</span>
          </div>
        ) : null}
      </div>

      <div className="flex w-full flex-col gap-2 sm:w-[160px] sm:shrink-0">
        <button
          type="button"
          className="inline-flex w-full items-center justify-center rounded-md border border-[#e2e8f0] p-2 font-inter text-[13px] font-semibold text-black transition-colors hover:bg-[#f8fafc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
        >
          View Profile
        </button>
        <button
          type="button"
          className="inline-flex w-full items-center justify-center rounded-md bg-[#0f0f0f] p-2 font-inter text-[13px] font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
        >
          Approve ✓
        </button>
        <button
          type="button"
          className="inline-flex w-full items-center justify-center rounded-md border border-[#ef4444] p-2 font-inter text-[13px] font-semibold text-[#ef4444] transition-colors hover:bg-[#ef4444]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ef4444] focus-visible:ring-offset-2"
        >
          Reject ✗
        </button>
      </div>
    </article>
  );
}

function RecentlyVerifiedTable({
  providers,
}: {
  providers: RecentlyVerifiedProvider[];
}) {
  return (
    <section className="flex w-full flex-col gap-4">
      <h2 className="font-outfit text-lg font-semibold text-black">Recently Verified Providers</h2>
      <div className="overflow-hidden rounded-[20px] bg-white shadow-[0px_4px_12px_rgba(0,0,0,0.04)]">
        <div className="overflow-x-auto">
          <table className="min-w-[720px] w-full border-collapse text-left">
            <thead>
              <tr className="bg-[#fafafa]">
                <th className="px-5 py-3 font-inter text-[11px] font-bold text-[#94a3b8]">NAME</th>
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
              {providers.map((provider) => (
                <tr key={provider.id} className="border-b border-[#f1f5f9]">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-2xl bg-[#0f0f0f]">
                        <span className="font-inter text-xs font-bold text-white">
                          {provider.initial}
                        </span>
                      </div>
                      <p className="font-inter text-sm font-semibold text-black">{provider.name}</p>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className="inline-flex rounded bg-[#0f0f0f] px-2 py-1 font-inter text-[11px] font-semibold text-white">
                      {provider.category}
                    </span>
                  </td>
                  <td className="py-4 font-inter text-[13px] text-[#475569]">
                    {provider.approvalDate}
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
                      className="font-inter text-[13px] font-semibold text-[#ef4444] underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ef4444] focus-visible:ring-offset-2"
                    >
                      Revoke
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export function AdminProviderVerificationPage() {
  const [activeTab, setActiveTab] = useState<ProviderVerificationTabId>("pending");

  const visibleProviders = useMemo(
    () => pendingProviders.filter((provider) => provider.tab === activeTab),
    [activeTab],
  );

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-[50px] lg:py-[30px]">
      <div className="flex w-full flex-col gap-10">
        <div className="flex flex-col gap-6">
          <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:pb-6">
            <h1 className="font-outfit text-[clamp(1.5rem,3vw,1.75rem)] font-bold text-black">
              Service Provider Verification
            </h1>
            <span className="inline-flex w-fit items-center rounded bg-[#f59e0b] px-3 py-1.5 font-inter text-[13px] font-bold text-white">
              {pendingProviderCount} Pending
            </span>
          </header>

          <div className="flex flex-col gap-4">
            <div
              role="tablist"
              aria-label="Provider verification filters"
              className="flex gap-2 overflow-x-auto pb-1"
            >
              {providerVerificationTabs.map((tab) => {
                const isActive = tab.id === activeTab;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveTab(tab.id)}
                    className={`shrink-0 rounded-full border border-[#e2e8f0] px-4 py-2.5 font-inter text-[13px] whitespace-nowrap transition-colors ${
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
              {visibleProviders.map((provider) => (
                <ProviderVerificationCard key={provider.id} provider={provider} />
              ))}
            </div>
          </div>
        </div>

        <RecentlyVerifiedTable providers={recentlyVerifiedProviders} />
      </div>
    </div>
  );
}
