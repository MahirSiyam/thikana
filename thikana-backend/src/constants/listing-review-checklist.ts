export const LISTING_REVIEW_CHECKLIST_ITEMS = [
  {
    id: "title_description",
    label: "Title & description",
  },
  {
    id: "location",
    label: "Location & address",
  },
  {
    id: "photos",
    label: "Photos",
  },
  {
    id: "rent_details",
    label: "Rent & property details",
  },
  {
    id: "amenities_rules",
    label: "Amenities & house rules",
  },
  {
    id: "listing_authenticity",
    label: "Listing authenticity",
  },
] as const;

export type ListingReviewChecklistItemId =
  (typeof LISTING_REVIEW_CHECKLIST_ITEMS)[number]["id"];

export const LISTING_REVIEW_CHECKLIST_IDS = LISTING_REVIEW_CHECKLIST_ITEMS.map(
  (item) => item.id
) as [ListingReviewChecklistItemId, ...ListingReviewChecklistItemId[]];
