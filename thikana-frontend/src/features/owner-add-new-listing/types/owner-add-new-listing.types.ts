import type { CloudinaryAsset } from "@/lib/api/auth";

export type PropertyType = "Apartment" | "Room" | "Mess / Hostel" | "Office Space";

export type WhoCanRent = "Family" | "Bachelor" | "Any";

export type ListingStep = {
  id: number;
  label: string;
};

export type LocationOption = {
  id: string;
  label: string;
};

export type ListingMediaItem = CloudinaryAsset & {
  secureUrl?: string;
  previewUrl?: string;
};

export type ListingFormState = {
  propertyTitle: string;
  propertyType: PropertyType;
  division: string;
  district: string;
  area: string;
  floorLevel: string;
  sizeSqft: string;
  monthlyRent: string;
  availableFrom: string;
  whoCanRent: WhoCanRent[];
  images: ListingMediaItem[];
  description: string;
  houseRules: string;
  amenities: string[];
  beds: string;
  baths: string;
  locationMapUrl: string;
};
