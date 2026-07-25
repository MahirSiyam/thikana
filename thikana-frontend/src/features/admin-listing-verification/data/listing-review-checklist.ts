export const LISTING_REVIEW_CHECKLIST_ITEMS = [
  {
    id: "title_description",
    label: "Title & description",
    hint: "Clear, accurate, and not misleading",
  },
  {
    id: "location",
    label: "Location",
    hint: "Area, district, and map link look correct",
  },
  {
    id: "photos",
    label: "Photos",
    hint: "Clear photos that match the property",
  },
  {
    id: "rent_details",
    label: "Rent & details",
    hint: "Rent, beds, baths, size, and type are consistent",
  },
  {
    id: "amenities_rules",
    label: "Amenities & rules",
    hint: "Listed amenities and rules look complete",
  },
  {
    id: "listing_authenticity",
    label: "Authenticity",
    hint: "Looks like a real listing from a verified owner",
  },
] as const;

export type ListingReviewChecklistItemId =
  (typeof LISTING_REVIEW_CHECKLIST_ITEMS)[number]["id"];

export type ListingReviewCheckStatus = "pending" | "ok" | "issue";

export type ListingReviewChecklistItem = {
  id: ListingReviewChecklistItemId | string;
  label: string;
  status: ListingReviewCheckStatus;
  note?: string;
};
