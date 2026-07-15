import type {
  OwnerBookingRequest,
  OwnerBookingRequestTab,
} from "@/features/owner-booking-requests/types/owner-booking-requests.types";

export const ownerBookingRequestTabs: OwnerBookingRequestTab[] = [
  { id: "new", label: "New" },
  { id: "accepted", label: "Accepted" },
  { id: "declined", label: "Declined" },
  { id: "expired", label: "Expired" },
];

export const ownerBookingRequests: OwnerBookingRequest[] = [
  {
    id: "1",
    tenantName: "Fatema Khatun",
    tenantAvatarSrc: "/images/tenant/avatar-topbar.png",
    propertyName: "2 Bed Apt, Dhanmondi Road 8",
    moveInDate: "1 Aug 2025",
    note: "I'm a working professional looking for a quiet place. This apartment looks perfect for my needs.",
    propertyImageSrc: "/images/tenant/property-dhanmondi.png",
    timeAgo: "2 hours ago",
    status: "New",
  },
  {
    id: "2",
    tenantName: "Md. Karim Hassan",
    tenantAvatarSrc: "/images/tenant/provider-abdul.jpg",
    propertyName: "Studio Flat, Mohammadpur",
    moveInDate: "15 Aug 2025",
    note: "Looking for a studio near my workplace. Flexible on move-in date if needed.",
    propertyImageSrc: "/images/tenant/property-banani.png",
    timeAgo: "5 hours ago",
    status: "New",
  },
  {
    id: "3",
    tenantName: "Riya Das",
    tenantAvatarSrc: "/images/tenant/provider-salma.jpg",
    propertyName: "3 Bed Family Home, Mirpur",
    moveInDate: "1 Sep 2025",
    note: "Family of 3 relocating to Dhaka. Need a spacious home in a safe neighbourhood.",
    propertyImageSrc: "/images/tenant/property-mirpur.png",
    timeAgo: "1 day ago",
    status: "New",
  },
];
