import type {
  SupportInboxTabId,
  SupportTicket,
} from "@/features/admin-support/types/admin-support.types";

export const supportInboxTabs: {
  id: SupportInboxTabId;
  label: string;
}[] = [
  { id: "open", label: "Open (24)" },
  { id: "in-progress", label: "In Progress (8)" },
  { id: "resolved", label: "Resolved (142)" },
];

const rakibMessages = [
  {
    id: "m1",
    sender: "user" as const,
    initials: "RI",
    body: "Hello, my booking for the Banani studio was cancelled without any reason. I already paid the deposit. Can you check?",
    time: "10:42 AM",
  },
  {
    id: "m2",
    sender: "admin" as const,
    initials: "MA",
    body: "Hi Rakib, I'm checking the transaction logs now. It seems there was a verification delay from the provider's side.",
    time: "10:45 AM",
  },
  {
    id: "m3",
    sender: "user" as const,
    initials: "RI",
    body: "Will I get my refund or can the booking be reinstated?",
    time: "10:48 AM",
  },
  {
    id: "m4",
    sender: "admin" as const,
    initials: "MA",
    body: "We can reinstate it. I've sent an urgent notification to the provider 'FixIt Home' to confirm. Please wait 15 minutes.",
    time: "10:52 AM",
  },
];

const rakibContext = {
  userPlan: "Free Tier",
  accountStatus: "Active",
  memberSince: "8 months",
  linkedListings: "2 active",
};

const rakibActivity = [
  { id: "a1", label: "Booking Made", date: "2 days ago" },
  { id: "a2", label: "Listing Reviewed", date: "1 week ago" },
  { id: "a3", label: "Profile Updated", date: "Oct 12, 2023" },
];

export const supportTickets: SupportTicket[] = [
  {
    id: "tkt-0091",
    ticketNumber: "#TKT-0091",
    timeAgo: "5 min ago",
    userName: "Rakib Islam",
    userRole: "Tenant",
    preview: "My booking was cancelled...",
    priority: "High",
    subject: "#TKT-0091 – Booking Issue",
    tab: "open",
    messages: rakibMessages,
    context: rakibContext,
    recentActivity: rakibActivity,
  },
  {
    id: "tkt-0088",
    ticketNumber: "#TKT-0088",
    timeAgo: "1h ago",
    userName: "Farhan Ahmed",
    userRole: "Tenant",
    preview: "Verification taking too long",
    priority: "Medium",
    subject: "#TKT-0088 – Verification Delay",
    tab: "open",
    messages: [],
    context: rakibContext,
    recentActivity: rakibActivity,
  },
  {
    id: "tkt-0085",
    ticketNumber: "#TKT-0085",
    timeAgo: "3h ago",
    userName: "Salma Khan",
    userRole: "Tenant",
    preview: "Refund process inquiry",
    priority: "Low",
    subject: "#TKT-0085 – Refund Inquiry",
    tab: "open",
    messages: [],
    context: rakibContext,
    recentActivity: rakibActivity,
  },
  {
    id: "tkt-0082",
    ticketNumber: "#TKT-0082",
    timeAgo: "5h ago",
    userName: "Jasim Uddin",
    userRole: "Tenant",
    preview: "App login issue",
    priority: "High",
    subject: "#TKT-0082 – Login Issue",
    tab: "open",
    messages: [],
    context: rakibContext,
    recentActivity: rakibActivity,
  },
  {
    id: "tkt-0079",
    ticketNumber: "#TKT-0079",
    timeAgo: "Yesterday",
    userName: "Mita Yeasmin",
    userRole: "Tenant",
    preview: "Owner document issue",
    priority: "Medium",
    subject: "#TKT-0079 – Document Issue",
    tab: "open",
    messages: [],
    context: rakibContext,
    recentActivity: rakibActivity,
  },
];
