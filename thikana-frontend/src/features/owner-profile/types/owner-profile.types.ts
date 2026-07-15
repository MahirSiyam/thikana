export type OwnerVerificationItem = {
  id: string;
  label: string;
  verified: boolean;
};

export type OwnerSecurityRow = {
  id: string;
  label: string;
  value: string;
  badge?: "enabled";
};

export type OwnerListedProperty = {
  id: string;
  label: string;
  imageSrc: string;
};

export type OwnerProfile = {
  fullName: string;
  roleBadge: string;
  location: string;
  memberSince: string;
  avatarSrc: string;
  email: string;
  phone: string;
  passwordMasked: string;
  twoFactorEnabled: boolean;
  notificationChannels: string;
  verificationItems: OwnerVerificationItem[];
  allVerified: boolean;
  securityRows: OwnerSecurityRow[];
  listedProperties: OwnerListedProperty[];
};
