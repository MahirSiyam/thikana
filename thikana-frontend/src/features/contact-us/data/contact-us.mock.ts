import type {
  ContactBadge,
  ContactFaqItem,
  ContactInfoCard,
  ContactRoleOption,
  ContactSocialLink,
  ContactSupportHour,
} from "@/features/contact-us/types/contact-us.types";

export const contactHero = {
  title: "We'd Love to Hear From You",
  subtitle:
    "Whether it's a question about a listing, a service, or your account our team is here.",
} as const;

export const contactBadges: ContactBadge[] = [
  { id: "reply", label: "Avg. Reply: 2 Hours" },
  { id: "hours", label: "Mon–Sat, 9AM–7PM" },
  { id: "languages", label: "Support in Bangla & English" },
];

export const contactInfoCards: ContactInfoCard[] = [
  {
    id: "visit",
    title: "Visit Us",
    primary: "16/A Road 7, Dhanmondi, Dhaka 1209",
    secondary: "Dhaka, Bangladesh",
    iconSrc: "/images/contact-us/icon-map-pin.svg",
  },
  {
    id: "call",
    title: "Call Us",
    primary: "+880 1XXX-XXXXXX",
    secondary: "Sat–Thu, 9 AM – 7 PM",
    iconSrc: "/images/contact-us/icon-phone.svg",
    href: "tel:+8801000000000",
  },
  {
    id: "email",
    title: "Email Us",
    primary: "hello@thikana.com",
    secondary: "Reply within 24 hours",
    iconSrc: "/images/contact-us/icon-mail.svg",
    href: "mailto:hello@thikana.com",
  },
];

export const contactRoleOptions: ContactRoleOption[] = [
  { value: "tenant", label: "Tenant" },
  { value: "owner", label: "Owner" },
  { value: "provider", label: "Provider" },
  { value: "browsing", label: "Just browsing" },
];

export const contactFaqs: ContactFaqItem[] = [
  { id: "pending", question: "Why is my listing still pending review?" },
  { id: "password", question: "How do I reset my password?" },
  { id: "free-list", question: "Can I list a property for free?" },
  { id: "verification", question: "How long does verification take?" },
];

export const contactSocialLinks: ContactSocialLink[] = [
  {
    id: "facebook",
    label: "Facebook",
    handle: "@thikanabd",
    iconSrc: "/images/contact-us/icon-facebook.svg",
    href: "#",
  },
  {
    id: "instagram",
    label: "Instagram",
    handle: "@thikanabd",
    iconSrc: "/images/contact-us/icon-instagram.svg",
    href: "#",
  },
  {
    id: "twitter",
    label: "X (Twitter)",
    handle: "@thikanabd",
    iconSrc: "/images/contact-us/icon-twitter.svg",
    href: "#",
  },
];

export const contactSupportHours: ContactSupportHour[] = [
  { id: "saturday", day: "Saturday", hours: "10:00 AM – 5:00 PM" },
  { id: "sun-thu", day: "Sun – Thu", hours: "9:00 AM – 7:00 PM" },
  { id: "friday", day: "Friday", hours: "Closed", closed: true },
];

export const contactMap = {
  imageSrc: "/images/contact-us/office-map.jpg",
  imageAlt: "Map showing Thikana office location in Dhanmondi, Dhaka",
} as const;

export const MESSAGE_MAX_LENGTH = 500;
