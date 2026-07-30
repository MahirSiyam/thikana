"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

/** sessionStorage keys for in-progress form drafts (cleared on successful submit). */
export const formDraftKeys = {
  ownerAddListing: "thikana-form:owner-add-listing",
  contactMessage: "thikana-form:contact-message",
  signInEmail: "thikana-form:signin-email",
  adminSignInEmail: "thikana-form:admin-signin-email",
  adminSiteSettings: "thikana-form:admin-site-settings",
  ownerProfileEdit: "thikana-form:owner-profile-edit",
  tenantProfileEdit: "thikana-form:tenant-profile-edit",
  serviceProviderProfile: "thikana-form:sp-service-profile",
  providerBooking: "thikana-form:provider-booking",
} as const;

export function readSessionJson<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function writeSessionJson(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // quota / private mode
  }
}

export function removeSessionJson(key: string): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(key);
  } catch {
    // ignore
  }
}

function resolveInitial<T>(initialValue: T | (() => T)): T {
  return typeof initialValue === "function"
    ? (initialValue as () => T)()
    : initialValue;
}

type UsePersistedStateOptions<T> = {
  /** Merge stored JSON into the default (e.g. deep merge / validate). */
  merge?: (stored: unknown, fallback: T) => T;
  /** Skip writing until hydrated (always true) or while false. */
  enabled?: boolean;
};

/**
 * useState that survives page reload via sessionStorage.
 * Never store passwords or secrets — omit them from the value you pass.
 */
export function usePersistedState<T>(
  key: string,
  initialValue: T | (() => T),
  options?: UsePersistedStateOptions<T>
): [T, Dispatch<SetStateAction<T>>, { hydrated: boolean; clear: () => void }] {
  const merge = options?.merge;
  const enabled = options?.enabled !== false;

  const [state, setState] = useState<T>(() => resolveInitial(initialValue));
  const [hydrated, setHydrated] = useState(false);

  useLayoutEffect(() => {
    const fallback = resolveInitial(initialValue);
    const stored = readSessionJson<unknown>(key);
    if (stored == null) {
      setState(fallback);
    } else if (merge) {
      setState(merge(stored, fallback));
    } else {
      setState(stored as T);
    }
    setHydrated(true);
    // intentionally only on mount / key change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    if (!hydrated || !enabled) return;
    writeSessionJson(key, state);
  }, [enabled, hydrated, key, state]);

  const clear = useCallback(() => {
    setState(resolveInitial(initialValue));
    removeSessionJson(key);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return [state, setState, { hydrated, clear }];
}
