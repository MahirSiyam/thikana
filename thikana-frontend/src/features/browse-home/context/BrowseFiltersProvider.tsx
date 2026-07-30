"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  browseFiltersToSearchParams,
  defaultBrowseFilters,
  parseBrowseFilters,
  type BrowseFiltersState,
} from "@/features/browse-home/lib/browse-filters";

type BrowseFiltersContextValue = {
  filters: BrowseFiltersState;
  draft: BrowseFiltersState;
  setDraft: (patch: Partial<BrowseFiltersState>) => void;
  applyDraft: (patch?: Partial<BrowseFiltersState>) => void;
  applyFilters: (next: BrowseFiltersState) => void;
  setPage: (page: number) => void;
  setSort: (sort: BrowseFiltersState["sort"]) => void;
  resetFilters: () => void;
};

const BrowseFiltersContext = createContext<BrowseFiltersContextValue | null>(
  null
);

function sameFilters(a: BrowseFiltersState, b: BrowseFiltersState) {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function BrowseFiltersProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initial = useMemo(
    () => parseBrowseFilters(new URLSearchParams(searchParams.toString())),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- hydrate once from first URL
    []
  );

  const [filters, setFilters] = useState<BrowseFiltersState>(initial);
  const [draft, setDraftState] = useState<BrowseFiltersState>(initial);

  useEffect(() => {
    const fromUrl = parseBrowseFilters(
      new URLSearchParams(searchParams.toString())
    );
    setFilters((current) => (sameFilters(current, fromUrl) ? current : fromUrl));
    setDraftState((current) =>
      sameFilters(current, fromUrl) ? current : fromUrl
    );
  }, [searchParams]);

  const pushFilters = useCallback(
    (next: BrowseFiltersState) => {
      const qs = browseFiltersToSearchParams(next).toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
      setFilters(next);
      setDraftState(next);
    },
    [pathname, router]
  );

  const setDraft = useCallback((patch: Partial<BrowseFiltersState>) => {
    setDraftState((current) => ({ ...current, ...patch }));
  }, []);

  const applyFilters = useCallback(
    (next: BrowseFiltersState) => {
      pushFilters({ ...next, page: next.page || 1 });
    },
    [pushFilters]
  );

  const applyDraft = useCallback(
    (patch?: Partial<BrowseFiltersState>) => {
      const next = { ...draft, ...patch, page: 1 };
      pushFilters(next);
    },
    [draft, pushFilters]
  );

  const setPage = useCallback(
    (page: number) => {
      pushFilters({ ...filters, page });
    },
    [filters, pushFilters]
  );

  const setSort = useCallback(
    (sort: BrowseFiltersState["sort"]) => {
      pushFilters({ ...filters, sort, page: 1 });
    },
    [filters, pushFilters]
  );

  const resetFilters = useCallback(() => {
    pushFilters(defaultBrowseFilters());
  }, [pushFilters]);

  const value = useMemo(
    () => ({
      filters,
      draft,
      setDraft,
      applyDraft,
      applyFilters,
      setPage,
      setSort,
      resetFilters,
    }),
    [
      filters,
      draft,
      setDraft,
      applyDraft,
      applyFilters,
      setPage,
      setSort,
      resetFilters,
    ]
  );

  return (
    <BrowseFiltersContext.Provider value={value}>
      {children}
    </BrowseFiltersContext.Provider>
  );
}

export function useBrowseFilters() {
  const ctx = useContext(BrowseFiltersContext);
  if (!ctx) {
    throw new Error("useBrowseFilters must be used within BrowseFiltersProvider");
  }
  return ctx;
}
