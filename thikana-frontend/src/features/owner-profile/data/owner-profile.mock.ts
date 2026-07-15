import { ownerUser } from "@/features/owner/data/owner.mock";
import type { OwnerProfile } from "@/features/owner-profile/types/owner-profile.types";

export const ownerProfile: OwnerProfile = {
  fullName: ownerUser.name,
  roleBadge: ownerUser.roleBadge,
  location: "Dhaka, Bangladesh",
  memberSince: "March 2024",
  avatarSrc: ownerUser.avatarSrc,
  email: "masum@thikana.com",
  phone: "+880 1712 345 678",
  passwordMasked: "••••••••••••",
  twoFactorEnabled: true,
  notificationChannels: "Push, Email",
  verificationItems: [
    { id: "nid", label: "NID Verified", verified: true },
    { id: "ownership", label: "Ownership Proof", verified: true },
    { id: "face", label: "Face Verified", verified: true },
  ],
  allVerified: true,
  securityRows: [
    { id: "email", label: "Email Address", value: "masum@thikana.com" },
    { id: "phone", label: "Phone Number", value: "+880 1712 345 678" },
    { id: "password", label: "Account Password", value: "••••••••••••" },
    {
      id: "2fa",
      label: "Two-Factor Auth",
      value: "Enabled",
      badge: "enabled",
    },
    {
      id: "notifications",
      label: "Notifications",
      value: "Push, Email",
    },
  ],
  listedProperties: [
    {
      id: "dhanmondi",
      label: "2 Bed Apt",
      imageSrc: "/images/tenant/property-dhanmondi.png",
    },
    {
      id: "banani",
      label: "Studio",
      imageSrc: "/images/tenant/property-banani.png",
    },
    {
      id: "mirpur",
      label: "Home",
      imageSrc: "/images/tenant/property-mirpur.png",
    },
  ],
};
