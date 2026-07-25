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

export const amenityOptions = [
  "Wi-Fi",
  "Attached Bathroom",
  "Kitchen",
  "Balcony",
  "Parking",
  "Lift",
  "Generator",
  "Gas Connection",
  "Air Conditioning",
  "Furnished",
  "CCTV",
  "Security Guard",
] as const;

export const divisions: LocationOption[] = [
  { id: "dhaka", label: "Dhaka" },
  { id: "chattogram", label: "Chattogram" },
  { id: "rajshahi", label: "Rajshahi" },
  { id: "khulna", label: "Khulna" },
  { id: "barishal", label: "Barishal" },
  { id: "sylhet", label: "Sylhet" },
  { id: "rangpur", label: "Rangpur" },
  { id: "mymensingh", label: "Mymensingh" },
];

export const defaultListingForm: ListingFormState = {
  propertyTitle: "",
  propertyType: "Apartment",
  division: "Dhaka",
  district: "",
  area: "",
  floorLevel: "",
  sizeSqft: "",
  monthlyRent: "",
  availableFrom: "",
  whoCanRent: ["Any"],
  images: [],
  description: "",
  houseRules: "",
  amenities: [],
  beds: "1",
  baths: "1",
  locationMapUrl: "",
};

export const stepContinueLabels: Record<number, string> = {
  1: "Continue to Media →",
  2: "Continue to Details →",
  3: "Continue to Review →",
  4: "Submit Listing",
};
