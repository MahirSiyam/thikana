import type { Metadata } from "next";
import { OwnerAddNewListingPage } from "@/features/owner-add-new-listing/components/OwnerAddNewListingPage";

export const metadata: Metadata = {
  title: "Add New Listing | Thikana Owner",
  description:
    "Create a new property listing with details, media, and rental information on Thikana.",
};

export default function OwnerAddNewListingRoutePage() {
  return <OwnerAddNewListingPage />;
}
