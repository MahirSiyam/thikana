import { routes } from "@/config/routes";
import type { AdminNavItem, AdminUser } from "@/features/admin/types/admin.types";

export const adminNavItems: AdminNavItem[] = [
  {
    id: "home",
    label: "Home",
    iconSrc: "/images/admin/icon-home.svg",
    href: routes.home,
  },
  {
    id: "overview",
    label: "Overview",
    iconSrc: "/images/admin/icon-layout-grid.svg",
    href: routes.adminOverview,
  },
  {
    id: "users",
    label: "User Management",
    iconSrc: "/images/admin/icon-users.svg",
    href: routes.adminUserManagement,
  },
  {
    id: "listing-verification",
    label: "Listing Verification",
    iconSrc: "/images/admin/icon-file-check.svg",
    href: routes.adminListingVerification,
  },
  {
    id: "provider-verification",
    label: "Provider Verification",
    iconSrc: "/images/admin/icon-truck.svg",
    href: routes.adminProviderVerification,
  },
  {
    id: "reports",
    label: "Reports & Analytics",
    iconSrc: "/images/admin/icon-bar-chart.svg",
    href: routes.adminReportsAnalytics,
  },
  {
    id: "support",
    label: "Support / Messages",
    iconSrc: "/images/admin/icon-message-circle.svg",
    href: routes.adminSupport,
  },
  {
    id: "settings",
    label: "Site Settings",
    iconSrc: "/images/admin/icon-settings.svg",
    href: routes.adminSiteSettings,
  },
];

export const adminUser: AdminUser = {
  initials: "MA",
  name: "Masum Ahmed",
  role: "Super Admin",
  badge: "Admin",
};
