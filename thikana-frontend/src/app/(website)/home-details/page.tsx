import type { Metadata } from "next";
import { HomeDetailsPage } from "@/features/home-details/components/HomeDetailsPage";

export const metadata: Metadata = {
  title: "Home Details | Thikana",
  description:
    "View verified rental home details, facilities, location, and guest reviews on Thikana.",
};

export default function HomeDetailsRoutePage() {
  return <HomeDetailsPage />;
}
