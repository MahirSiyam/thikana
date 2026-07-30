import { routes } from "@/config/routes";
import type { TenantNavItem } from "@/features/tenant/types/tenant.types";

export const tenantNavItems: TenantNavItem[] = [
  {
    id: "home",
    label: "Home",
    iconSrc: "/images/tenant/icon-home.svg",
    href: routes.home,
  },
  {
    id: "overview",
    label: "Overview",
    iconSrc: "/images/tenant/icon-settings.svg",
    href: routes.tenantOverview,
  },
  {
    id: "bookings",
    label: "My Bookings",
    iconSrc: "/images/tenant/icon-calendar.svg",
    href: routes.tenantMyBookings,
  },
  {
    id: "saved",
    label: "Saved Homes",
    iconSrc: "/images/tenant/icon-bookmark.svg",
    href: routes.tenantSavedHomes,
  },
  {
    id: "services",
    label: "Service Requests",
    iconSrc: "/images/tenant/icon-toolbox.svg",
    href: routes.tenantServiceRequests,
  },
  {
    id: "messages",
    label: "Messages",
    iconSrc: "/images/tenant/icon-message.svg",
    href: routes.tenantMessages,
  },
  {
    id: "profile",
    label: "Profile",
    iconSrc: "/images/tenant/icon-user.svg",
    href: routes.tenantProfile,
  },
];
