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
};
