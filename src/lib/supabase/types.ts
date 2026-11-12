/**
 * DreamX Supabase Database TypeScript Definitions
 * Adheres strictly to @supabase/supabase-js GenericTable structure with Relationships.
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
        Relationships: [];
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
        Relationships: [];
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
        Update: {
          id?: string;
          actor_id?: string | null;
          action?: string;
          target_type?: string;
          target_id?: string;
          reason_code?: string | null;
          metadata?: Json;
          ip_address?: string | null;
          created_at?: string;
        };
        Relationships: [];
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
        Relationships: [];
      };
      services: {
        Row: {
          id: string;
          code: ServiceCode;
          slug: string;
          title: string;
          short_description: string;
          full_description: string;
          category: string;
          duration_minutes: number;
          list_paise: number;
          deliverable: string;
          sla_hours: number;
          format: string;
          popular: boolean;
          prerequisites: string[];
          rubric_criteria: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          code: ServiceCode;
          slug: string;
          title: string;
          short_description: string;
          full_description: string;
          category: string;
          duration_minutes: number;
          list_paise: number;
          deliverable: string;
          sla_hours?: number;
          format: string;
          popular?: boolean;
          prerequisites?: string[];
          rubric_criteria?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          code?: ServiceCode;
          slug?: string;
          title?: string;
          short_description?: string;
          full_description?: string;
          category?: string;
          duration_minutes?: number;
          list_paise?: number;
          deliverable?: string;
          sla_hours?: number;
          format?: string;
          popular?: boolean;
          prerequisites?: string[];
          rubric_criteria?: string[];
          updated_at?: string;
        };
        Relationships: [];
      };
      readiness_assessments: {
        Row: {
          id: string;
          user_id: string;
          overall_score: number;
          segment: CandidateSegment;
          rubric_version: string;
          evidence_coverage: number;
          dimension_scores: Json;
          assessor_id: string | null;
          is_private: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          overall_score: number;
          segment: CandidateSegment;
          rubric_version?: string;
          evidence_coverage?: number;
          dimension_scores: Json;
          assessor_id?: string | null;
          is_private?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          overall_score?: number;
          segment?: CandidateSegment;
          rubric_version?: string;
          evidence_coverage?: number;
          dimension_scores?: Json;
          assessor_id?: string | null;
          is_private?: boolean;
        };
        Relationships: [];
      };
      career_journey_events: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string;
          category: string;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description: string;
          category: string;
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string;
          category?: string;
          metadata?: Json;
        };
        Relationships: [];
      };
      mentor_applications: {
        Row: {
          id: string;
          user_id: string;
          full_name: string;
          email: string;
          phone: string | null;
          current_employer: string;
          job_title: string;
          years_of_experience: number;
          linkedin_url: string | null;
          bio: string | null;
          domains: string[];
          requested_services: ServiceCode[];
          work_email: string | null;
          work_email_verified: boolean;
          work_proof_file_name: string | null;
          work_proof_file_url: string | null;
          id_document_type: string | null;
          id_document_masked: string | null;
          weekly_availability_hours: number;
          status: VerificationStatus;
          rejection_reason: string | null;
          reviewed_by: string | null;
          reviewed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          full_name: string;
          email: string;
          phone?: string | null;
          current_employer: string;
          job_title: string;
          years_of_experience: number;
          linkedin_url?: string | null;
          bio?: string | null;
          domains?: string[];
          requested_services?: ServiceCode[];
          work_email?: string | null;
          work_email_verified?: boolean;
          work_proof_file_name?: string | null;
          work_proof_file_url?: string | null;
          id_document_type?: string | null;
          id_document_masked?: string | null;
          weekly_availability_hours?: number;
          status?: VerificationStatus;
          rejection_reason?: string | null;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          full_name?: string;
          email?: string;
          phone?: string | null;
          current_employer?: string;
          job_title?: string;
          years_of_experience?: number;
          linkedin_url?: string | null;
          bio?: string | null;
          domains?: string[];
          requested_services?: ServiceCode[];
          work_email?: string | null;
          work_email_verified?: boolean;
          work_proof_file_name?: string | null;
          work_proof_file_url?: string | null;
          id_document_type?: string | null;
          id_document_masked?: string | null;
          weekly_availability_hours?: number;
          status?: VerificationStatus;
          rejection_reason?: string | null;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      mentor_service_approvals: {
        Row: {
          id: string;
          mentor_id: string;
          service_code: ServiceCode;
          status: VerificationStatus;
          rejection_reason: string | null;
          approved_by: string | null;
          approved_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          mentor_id: string;
          service_code: ServiceCode;
          status?: VerificationStatus;
          rejection_reason?: string | null;
          approved_by?: string | null;
          approved_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          mentor_id?: string;
          service_code?: ServiceCode;
          status?: VerificationStatus;
          rejection_reason?: string | null;
          approved_by?: string | null;
          approved_at?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      mentor_availability_slots: {
        Row: {
          id: string;
          mentor_id: string;
          day_of_week: number;
          start_time: string;
          end_time: string;
          timezone: string;
          is_active: boolean;
          buffer_minutes: number;
          min_notice_hours: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          mentor_id: string;
          day_of_week: number;
          start_time: string;
          end_time: string;
          timezone?: string;
          is_active?: boolean;
          buffer_minutes?: number;
          min_notice_hours?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          mentor_id?: string;
          day_of_week?: number;
          start_time?: string;
          end_time?: string;
          timezone?: string;
          is_active?: boolean;
          buffer_minutes?: number;
          min_notice_hours?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      log_identity_evidence_access: {
        Args: {
          p_target_id: string;
          p_evidence_type: string;
          p_reason_code?: string;
        };
        Returns: string;
      };
    };
    Enums: {
      user_role: UserRole;
      candidate_segment: CandidateSegment;
      verification_status: VerificationStatus;
      service_code: ServiceCode;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
