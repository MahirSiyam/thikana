export type AdminNavItem = {
  id: string;
  label: string;
  iconSrc: string;
  href?: string;
};

export type AdminUser = {
  initials: string;
  name: string;
  role: string;
  badge: string;
};
