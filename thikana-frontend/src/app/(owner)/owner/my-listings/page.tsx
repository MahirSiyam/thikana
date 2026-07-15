import type { Metadata } from "next";
import { OwnerMyListingsPage } from "@/features/owner-my-listings/components/OwnerMyListingsPage";

export const metadata: Metadata = {
  title: "My Listings | Thikana Owner",
  description:
    "View, filter, and manage your property listings on the Thikana owner dashboard.",
};

export default function OwnerMyListingsRoutePage() {
  return <OwnerMyListingsPage />;
}
