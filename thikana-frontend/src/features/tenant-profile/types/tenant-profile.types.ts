export type ProfileField = {
  label: string;
  value: string;
};

export type ProfileChecklistItem = {
  id: string;
  label: string;
  done: boolean;
};

export type SecurityRow = {
  id: string;
  title: string;
  description: string;
  action: "change" | "unlink" | "edit" | "toggle";
};

export type TenantProfile = {
  fullName: string;
  roleBadge: string;
  idVerified: boolean;
  completionPercent: number;
  email: string;
  phone: string;
  avatarSrc: string;
  personalFields: ProfileField[];
  checklist: ProfileChecklistItem[];
  securityRows: SecurityRow[];
  twoFactorEnabled: boolean;
};
