export type SupportInboxTabId = "open" | "in-progress" | "resolved";

export type SupportTicketPriority = "High" | "Medium" | "Low";

export type SupportMessageSender = "user" | "admin";

export type SupportMessage = {
  id: string;
  sender: SupportMessageSender;
  initials: string;
  body: string;
  time: string;
};

export type SupportActivity = {
  id: string;
  label: string;
  date: string;
};

export type SupportTicket = {
  id: string;
  ticketNumber: string;
  timeAgo: string;
  userName: string;
  userRole: string;
  preview: string;
  priority: SupportTicketPriority;
  subject: string;
  tab: SupportInboxTabId;
  messages: SupportMessage[];
  context: {
    userPlan: string;
    accountStatus: string;
    memberSince: string;
    linkedListings: string;
  };
  recentActivity: SupportActivity[];
};
