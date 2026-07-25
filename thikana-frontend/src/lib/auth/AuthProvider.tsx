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
import { onAuthStateChanged, type User as FirebaseUser } from "firebase/auth";
import { getMe, type MeUser } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { auth } from "@/lib/firebase/firebase";

type AuthContextValue = {
  firebaseUser: FirebaseUser | null;
  profile: MeUser | null;
  loading: boolean;
  refreshProfile: () => Promise<MeUser | null>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<MeUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = useCallback(async () => {
    if (!auth.currentUser) {
      setProfile(null);
      return null;
    }

    try {
      const me = await getMe("user");
      setProfile(me);
      return me;
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        setProfile(null);
        return null;
      }
      throw error;
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      try {
        await refreshProfile();
      } catch (error) {
        console.error("Failed to load auth profile:", error);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, [refreshProfile]);

  const value = useMemo(
    () => ({
      firebaseUser,
      profile,
      loading,
      refreshProfile,
    }),
    [firebaseUser, profile, loading, refreshProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
