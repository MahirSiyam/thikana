import type {
  ListingFormState,
  ListingStep,
  LocationOption,
  PropertyType,
  WhoCanRent,
} from "@/features/owner-add-new-listing/types/owner-add-new-listing.types";

export const listingSteps: ListingStep[] = [
  { id: 1, label: "Property Info" },
  { id: 2, label: "Media" },
  { id: 3, label: "Details" },
  { id: 4, label: "Review & Submit" },
];

export const propertyTypes: PropertyType[] = [
  "Apartment",
  "Room",
  "Mess / Hostel",
  "Office Space",
];

export const whoCanRentOptions: WhoCanRent[] = ["Family", "Bachelor", "Any"];

export const divisions: LocationOption[] = [{ id: "dhaka", label: "Dhaka" }];

export const districts: LocationOption[] = [{ id: "dhaka", label: "Dhaka" }];

export const areas: LocationOption[] = [
  { id: "dhanmondi", label: "Dhanmondi" },
  { id: "gulshan", label: "Gulshan" },
  { id: "banani", label: "Banani" },
  { id: "uttara", label: "Uttara" },
];

export const defaultListingForm: ListingFormState = {
  propertyTitle: "",
  propertyType: "Apartment",
  division: "Dhaka",
  district: "Dhaka",
  area: "Dhanmondi",
  floorLevel: "3",
  sizeSqft: "750",
  monthlyRent: "18,000",
  availableFrom: "2025-07-15",
  whoCanRent: ["Family", "Any"],
};

export const stepContinueLabels: Record<number, string> = {
  1: "Continue to Media →",
  2: "Continue to Details →",
  3: "Continue to Review →",
  4: "Submit Listing",
};

export const stepPlaceholderCopy: Record<number, { title: string; description: string }> = {
  2: {
    title: "Media upload coming soon",
    description: "Photo and video uploads for your listing will be available in this step.",
  },
  3: {
    title: "Property details coming soon",
    description: "Amenities, house rules, and additional details will be added here.",
  },
  4: {
    title: "Review & submit coming soon",
    description: "Preview your listing and submit for verification in this final step.",
  },
};
