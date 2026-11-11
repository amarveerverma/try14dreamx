"use client";

import * as React from "react";
import { createClient } from "./supabase/client";

export type UserRole = "student" | "mentor" | "admin";
export type MembershipTier = "free" | "pro" | "elite";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  segment?: string | null;
}

export interface MembershipState {
  tier: MembershipTier;
  status: "active" | "none" | "expired";
  discountPercent: number;
  renewalDate?: string;
  annualBilling?: boolean;
}

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  membership: MembershipState;
  login: (role: UserRole, email?: string, name?: string) => void;
  logout: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<{ success: boolean; error?: string; role?: UserRole }>;
  signUpWithEmail: (
    email: string,
    password: string,
    fullName: string,
    role: UserRole,
    phone?: string
  ) => Promise<{ success: boolean; error?: string }>;
  signInWithGoogle: () => Promise<void>;
  upgradeMembership: (tier: "pro" | "elite", annual?: boolean) => void;
  cancelMembership: () => void;
  refreshProfile: () => Promise<void>;
}

const defaultMembership: MembershipState = {
  tier: "free",
  status: "none",
  discountPercent: 0,
};

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [membership, setMembership] = React.useState<MembershipState>(defaultMembership);

  const supabase = React.useMemo(() => createClient(), []);

  // Fetch profile from public.profiles
  const fetchProfile = React.useCallback(async (userId: string, authUserEmail?: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, email, role, avatar_url, phone, segment")
        .eq("id", userId)
        .maybeSingle();

      if (!error && data) {
        const profile: UserProfile = {
          id: data.id,
          name: data.full_name || "User",
          email: data.email || authUserEmail || "",
          role: (data.role as UserRole) || "student",
          avatar: data.avatar_url || undefined,
          phone: data.phone || undefined,
          segment: data.segment || null,
        };
        setUser(profile);
        if (typeof window !== "undefined") {
          localStorage.setItem("dreamx_user", JSON.stringify(profile));
        }
        return;
      }
    } catch (err) {
      console.warn("Could not fetch remote profile:", err);
    }

    // Fallback if profile row is not yet indexed
    if (authUserEmail) {
      const fallbackProfile: UserProfile = {
        id: userId,
        name: authUserEmail.split("@")[0],
        email: authUserEmail,
        role: "student",
      };
      setUser(fallbackProfile);
    }
  }, [supabase]);

  // Initial Auth session detection
  React.useEffect(() => {
    async function initAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          await fetchProfile(session.user.id, session.user.email);
        } else {
          // Check local prototype session
          const stored = localStorage.getItem("dreamx_user");
          if (stored) {
            try {
              setUser(JSON.parse(stored));
            } catch {
              // ignore
            }
          }
        }
      } catch (err) {
        console.warn("Auth initialization error:", err);
      } finally {
        setIsLoading(false);
      }
    }

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          await fetchProfile(session.user.id, session.user.email);
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          localStorage.removeItem("dreamx_user");
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, fetchProfile]);

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        await fetchProfile(data.user.id, data.user.email);
        // Determine role for routing
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .maybeSingle();

        return { success: true, role: (profile?.role as UserRole) || "student" };
      }

      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : "Authentication failed" };
    }
  };

  const signUpWithEmail = async (
    email: string,
    password: string,
    fullName: string,
    role: UserRole,
    phone?: string
  ) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role,
            phone,
          },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        await fetchProfile(data.user.id, data.user.email);
      }

      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : "Registration failed" };
    }
  };

  const signInWithGoogle = async () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/verify-email`,
      },
    });
  };

  const login = (role: UserRole, email = "candidate@dreamx.in", name = "Candidate") => {
    const newUser: UserProfile = {
      id: "dx-" + Math.floor(1000 + Math.random() * 9000),
      name,
      email,
      role,
    };
    setUser(newUser);
    if (typeof window !== "undefined") {
      localStorage.setItem("dreamx_user", JSON.stringify(newUser));
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
    setUser(null);
    setMembership(defaultMembership);
    if (typeof window !== "undefined") {
      localStorage.removeItem("dreamx_user");
      localStorage.removeItem("dreamx_membership");
    }
  };

  const upgradeMembership = (tier: "pro" | "elite", annual = false) => {
    const discountPercent = tier === "elite" ? 10 : 5;
    const renewal = new Date();
    if (annual) {
      renewal.setFullYear(renewal.getFullYear() + 1);
    } else {
      renewal.setMonth(renewal.getMonth() + 1);
    }

    const nextMembership: MembershipState = {
      tier,
      status: "active",
      discountPercent,
      annualBilling: annual,
      renewalDate: renewal.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    };

    setMembership(nextMembership);
    if (typeof window !== "undefined") {
      localStorage.setItem("dreamx_membership", JSON.stringify(nextMembership));
    }
  };

  const cancelMembership = () => {
    setMembership(defaultMembership);
    if (typeof window !== "undefined") {
      localStorage.removeItem("dreamx_membership");
    }
  };

  const refreshProfile = async () => {
    if (user?.id) {
      await fetchProfile(user.id, user.email);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isAuthenticated: !!user,
        isLoading,
        membership,
        login,
        logout,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        upgradeMembership,
        cancelMembership,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
