import { routes } from "@/config/routes";
import type { AppRole } from "@/lib/api/auth";

export const ROLE_DASHBOARD_ROUTES: Record<AppRole, string> = {
  tenant: routes.tenantOverview,
  owner: routes.ownerOverview,
  service_provider: routes.serviceProviderOverview,
  admin: routes.adminOverview,
};

export const ROLE_SIGNUP_RESUME_ROUTES: Record<Exclude<AppRole, "admin">, string> = {
  tenant: routes.signUpTenantForm,
  owner: routes.signUpOwnerForm,
  service_provider: routes.signUpServiceProviderForm,
};
