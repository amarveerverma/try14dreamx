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
  onboarding_completed?: boolean;
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
  signInWithEmail: (email: string, password: string) => Promise<{ success: boolean; error?: string; role?: UserRole; onboarding_completed?: boolean }>;
  signUpWithEmail: (
    email: string,
    password: string,
    fullName: string,
    role: UserRole,
    phone?: string
  ) => Promise<{ success: boolean; error?: string; hasSession?: boolean; alreadyExists?: boolean; role?: UserRole }>;
  signInWithGoogle: (roleHint?: UserRole) => Promise<void>;
  upgradeMembership: (tier: "pro" | "elite", annual?: boolean) => Promise<void>;
  cancelMembership: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
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
  const fetchProfile = React.useCallback(async (userId: string, authUserEmail?: string, roleHint?: UserRole) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, email, role, avatar_url, phone, segment, onboarding_completed")
        .eq("id", userId)
        .maybeSingle();

      // Check session user_metadata for role if not in data or if roleHint is provided
      let resolvedRole: UserRole = roleHint || "student";
      let resolvedName = "User";
      let resolvedOnboarding = false;

      if (!error && data) {
        resolvedRole = (data.role as UserRole) || roleHint || "student";
        resolvedName = data.full_name || authUserEmail?.split("@")[0] || "User";
        resolvedOnboarding = data.onboarding_completed ?? false;
      } else {
        // Fallback to session user_metadata
        try {
          const { data: sessionData } = await supabase.auth.getSession();
          const metaRole = sessionData?.session?.user?.user_metadata?.role as UserRole;
          const metaName = sessionData?.session?.user?.user_metadata?.full_name || sessionData?.session?.user?.user_metadata?.name;
          resolvedRole = (data?.role as UserRole) || metaRole || roleHint || "student";
          if (metaName) resolvedName = metaName;
        } catch {
          // ignore
        }
      }

      const profile: UserProfile = {
        id: data?.id || userId,
        name: resolvedName,
        email: data?.email || authUserEmail || "",
        role: resolvedRole,
        avatar: data?.avatar_url || undefined,
        phone: data?.phone || undefined,
        segment: data?.segment || null,
        onboarding_completed: resolvedOnboarding,
      };

      setUser(profile);
      if (typeof window !== "undefined") {
        localStorage.setItem("dreamx_user", JSON.stringify(profile));
        document.cookie = `dreamx_role=${profile.role}; path=/; max-age=604800; SameSite=Lax`;
        document.cookie = `dreamx_auth=true; path=/; max-age=604800; SameSite=Lax`;
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
    } catch (err) {
      console.warn("Could not fetch remote profile:", err);
    }

    // Fallback if profile row is not yet indexed
    if (authUserEmail) {
      let fallbackRole: UserRole = roleHint || "student";
      if (!roleHint && typeof window !== "undefined") {
        const cookieRole = document.cookie
          .split("; ")
          .find((c) => c.startsWith("dreamx_role="))
          ?.split("=")[1] as UserRole;
        if (cookieRole === "mentor" || cookieRole === "admin") {
          fallbackRole = cookieRole;
        }
      }
      const fallbackProfile: UserProfile = {
        id: userId,
        name: authUserEmail.split("@")[0],
        email: authUserEmail,
        role: fallbackRole,
      };
      setUser(fallbackProfile);
      if (typeof window !== "undefined") {
        localStorage.setItem("dreamx_user", JSON.stringify(fallbackProfile));
        document.cookie = `dreamx_role=${fallbackProfile.role}; path=/; max-age=604800; SameSite=Lax`;
        document.cookie = `dreamx_auth=true; path=/; max-age=604800; SameSite=Lax`;
      }
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
          const metaRole = session.user.user_metadata?.role as UserRole | undefined;
          await fetchProfile(session.user.id, session.user.email, metaRole);
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
          const metaRole = session.user.user_metadata?.role as UserRole | undefined;
          await fetchProfile(session.user.id, session.user.email, metaRole);
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
        // Determine role and onboarding state for routing
        const { data: profile } = await supabase
          .from("profiles")
          .select("role, onboarding_completed")
          .eq("id", data.user.id)
          .maybeSingle();

        return {
          success: true,
          role: (profile?.role as UserRole) || "student",
          onboarding_completed: profile?.onboarding_completed ?? false,
        };
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
      const cleanEmail = email.trim().toLowerCase();

      // Immediately cache user role intent in cookie so middleware strictly respects it
      if (typeof window !== "undefined") {
        document.cookie = `dreamx_role=${role}; path=/; max-age=604800; SameSite=Lax`;
      }

      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
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

      // Check if user already exists (Supabase returns an empty identities array for existing users)
      if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
        return {
          success: false,
          error: "An account with this email address already exists. Please log in with your password.",
          alreadyExists: true,
        };
      }

      // Proactively establish initial profile with chosen role
      if (data.user) {
        const initialProfile: UserProfile = {
          id: data.user.id,
          name: fullName || cleanEmail.split("@")[0],
          email: cleanEmail,
          role,
          phone: phone || undefined,
          onboarding_completed: false,
        };
        setUser(initialProfile);
        if (typeof window !== "undefined") {
          localStorage.setItem("dreamx_user", JSON.stringify(initialProfile));
          document.cookie = `dreamx_role=${role}; path=/; max-age=604800; SameSite=Lax`;
          document.cookie = `dreamx_auth=true; path=/; max-age=604800; SameSite=Lax`;
        }

        // Proactively upsert into public.profiles to guarantee role and onboarding state
        try {
          await supabase.from("profiles").upsert(
            {
              id: data.user.id,
              full_name: fullName,
              email: cleanEmail,
              role: role,
              phone: phone || null,
              onboarding_completed: false,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "id" }
          );
        } catch {
          // ignore background upsert
        }
      }

      // If no session was returned by signUp, attempt immediate sign-in with the credentials provided
      // because our database trigger auto_confirm_user() confirms the email immediately.
      let hasSession = !!data.session;
      if (!hasSession && data.user) {
        try {
          const { data: signInData } = await supabase.auth.signInWithPassword({
            email: cleanEmail,
            password,
          });
          if (signInData?.session) {
            hasSession = true;
            await fetchProfile(signInData.user.id, signInData.user.email, role);
          }
        } catch {
          // ignore fallback attempt
        }
      } else if (data.user) {
        await fetchProfile(data.user.id, data.user.email, role);
      }

      return { success: true, hasSession, role };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : "Registration failed" };
    }
  };

  const signInWithGoogle = async (roleHint: UserRole = "student") => {
    const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
    if (typeof window !== "undefined") {
      document.cookie = `dreamx_role=${roleHint}; path=/; max-age=604800; SameSite=Lax`;
    }
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/verify-email?role=${roleHint}`,
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
      document.cookie = "dreamx_role=; path=/; max-age=0; SameSite=Lax";
      document.cookie = "dreamx_auth=; path=/; max-age=0; SameSite=Lax";
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

  const completeOnboarding = async () => {
    if (!user?.id) return;
    try {
      await supabase
        .from("profiles")
        .update({ onboarding_completed: true, updated_at: new Date().toISOString() })
        .eq("id", user.id);

      setUser((prev) => (prev ? { ...prev, onboarding_completed: true } : null));
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("dreamx_user");
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            parsed.onboarding_completed = true;
            localStorage.setItem("dreamx_user", JSON.stringify(parsed));
          } catch {
            // ignore
          }
        }
      }
    } catch (err) {
      console.warn("Failed to complete onboarding:", err);
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
        completeOnboarding,
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
