export type ServiceProviderNavItem = {
  id: string;
  label: string;
  iconSrc: string;
  href?: string;
};

export type ServiceProviderUser = {
  name: string;
  firstName: string;
  roleBadge: string;
  verifiedLabel: string;
  avatarSrc: string;
  topbarAvatarSrc: string;
};
