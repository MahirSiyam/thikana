export const routes = {
  home: "/",
  browseHome: "/browse-home",
  homeDetails: "/home-details",
  services: "/services",
  serviceProviderDetails: (slug: string) => `/services/${slug}`,
  about: "/about",
  contactUs: "/contact-us",
  signIn: "/signin",
} as const;
