import type { MessageConversation } from "@/features/service-provider-messages/types/service-provider-messages.types";

export const messagesDateRangeLabel = "01 July 2026 → 30 July 2026";

export const messageConversations: MessageConversation[] = [
  {
    id: "1",
    name: "Karim Ahmed",
    role: "Customer",
    avatarSrc: "/images/tenant/avatar-topbar.png",
    timeLabel: "12 min",
    preview: "Can you also check the circuit breaker?",
    online: true,
    subject: "Re: Wiring Repair — Tomorrow 10 AM",
    dateLabel: "Today, 15 July 2026",
    messages: [
      {
        id: "1-1",
        sender: "them",
        body: "Assalamu Alaikum Rahim bhai. I have multiple sockets in the bedroom that are sparking. Can you come take a look tomorrow?",
        time: "9:12 AM",
      },
      {
        id: "1-2",
        sender: "me",
        body: "Walaikum Assalam Karim bhai. Yes, I can visit around 10:00 AM tomorrow. Please keep the main switch off until then.",
        time: "9:18 AM",
      },
      {
        id: "1-3",
        sender: "them",
        body: "10 AM is perfect. Can you also check the circuit breaker? It tripped twice last night.",
        time: "9:24 AM",
      },
      {
        id: "1-4",
        sender: "me",
        body: "Certainly. I will perform a full diagnostic on the breaker panel and all affected sockets during the visit.",
        time: "9:30 AM",
      },
      {
        id: "1-5",
        sender: "them",
        body: "Thank you. See you then!",
        time: "9:32 AM",
      },
    ],
  },
  {
    id: "2",
    name: "Salma Begum",
    role: "Customer",
    avatarSrc: "/images/tenant/provider-salma.jpg",
    timeLabel: "2 hrs",
    preview: "The installation was perfect, thank you!",
    unread: true,
    subject: "Re: Ceiling Fan Installation",
    dateLabel: "Today, 15 July 2026",
    messages: [
      {
        id: "2-1",
        sender: "them",
        body: "The installation was perfect, thank you!",
        time: "11:45 AM",
      },
    ],
  },
  {
    id: "3",
    name: "Zubair Khan",
    role: "Customer",
    avatarSrc: "/images/tenant/provider-nurul.jpg",
    timeLabel: "1 day",
    preview: "Let me know when you're nearby.",
    subject: "Re: Switch Board Replacement",
    dateLabel: "Yesterday, 14 July 2026",
    messages: [
      {
        id: "3-1",
        sender: "them",
        body: "Let me know when you're nearby.",
        time: "3:20 PM",
      },
    ],
  },
  {
    id: "4",
    name: "Fatema Akter",
    role: "Customer",
    avatarSrc: "/images/tenant/provider-rafiq.jpg",
    timeLabel: "2 days",
    preview: "Okay, see you tomorrow.",
    subject: "Re: Fan Installation",
    dateLabel: "13 July 2026",
    messages: [
      {
        id: "4-1",
        sender: "them",
        body: "Okay, see you tomorrow.",
        time: "5:10 PM",
      },
    ],
  },
  {
    id: "5",
    name: "Nur Islam",
    role: "Customer",
    avatarSrc: "/images/tenant/provider-abdul.jpg",
    timeLabel: "3 days",
    preview: "The socket fix is holding up well.",
    subject: "Re: Socket Fix",
    dateLabel: "12 July 2026",
    messages: [
      {
        id: "5-1",
        sender: "them",
        body: "The socket fix is holding up well.",
        time: "10:30 AM",
      },
    ],
  },
  {
    id: "6",
    name: "Ayesha Siddika",
    role: "Customer",
    avatarSrc: "/images/tenant/provider-rahim.jpg",
    timeLabel: "1 week",
    preview: "Sending the location pin now.",
    subject: "Re: House Wiring Inspection",
    dateLabel: "8 July 2026",
    messages: [
      {
        id: "6-1",
        sender: "them",
        body: "Sending the location pin now.",
        time: "2:05 PM",
      },
    ],
  },
];
