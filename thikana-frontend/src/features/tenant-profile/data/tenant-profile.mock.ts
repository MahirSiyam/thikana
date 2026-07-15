import type { TenantProfile } from "@/features/tenant-profile/types/tenant-profile.types";

export const tenantProfile: TenantProfile = {
  fullName: "Masum Rahman",
  roleBadge: "Tenant",
  idVerified: true,
  completionPercent: 72,
  email: "masumrahman@example.com",
  phone: "+880 1712 345678",
  avatarSrc: "/images/tenant/avatar-sidebar.png",
  personalFields: [
    { label: "Full Name", value: "Masum Rahman" },
    { label: "Phone", value: "+880 1712 345678" },
    { label: "Email", value: "masumrahman@example.com" },
    { label: "Present Address", value: "House 12, Road 4, Banani" },
    { label: "Looking For", value: "2 Bed Apartments" },
    { label: "Preferred Budget", value: "15k – 25k BDT" },
  ],
  checklist: [
    { id: "basic", label: "Basic Info", done: true },
    { id: "phone", label: "Phone Verified", done: true },
    { id: "nid", label: "NID Uploaded", done: true },
    { id: "photo", label: "Profile Photo", done: false },
    { id: "email", label: "Email Verified", done: false },
  ],
  securityRows: [
    {
      id: "password",
      title: "Password",
      description: "Last changed 2 months ago",
      action: "change",
    },
    {
      id: "2fa",
      title: "Two-Factor Auth",
      description: "Extra layer of security enabled",
      action: "toggle",
    },
    {
      id: "google",
      title: "Google Account",
      description: "karim.a@gmail.com",
      action: "unlink",
    },
    {
      id: "notifications",
      title: "Notification Preferences",
      description: "Email & SMS enabled",
      action: "edit",
    },
  ],
  twoFactorEnabled: true,
};
