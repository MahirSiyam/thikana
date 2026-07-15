import type { Metadata } from "next";
import { OwnerEarningsPage } from "@/features/owner-earnings/components/OwnerEarningsPage";

export const metadata: Metadata = {
  title: "Earnings & Analytics | Thikana Owner",
  description:
    "Track rent collected, listing views, inquiries, and performance from the Thikana owner dashboard.",
};

export default function OwnerEarningsRoutePage() {
  return <OwnerEarningsPage />;
}
