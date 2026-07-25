import type { Metadata } from "next";
import { Suspense } from "react";
import { HomeDetailsPage } from "@/features/home-details/components/HomeDetailsPage";

export const metadata: Metadata = {
  title: "Home Details | Thikana",
  description:
    "View verified rental home details, facilities, location, and guest reviews on Thikana.",
};

export default function HomeDetailsRoutePage() {
  return (
    <Suspense
      fallback={
        <div className="bg-surface px-4 py-16 font-inter text-sm text-brand-dark/60">
          Loading home details…
        </div>
      }
    >
      <HomeDetailsPage />
    </Suspense>
  );
}
