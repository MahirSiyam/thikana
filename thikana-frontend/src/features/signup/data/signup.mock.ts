import type { SignupRoleOption, SignupStep } from "@/features/signup/types/signup.types";

export const signupSteps: SignupStep[] = [
  { id: "role", label: "Role" },
  { id: "basic-info", label: "Basic Info" },
  { id: "verify-email", label: "Verify Email" },
  { id: "verify-identity", label: "Verify Identity" },
  { id: "details", label: "Details" },
];

export const signupRoleOptions: SignupRoleOption[] = [
  {
    id: "tenant",
    title: "Tenant",
    description: "I'm looking for a home or want to book a service.",
    iconSrc: "/images/signup/icon-house.svg",
  },
  {
    id: "property-owner",
    title: "Property Owner",
    description: "I want to list my property for rent.",
    iconSrc: "/images/signup/icon-building.svg",
  },
  {
    id: "service-provider",
    title: "Service Provider",
    description: "I want to offer services like electrical, plumbing, or cleaning.",
    iconSrc: "/images/signup/icon-wrench.svg",
  },
];

export const signupRoleCopy = {
  title: "Join Thikana as a...",
  subtitle: "Choose the option that best describes you.",
  continueLabel: "Continue →",
  alreadyHaveAccount: "Already have an account?",
  signInLabel: "Sign In →",
} as const;

export const tenantBasicInfoCopy = {
  title: "Let's start with the basics",
  subtitle:
    "This information helps owners, providers, and tenants trust who they're dealing with.",
  backLabel: "← Back",
  continueLabel: "Continue to Verification →",
  alreadyHaveAccount: "Already have an account?",
  signInLabel: "Sign In →",
} as const;

export const bangladeshDivisions = [
  "Dhaka",
  "Chattogram",
  "Rajshahi",
  "Khulna",
  "Barishal",
  "Sylhet",
  "Rangpur",
  "Mymensingh",
] as const;

export const tenantLookingAsOptions = [
  { id: "family", label: "🏠 Family" },
  { id: "bachelor", label: "🧑 Bachelor" },
  { id: "student", label: "🎓 Student" },
] as const;

export const tenantDetailsCopy = {
  title: "A few more details",
  subtitle: "This helps us show you the most relevant listings.",
  lookingAsLabel: "I'm looking for a home as:",
  locationLabel: "Preferred Location",
  locationPlaceholder: "Which area are you interested in? (optional)",
  budgetLabel: "Budget Range (optional)",
  budgetPlaceholder: "e.g. BDT 10,000 – 20,000",
  backLabel: "← Back",
  submitLabel: "Create My Account →",
  alreadyHaveAccount: "Already have an account?",
  signInLabel: "Sign In →",
} as const;

export const ownerContactMethodOptions = [
  { id: "phone", label: "📞 Phone Call" },
  { id: "whatsapp", label: "💬 WhatsApp" },
  { id: "in-app", label: "📩 In-app" },
] as const;

export const ownerDetailsCopy = {
  title: "Tell us about your property ownership",
  subtitle:
    "This information appears on your Owner profile and helps tenants trust your listings.",
  propertiesLabel: "Number of Properties You Plan to List",
  propertiesPlaceholder: "e.g. 1, 2–5, 5+",
  proofLabel: "Proof of Ownership / Rental Authority",
  proofTitle: "Drag & drop or click to upload",
  proofHint: "Deed, Utility Bill, or Power of Attorney accepted",
  contactLabel: "Preferred Contact Method",
  backLabel: "← Back",
  submitLabel: "Create My Account →",
  alreadyHaveAccount: "Already have an account?",
  signInLabel: "Sign In →",
} as const;

export const serviceCategoryOptions = [
  { id: "electrician", label: "⚡ Electrician" },
  { id: "plumber", label: "🚰 Plumber" },
  { id: "cleaner", label: "🧹 Cleaner" },
  { id: "house-mover", label: "📦 House Mover" },
] as const;

export const serviceProviderDetailsCopy = {
  title: "Set up your service profile",
  subtitle:
    "This information appears on your public profile so customers can find and trust your services.",
  categoryLabel: "Service Category",
  experienceLabel: "Years of Experience",
  experiencePlaceholder: "e.g. 3",
  areasLabel: "Service Areas",
  areasPlaceholder: "Add area...",
  certificateLabel: "Trade Certificate (optional)",
  certificateTitle: "Upload certificate",
  certificateHint: "Adds a Certified ✓ badge to your profile",
  bioLabel: "Short Bio",
  bioPlaceholder:
    "Tell customers about your experience and what makes your service reliable.",
  bioMaxLength: 200,
  backLabel: "← Back",
  submitLabel: "Create My Account →",
  alreadyHaveAccount: "Already have an account?",
  signInLabel: "Sign In →",
} as const;
