/**
 * DreamX Supabase Database TypeScript Definitions
 * Phase P2 Platform Foundations
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'student' | 'mentor' | 'admin';
export type CandidateSegment = 'student' | 'fresh_graduate' | 'early_career' | 'career_switcher';
export type VerificationStatus = 'pending' | 'in_review' | 'approved' | 'rejected';
export type ServiceCode = 'S01' | 'S02' | 'S03' | 'S04' | 'S05' | 'S06' | 'S07' | 'S08' | 'S09' | 'S10';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: UserRole;
          full_name: string;
          email: string;
          phone: string | null;
          avatar_url: string | null;
          segment: CandidateSegment | null;
          target_role: string | null;
          target_company_tier: string | null;
          experience_years: number;
          bio: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          role?: UserRole;
          full_name: string;
          email: string;
          phone?: string | null;
          avatar_url?: string | null;
          segment?: CandidateSegment | null;
          target_role?: string | null;
          target_company_tier?: string | null;
          experience_years?: number;
          bio?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          role?: UserRole;
          full_name?: string;
          email?: string;
          phone?: string | null;
          avatar_url?: string | null;
          segment?: CandidateSegment | null;
          target_role?: string | null;
          target_company_tier?: string | null;
          experience_years?: number;
          bio?: string | null;
          updated_at?: string;
        };
      };
      mentor_profiles: {
        Row: {
          id: string;
          current_employer: string;
          job_title: string;
          years_of_experience: number;
          verification_status: VerificationStatus;
          approved_services: ServiceCode[];
          bio: string | null;
          linkedin_url: string | null;
          upi_id: string | null;
          bank_account_number: string | null;
          bank_ifsc: string | null;
          sla_compliance_rate: number;
          rating: number;
          reviews_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          current_employer: string;
          job_title: string;
          years_of_experience?: number;
          verification_status?: VerificationStatus;
          approved_services?: ServiceCode[];
          bio?: string | null;
          linkedin_url?: string | null;
          upi_id?: string | null;
          bank_account_number?: string | null;
          bank_ifsc?: string | null;
          sla_compliance_rate?: number;
          rating?: number;
          reviews_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          current_employer?: string;
          job_title?: string;
          years_of_experience?: number;
          verification_status?: VerificationStatus;
          approved_services?: ServiceCode[];
          bio?: string | null;
          linkedin_url?: string | null;
          upi_id?: string | null;
          bank_account_number?: string | null;
          bank_ifsc?: string | null;
          sla_compliance_rate?: number;
          rating?: number;
          reviews_count?: number;
          updated_at?: string;
        };
      };
      audit_logs: {
        Row: {
          id: string;
          actor_id: string | null;
          action: string;
          target_type: string;
          target_id: string;
          reason_code: string | null;
          metadata: Json;
          ip_address: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          actor_id?: string | null;
          action: string;
          target_type: string;
          target_id: string;
          reason_code?: string | null;
          metadata?: Json;
          ip_address?: string | null;
          created_at?: string;
        };
        Update: never; // Audit logs are immutable
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          body: string;
          type: string;
          read: boolean;
          idempotency_key: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          body: string;
          type: string;
          read?: boolean;
          idempotency_key?: string | null;
          created_at?: string;
        };
        Update: {
          read?: boolean;
        };
      };
    };
  };
}
