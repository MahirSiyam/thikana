export type ContactBadge = {
  id: string;
  label: string;
};

export type ContactInfoCard = {
  id: string;
  title: string;
  primary: string;
  secondary: string;
  iconSrc: string;
  href?: string;
};

export type ContactFaqItem = {
  id: string;
  question: string;
};

export type ContactSocialLink = {
  id: string;
  label: string;
  handle: string;
  iconSrc: string;
  href: string;
};

export type ContactSupportHour = {
  id: string;
  day: string;
  hours: string;
  closed?: boolean;
};

export type ContactRoleOption = {
  value: string;
  label: string;
};
