import { routes } from "@/config/routes";
import type { OwnerNavItem, OwnerUser } from "@/features/owner/types/owner.types";

export const ownerNavItems: OwnerNavItem[] = [
  {
    id: "home",
    label: "Home",
    iconSrc: "/images/owner/icon-home.svg",
    href: routes.home,
  },
  {
    id: "overview",
    label: "Overview",
    iconSrc: "/images/owner/icon-building.svg",
    href: routes.ownerOverview,
  },
  {
    id: "listings",
    label: "My Listings",
    iconSrc: "/images/owner/icon-house.svg",
    href: routes.ownerMyListings,
  },
  {
    id: "add-listing",
    label: "Add New Listing",
    iconSrc: "/images/owner/icon-plus-circle.svg",
    href: routes.ownerAddNewListing,
  },
  {
    id: "booking-requests",
    label: "Booking Requests",
    iconSrc: "/images/owner/icon-calendar-check.svg",
    href: routes.ownerBookingRequests,
  },
  {
    id: "earnings",
    label: "Earnings",
    iconSrc: "/images/owner/icon-bar-chart.svg",
    href: routes.ownerEarnings,
  },
  {
    id: "messages",
    label: "Messages",
    iconSrc: "/images/owner/icon-message.svg",
    href: routes.ownerMessages,
  },
  {
    id: "profile",
    label: "Profile",
    iconSrc: "/images/owner/icon-user.svg",
    href: routes.ownerProfile,
  },
];

export const ownerUser: OwnerUser = {
  name: "Masum Rahman",
  firstName: "Masum",
  roleBadge: "Property Owner",
  avatarSrc: "/images/tenant/avatar-sidebar.png",
  topbarAvatarSrc: "/images/tenant/avatar-topbar.png",
};
