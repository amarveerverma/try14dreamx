"use client";

import * as React from "react";

export type UserRole = "student" | "mentor" | "admin";
export type MembershipTier = "free" | "pro" | "elite";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
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
  membership: MembershipState;
  login: (role: UserRole, email?: string, name?: string) => void;
  logout: () => void;
  upgradeMembership: (tier: "pro" | "elite", annual?: boolean) => void;
  cancelMembership: () => void;
}

const defaultMembership: MembershipState = {
  tier: "free",
  status: "none",
  discountPercent: 0,
};

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Candidate DX-8421 session state (Default: Free tier, not hardcoded Pro)
  const [user, setUser] = React.useState<UserProfile | null>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("dreamx_user");
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          // ignore
        }
      }
    }
    return {
      id: "dx-8421",
      name: "Candidate",
      email: "candidate@dreamx.in",
      role: "student",
    };
  });

  const [membership, setMembership] = React.useState<MembershipState>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("dreamx_membership");
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          // ignore
        }
      }
    }
    // Default to FREE tier
    return defaultMembership;
  });

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

  const logout = () => {
    setUser(null);
    setMembership(defaultMembership);
    if (typeof window !== "undefined") {
      localStorage.removeItem("dreamx_user");
      localStorage.removeItem("dreamx_membership");
    }
  };

  const upgradeMembership = (tier: "pro" | "elite", annual = false) => {
    const discount = tier === "elite" ? 10 : 5;
    const newMembership: MembershipState = {
      tier,
      status: "active",
      discountPercent: discount,
      annualBilling: annual,
      renewalDate: annual ? "November 2027" : "December 2026",
    };
    setMembership(newMembership);
    if (typeof window !== "undefined") {
      localStorage.setItem("dreamx_membership", JSON.stringify(newMembership));
    }
  };

  const cancelMembership = () => {
    setMembership(defaultMembership);
    if (typeof window !== "undefined") {
      localStorage.setItem("dreamx_membership", JSON.stringify(defaultMembership));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isAuthenticated: !!user,
        membership,
        login,
        logout,
        upgradeMembership,
        cancelMembership,
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
