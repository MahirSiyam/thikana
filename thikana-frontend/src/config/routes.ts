export const routes = {
  home: "/",
  browseHome: "/browse-home",
  homeDetails: "/home-details",
  services: "/services",
  serviceProviderDetails: (slug: string) => `/services/${slug}`,
  signIn: "/signin",
} as const;
