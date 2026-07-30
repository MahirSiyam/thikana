import { authorizedFetch } from "@/lib/api/client";

export type SavedHomeDto = {
  id: string;
  listingId: string;
  slug: string;
  title: string;
  location: string;
  monthlyRent: number;
  beds: number;
  baths: number;
  sizeSqft: number;
  imageUrl: string | null;
  propertyType: string;
  savedAt: string;
};

export const listSavedHomes = async () => {
  const response = await authorizedFetch<SavedHomeDto[]>(
    "/api/tenant/saved-homes"
  );
  return (response.data as SavedHomeDto[]) || [];
};

export const saveHome = async (listingId: string) => {
  const response = await authorizedFetch<SavedHomeDto>(
    "/api/tenant/saved-homes",
    {
      method: "POST",
      body: JSON.stringify({ listingId }),
    }
  );
  return response.data as SavedHomeDto;
};

export const removeSavedHome = async (listingId: string) => {
  const response = await authorizedFetch<{ listingId: string }>(
    `/api/tenant/saved-homes/${listingId}`,
    { method: "DELETE" }
  );
  return response.data as { listingId: string };
};

export const checkSavedHome = async (listingId: string) => {
  const response = await authorizedFetch<{ saved: boolean }>(
    `/api/tenant/saved-homes/${listingId}`
  );
  return Boolean(response.data?.saved);
};
