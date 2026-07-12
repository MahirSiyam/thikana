import type { FaqCategory, FaqSection } from "@/features/faq/types/faq.types";

export const faqHero = {
  title: "Frequently Asked Questions",
  subtitle: "Find quick answers to the most common questions about Thikana.",
  searchPlaceholder: "Search your question...",
} as const;

export const faqCategories: FaqCategory[] = [
  { id: "all", label: "All", tabLabel: "All Questions", count: 24 },
  { id: "listings", label: "Listings", tabLabel: "Listings", count: 6 },
  { id: "verification", label: "Verification", tabLabel: "Verification", count: 5 },
  { id: "account", label: "Account", tabLabel: "Account", count: 4 },
  { id: "payments", label: "Payments", tabLabel: "Payments", count: 5 },
  {
    id: "service-providers",
    label: "Service Providers",
    tabLabel: "Service Providers",
    count: 4,
  },
];

export const faqSections: FaqSection[] = [
  {
    id: "listings",
    categoryId: "listings",
    eyebrow: "LISTINGS",
    title: "About Listings",
    items: [
      {
        id: "post-listing",
        categoryId: "listings",
        question: "How do I post a listing on Thikana?",
        answer:
          "Click Post Listing in the nav, fill in your property details, upload photos, and submit for review. Our team will verify and publish it within 48 hours.",
        defaultOpen: true,
      },
      {
        id: "listing-free",
        categoryId: "listings",
        question: "Is posting a listing free?",
        answer:
          "Yes. Basic listings are free on Thikana. Optional promotion tools may be available later to help your property reach more renters.",
      },
      {
        id: "edit-listing",
        categoryId: "listings",
        question: "Can I edit my listing after publishing?",
        answer:
          "Yes. Open your dashboard, select the listing, and update details or photos. Significant changes may go through a quick re-review.",
      },
      {
        id: "photo-limit",
        categoryId: "listings",
        question: "How many photos can I add?",
        answer:
          "You can upload up to 20 photos per listing. Clear, well-lit images of every room help listings get approved faster.",
      },
      {
        id: "listing-rejected",
        categoryId: "listings",
        question: "Why was my listing rejected?",
        answer:
          "Listings are usually rejected for incomplete details, unclear photos, or missing ownership documents. Fix the issues noted in your email and resubmit.",
      },
      {
        id: "listing-active",
        categoryId: "listings",
        question: "How long does a listing stay active?",
        answer:
          "Verified listings stay active until you mark them as rented or remove them. Inactive listings may be archived after a period of no updates.",
      },
    ],
  },
  {
    id: "verification",
    categoryId: "verification",
    eyebrow: "VERIFICATION",
    title: "Identity & Trust",
    items: [
      {
        id: "verification-docs",
        categoryId: "verification",
        question: "What documents are needed for verification?",
        answer:
          "For landlords: National ID, utility bill, and property deed or rent agreement. For service providers: NID and trade license or proof of service.",
        defaultOpen: true,
      },
      {
        id: "verification-time",
        categoryId: "verification",
        question: "How long does verification take?",
        answer:
          "Most verifications are completed within 24–48 hours on business days. Complex cases may take a little longer if documents need clarification.",
      },
      {
        id: "verified-badge",
        categoryId: "verification",
        question: "What does the Thikana Verified badge mean?",
        answer:
          "The badge means our team reviewed identity and supporting documents for that landlord or provider before the listing or profile went live.",
      },
      {
        id: "reapply-verification",
        categoryId: "verification",
        question: "Can I re-apply after a failed verification?",
        answer:
          "Yes. Update the missing or incorrect documents and resubmit from your dashboard. Our team will review the new submission.",
      },
      {
        id: "document-security",
        categoryId: "verification",
        question: "Is my personal document data secure?",
        answer:
          "Yes. Documents are used only for verification, stored securely, and never shared publicly on listings or profiles.",
      },
    ],
  },
  {
    id: "account",
    categoryId: "account",
    eyebrow: "ACCOUNT",
    title: "Managing Your Account",
    items: [
      {
        id: "reset-password",
        categoryId: "account",
        question: "How do I reset my password?",
        answer:
          "Click Forgot Password on the login page, enter your email, and follow the reset link we send. The link expires in 30 minutes.",
        defaultOpen: true,
      },
      {
        id: "multiple-accounts",
        categoryId: "account",
        question: "Can I have multiple accounts?",
        answer:
          "One person should use one account. If you need both renter and landlord tools, you can switch roles from the same verified profile.",
      },
      {
        id: "delete-account",
        categoryId: "account",
        question: "How do I delete my account?",
        answer:
          "Go to Account Settings and choose Delete Account. Active listings must be removed first, and the action cannot be undone.",
      },
      {
        id: "change-phone",
        categoryId: "account",
        question: "Can I change my phone number?",
        answer:
          "Yes. Update your phone number in Account Settings and confirm it with the OTP we send to the new number.",
      },
    ],
  },
  {
    id: "payments",
    categoryId: "payments",
    eyebrow: "PAYMENTS",
    title: "Billing & Payments",
    items: [
      {
        id: "payment-methods",
        categoryId: "payments",
        question: "What payment methods does Thikana accept?",
        answer:
          "Thikana supports common local methods such as mobile banking and cards where available. Available options appear at checkout.",
      },
      {
        id: "service-payment",
        categoryId: "payments",
        question: "When do I pay for a booked service?",
        answer:
          "Most service bookings require confirmation first. Payment timing depends on the provider and is shown before you confirm the request.",
      },
      {
        id: "refunds",
        categoryId: "payments",
        question: "How do refunds work?",
        answer:
          "If a booking is cancelled under eligible conditions, refunds are processed to the original payment method within a few business days.",
      },
      {
        id: "broker-fees",
        categoryId: "payments",
        question: "Does Thikana charge broker fees?",
        answer:
          "No. Thikana connects renters and landlords directly so you can avoid traditional broker commissions on verified listings.",
      },
      {
        id: "invoices",
        categoryId: "payments",
        question: "Can I get an invoice for my payment?",
        answer:
          "Yes. After a successful payment, you can download a receipt from your booking history or request an invoice from support.",
      },
    ],
  },
  {
    id: "service-providers",
    categoryId: "service-providers",
    eyebrow: "SERVICE PROVIDERS",
    title: "Booking Local Services",
    items: [
      {
        id: "book-provider",
        categoryId: "service-providers",
        question: "How do I book a service provider?",
        answer:
          "Browse Services, open a provider profile, choose a time slot, and send a booking request. The provider will confirm availability.",
      },
      {
        id: "provider-verified",
        categoryId: "service-providers",
        question: "Are service providers verified?",
        answer:
          "Yes. Providers complete identity checks and document review before receiving a verified badge on Thikana.",
      },
      {
        id: "cancel-booking",
        categoryId: "service-providers",
        question: "Can I cancel a service booking?",
        answer:
          "Yes. You can cancel from your bookings page. Cancellation terms and any fees are shown before you confirm.",
      },
      {
        id: "become-provider",
        categoryId: "service-providers",
        question: "How do I join as a service provider?",
        answer:
          "Apply through Join as Provider, submit your documents, and wait for verification. Once approved, you can start receiving bookings.",
      },
    ],
  },
];

export const faqCta = {
  eyebrow: "Still have questions?",
  title: "Can't Find Your Answer?",
  subtitle: "Our support team is happy to help. Reach out any time.",
  primaryLabel: "Contact Support",
  secondaryLabel: "Chat on WhatsApp",
} as const;
