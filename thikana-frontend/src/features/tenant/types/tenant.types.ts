export type TenantNavItem = {
  id: string;
  label: string;
  iconSrc: string;
  href?: string;
};

export type TenantUser = {
  name: string;
  firstName: string;
  roleBadge: string;
  avatarSrc: string;
  topbarAvatarSrc: string;
};
