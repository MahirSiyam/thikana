import { serviceProviderUser } from "@/features/service-provider/data/service-provider.mock";
import type { ServiceProviderServiceProfile } from "@/features/service-provider-service-profile/types/service-provider-service-profile.types";

export const serviceProfileCategories = [
  { id: "electrician", label: "Electrician" },
  { id: "plumbing", label: "Plumbing" },
  { id: "hvac", label: "HVAC" },
] as const;

export const serviceProviderServiceProfile: ServiceProviderServiceProfile = {
  displayName: serviceProviderUser.name,
  avatarSrc: serviceProviderUser.avatarSrc,
  categories: ["electrician"],
  yearsOfExperience: "7",
  serviceAreas: ["Dhanmondi", "Mohammadpur", "Azimpur"],
  shortBio:
    "Reliable electrician in Dhanmondi. 7 yrs wiring, fans & sockets.",
  bioMaxLength: 200,
  verificationItems: [
    { id: "nid", label: "NID Verified", verified: true },
    { id: "ownership", label: "Ownership Proof", verified: true },
    { id: "face", label: "Face Verified", verified: true },
  ],
  allVerified: true,
  securityRows: [
    { id: "email", label: "Email", value: "masum@thikana.com" },
    { id: "phone", label: "Phone", value: "+880 1712 345 678" },
    { id: "password", label: "Password", value: "••••••••••••" },
    {
      id: "2fa",
      label: "2FA",
      value: "Enabled",
      badge: "enabled",
    },
    {
      id: "notifications",
      label: "Notifications",
      value: "Push, Email",
    },
  ],
  pricingItems: [
    { id: "fan-installation", name: "Fan Installation", price: 300 },
    { id: "wiring-repair", name: "Wiring Repair", price: 600 },
    { id: "socket-replacement", name: "Socket Replacement", price: 400 },
  ],
  availabilityDays: [
    { id: "mon", label: "Mon", active: true },
    { id: "tue", label: "Tue", active: true },
    { id: "wed", label: "Wed", active: true },
    { id: "thu", label: "Thu", active: true },
    { id: "fri", label: "Fri", active: true },
    { id: "sat", label: "Sat", active: true },
    { id: "sun", label: "Sun", active: false },
  ],
  workingHoursStart: "9:00 AM",
  workingHoursEnd: "7:00 PM",
};
