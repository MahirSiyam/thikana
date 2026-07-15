import type {
  ServiceRequest,
  ServiceRequestsTabId,
} from "@/features/tenant-service-requests/types/tenant-service-requests.types";

export const serviceRequestsTabs: {
  id: ServiceRequestsTabId;
  label: string;
}[] = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "confirmed", label: "Confirmed" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
];

export const serviceRequests: ServiceRequest[] = [
  {
    id: "1",
    providerName: "Rahim Mia",
    providerAvatarSrc: "/images/tenant/provider-rahim.jpg",
    tradeLabel: "⚡ Electrician",
    location: "📍 Dhanmondi, Road 5",
    schedule: "📅 Tomorrow, 10:00 AM",
    description: "Wiring inspection and repair in living room.",
    status: "Confirmed",
    verified: true,
    statusHint: "Service in 2 days",
    statusHintTone: "success",
  },
  {
    id: "2",
    providerName: "Abdul Karim",
    providerAvatarSrc: "/images/tenant/provider-abdul.jpg",
    tradeLabel: "🔧 Plumber",
    location: "📍 Mirpur 10",
    schedule: "📅 Sat 05 Jul, 9:00 AM",
    description: "Kitchen sink leak and bathroom pipe issue.",
    status: "Pending",
  },
  {
    id: "3",
    providerName: "Salma Akter",
    providerAvatarSrc: "/images/tenant/provider-salma.jpg",
    tradeLabel: "🏠 Cleaning",
    location: "📍 Uttara, Sector 7",
    schedule: "📅 28 Jun 2026, 11:00 AM (Completed)",
    description: "Full apartment deep clean.",
    status: "Completed",
    canRate: true,
  },
  {
    id: "4",
    providerName: "Nurul Islam",
    providerAvatarSrc: "/images/tenant/provider-nurul.jpg",
    tradeLabel: "🎨 Painting",
    location: "📍 Banani, Road 12",
    schedule: "📅 Sun 06 Jul, 2:00 PM",
    description: "Bedroom walls and ceiling repaint.",
    status: "Pending",
  },
];

export const serviceRequestsPaginationPages = [1, 2, 3, "...", 12] as const;
