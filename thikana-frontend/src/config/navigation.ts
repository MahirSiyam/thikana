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
  variant: "text" | "primary";
};

export const headerNavigation: HeaderNavItem[] = [
  { label: "Home", href: routes.home, variant: "link" },
  { label: "Browse Houses", variant: "dropdown" },
  { label: "Services", variant: "dropdown" },
  { label: "About", variant: "action" },
  { label: "Contact Us", variant: "action" },
];

export const headerAuthActions: HeaderAuthItem[] = [
  { label: "Sign In", variant: "text" },
  { label: "Sign Up", variant: "primary" },
];

export const footerNavigation: NavItem[] = [
  { label: "Home", href: routes.home },
];
