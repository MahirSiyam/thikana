import { routes } from "@/config/routes";

export type NavItem = {
  label: string;
  href: string;
};

export type HeaderNavItem = {
  label: string;
  href?: string;
  variant: "link" | "dropdown" | "action";
};

export type HeaderAuthItem = {
  label: string;
  href?: string;
  variant: "text" | "primary";
};

export const headerNavigation: HeaderNavItem[] = [
  { label: "Home", href: routes.home, variant: "link" },
  { label: "Browse Houses", href: routes.browseHome, variant: "link" },
  { label: "Services", href: routes.services, variant: "link" },
  { label: "About", href: routes.about, variant: "link" },
  { label: "Contact Us", href: routes.contactUs, variant: "link" },
];

export const headerAuthActions: HeaderAuthItem[] = [
  { label: "Sign In", href: routes.signIn, variant: "text" },
  { label: "Sign Up", href: routes.signUpTenant, variant: "primary" },
];

export const footerNavigation: NavItem[] = [
  { label: "Home", href: routes.home },
  { label: "Browse Houses", href: routes.browseHome },
  { label: "Services", href: routes.services },
  { label: "About", href: routes.about },
  { label: "Contact Us", href: routes.contactUs },
];
