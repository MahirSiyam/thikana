"use client";

import { useState } from "react";
import { AdminSidebar } from "@/features/admin/components/AdminSidebar";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-dvh bg-surface">
      <AdminSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      {/* Width spacer so fixed sidebar does not cover content on desktop */}
      <div className="hidden w-[300px] shrink-0 lg:block" aria-hidden="true" />

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-brand-dark/10 bg-surface/90 px-4 py-3 backdrop-blur-md lg:hidden">
          <button
            type="button"
            aria-label="Open admin menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
            className="inline-flex size-10 items-center justify-center rounded-lg border border-brand-dark text-brand-dark"
          >
            <span className="sr-only">Menu</span>
            <span aria-hidden="true" className="flex flex-col gap-1.5">
              <span className="block h-0.5 w-5 bg-brand-dark" />
              <span className="block h-0.5 w-5 bg-brand-dark" />
              <span className="block h-0.5 w-5 bg-brand-dark" />
            </span>
          </button>
          <p className="font-inter text-sm font-semibold text-brand-dark">Admin</p>
        </div>

        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
