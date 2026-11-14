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
  upgradeMembership: (tier: "pro" | "elite", annual?: boolean) => Promise<void>;
  cancelMembership: () => Promise<void>;
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

        // Fetch verified membership from database (PRD §7.2, P10 Exit Criteria 2)
        try {
          const { data: memberData } = await supabase.rpc("get_user_membership", {
            p_user_id: userId,
          });

          if (memberData) {
            const m = memberData as {
              plan: MembershipTier;
              is_active: boolean;
              discount_pct: number;
              billing_cycle?: string;
              current_period_end?: string;
            };
            setMembership({
              tier: m.plan || "free",
              status: m.is_active ? "active" : "none",
              discountPercent: Math.round((m.discount_pct || 0) * 100),
              annualBilling: m.billing_cycle === "yearly",
              renewalDate: m.current_period_end
                ? new Date(m.current_period_end).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : undefined,
            });
          }
        } catch {
          // Fallback to default
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
    // Immediate local cache sync to eliminate hydration lag
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("dreamx_user");
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch {
          // ignore
        }
      }
    }

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
    const validUuid =
      role === "admin"
        ? "00000000-0000-0000-0000-000000000001"
        : role === "mentor"
        ? "c1111111-2222-3333-4444-555555555501"
        : "a1111111-b222-c333-d444-e55555555501";

    const newUser: UserProfile = {
      id: validUuid,
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

  const upgradeMembership = async (tier: "pro" | "elite", annual = false) => {
    try {
      const res = await fetch("/api/membership/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: tier,
          billingCycle: annual ? "yearly" : "monthly",
        }),
      });

      if (res.ok && user) {
        await fetchProfile(user.id, user.email);
      }
    } catch (err) {
      console.warn("Failed to subscribe membership:", err);
    }
  };

  const cancelMembership = async () => {
    try {
      const res = await fetch("/api/membership/cancel", {
        method: "POST",
      });

      if (res.ok && user) {
        await fetchProfile(user.id, user.email);
      }
    } catch (err) {
      console.warn("Failed to cancel membership:", err);
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
