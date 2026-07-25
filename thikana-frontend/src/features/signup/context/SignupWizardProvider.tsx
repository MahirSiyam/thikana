"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { AppRole, CloudinaryAsset, RegistrationPayload } from "@/lib/api/auth";

export type SignupRole = Exclude<AppRole, "admin">;

export type SignupWizardState = {
  role: SignupRole | null;
  /** Kept for restoring the basic-info step; registration uses Firebase email. */
  email: string;
  commonData: {
    fullName: string;
    phone: string;
    address: {
      division?: string;
      district?: string;
      area?: string;
    };
    identityDocuments: {
      nidFront?: CloudinaryAsset;
      nidBack?: CloudinaryAsset;
      selfie?: CloudinaryAsset;
    };
  };
  profileData: Record<string, unknown>;
};

type SignupWizardContextValue = {
  state: SignupWizardState;
  hydrated: boolean;
  setRole: (role: SignupRole) => void;
  setEmail: (email: string) => void;
  patchCommonData: (patch: Partial<SignupWizardState["commonData"]>) => void;
  setIdentityDocuments: (
    docs: SignupWizardState["commonData"]["identityDocuments"]
  ) => void;
  setProfileData: (profileData: Record<string, unknown>) => void;
  buildRegistrationPayload: () => RegistrationPayload;
  clear: () => void;
};

const STORAGE_KEY = "thikana-signup-wizard";

const emptyState = (): SignupWizardState => ({
  role: null,
  email: "",
  commonData: {
    fullName: "",
    phone: "",
    address: {},
    identityDocuments: {},
  },
  profileData: {},
});

function mergeStoredState(raw: unknown): SignupWizardState {
  const base = emptyState();
  if (!raw || typeof raw !== "object") return base;
  const parsed = raw as Partial<SignupWizardState>;
  return {
    ...base,
    ...parsed,
    email: typeof parsed.email === "string" ? parsed.email : "",
    commonData: {
      ...base.commonData,
      ...(parsed.commonData || {}),
      address: {
        ...base.commonData.address,
        ...(parsed.commonData?.address || {}),
      },
      identityDocuments: {
        ...base.commonData.identityDocuments,
        ...(parsed.commonData?.identityDocuments || {}),
      },
    },
    profileData: parsed.profileData || {},
  };
}

const SignupWizardContext = createContext<SignupWizardContextValue | undefined>(
  undefined
);

function readStoredState(): SignupWizardState {
  if (typeof window === "undefined") return emptyState();
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState();
    return mergeStoredState(JSON.parse(raw));
  } catch {
    return emptyState();
  }
}

export function SignupWizardProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SignupWizardState>(emptyState);
  const [hydrated, setHydrated] = useState(false);

  useLayoutEffect(() => {
    setState(readStoredState());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore storage failures
    }
  }, [hydrated, state]);

  const setRole = useCallback((role: SignupRole) => {
    setState((current) => ({ ...current, role }));
  }, []);

  const setEmail = useCallback((email: string) => {
    setState((current) => ({ ...current, email: email.trim() }));
  }, []);

  const patchCommonData = useCallback(
    (patch: Partial<SignupWizardState["commonData"]>) => {
      setState((current) => ({
        ...current,
        commonData: {
          ...current.commonData,
          ...patch,
          address: {
            ...current.commonData.address,
            ...(patch.address || {}),
          },
          identityDocuments: {
            ...current.commonData.identityDocuments,
            ...(patch.identityDocuments || {}),
          },
        },
      }));
    },
    []
  );

  const setIdentityDocuments = useCallback(
    (docs: SignupWizardState["commonData"]["identityDocuments"]) => {
      setState((current) => ({
        ...current,
        commonData: {
          ...current.commonData,
          identityDocuments: docs,
        },
      }));
    },
    []
  );

  const setProfileData = useCallback((profileData: Record<string, unknown>) => {
    setState((current) => ({ ...current, profileData }));
  }, []);

  const clear = useCallback(() => {
    setState(emptyState());
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  const buildRegistrationPayload = useCallback((): RegistrationPayload => {
    if (!state.role) {
      throw new Error("Select a role before completing registration");
    }
    if (!state.commonData.fullName.trim() || !state.commonData.phone.trim()) {
      throw new Error("Complete basic info before finishing registration");
    }

    return {
      role: state.role,
      commonData: {
        fullName: state.commonData.fullName.trim(),
        phone: state.commonData.phone.trim(),
        address: state.commonData.address,
        identityDocuments: state.commonData.identityDocuments,
      },
      profileData: state.profileData,
    };
  }, [state]);

  const value = useMemo(
    () => ({
      state,
      hydrated,
      setRole,
      setEmail,
      patchCommonData,
      setIdentityDocuments,
      setProfileData,
      buildRegistrationPayload,
      clear,
    }),
    [
      state,
      hydrated,
      setRole,
      setEmail,
      patchCommonData,
      setIdentityDocuments,
      setProfileData,
      buildRegistrationPayload,
      clear,
    ]
  );

  return (
    <SignupWizardContext.Provider value={value}>
      {children}
    </SignupWizardContext.Provider>
  );
}

export function useSignupWizard() {
  const context = useContext(SignupWizardContext);
  if (!context) {
    throw new Error("useSignupWizard must be used within SignupWizardProvider");
  }
  return context;
}
