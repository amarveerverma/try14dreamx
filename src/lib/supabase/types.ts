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
export type BookingStatus = 'draft' | 'held' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'refunded';
export type PaymentStatus = 'unpaid' | 'authorized' | 'captured' | 'refunded' | 'failed';
export type RefundStatus = 'initiated' | 'processing' | 'completed' | 'failed';
export type SettlementStatus = 'accrued' | 'in_escrow' | 'eligible_for_payout' | 'processing' | 'settled' | 'on_hold' | 'forfeited';
export type SmartMatchStatus = 'pending' | 'wave_1' | 'wave_2' | 'matched' | 'timeout_fallback' | 'cancelled' | 'refunded';
export type DispatchOfferStatus = 'dispatched' | 'accepted' | 'declined' | 'missed' | 'expired';
export type AttendanceStatus = 'joined' | 'completed' | 'no_show' | 'dropped_early';
export type MembershipPlan = 'free' | 'pro' | 'elite';
export type BillingCycle = 'monthly' | 'yearly';
export type SubscriptionStatus = 'active' | 'past_due' | 'cancelled' | 'expired';
export type BundleStatus = 'active' | 'partially_redeemed' | 'fully_redeemed' | 'expired' | 'cancelled';

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
      bookings: {
        Row: {
          id: string;
          booking_ref: string;
          student_id: string;
          mentor_id: string;
          service_code: ServiceCode;
          slot_id: string | null;
          session_start: string;
          session_end: string;
          duration_minutes: number;
          amount_paise: number;
          status: BookingStatus;
          payment_status: PaymentStatus;
          payment_reference: string | null;
          hold_expires_at: string | null;
          pre_session_notes: string | null;
          candidate_resume_url: string | null;
          meeting_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          booking_ref: string;
          student_id: string;
          mentor_id: string;
          service_code: ServiceCode;
          slot_id?: string | null;
          session_start: string;
          session_end: string;
          duration_minutes?: number;
          amount_paise: number;
          status?: BookingStatus;
          payment_status?: PaymentStatus;
          payment_reference?: string | null;
          hold_expires_at?: string | null;
          pre_session_notes?: string | null;
          candidate_resume_url?: string | null;
          meeting_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          booking_ref?: string;
          student_id?: string;
          mentor_id?: string;
          service_code?: ServiceCode;
          slot_id?: string | null;
          session_start?: string;
          session_end?: string;
          duration_minutes?: number;
          amount_paise?: number;
          status?: BookingStatus;
          payment_status?: PaymentStatus;
          payment_reference?: string | null;
          hold_expires_at?: string | null;
          pre_session_notes?: string | null;
          candidate_resume_url?: string | null;
          meeting_url?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      payment_transactions: {
        Row: {
          id: string;
          booking_id: string;
          provider: string;
          provider_order_id: string;
          provider_payment_id: string | null;
          idempotency_key: string;
          amount_paise: number;
          currency: string;
          status: string;
          webhook_signature: string | null;
          raw_payload: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          booking_id: string;
          provider: string;
          provider_order_id: string;
          provider_payment_id?: string | null;
          idempotency_key: string;
          amount_paise: number;
          currency?: string;
          status?: string;
          webhook_signature?: string | null;
          raw_payload?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          booking_id?: string;
          provider?: string;
          provider_order_id?: string;
          provider_payment_id?: string | null;
          idempotency_key?: string;
          amount_paise?: number;
          currency?: string;
          status?: string;
          webhook_signature?: string | null;
          raw_payload?: Json | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      refunds: {
        Row: {
          id: string;
          booking_id: string;
          payment_transaction_id: string | null;
          amount_paise: number;
          reason: string;
          status: RefundStatus;
          provider_refund_id: string | null;
          refund_arn: string | null;
          idempotency_key: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          booking_id: string;
          payment_transaction_id?: string | null;
          amount_paise: number;
          reason: string;
          status?: RefundStatus;
          provider_refund_id?: string | null;
          refund_arn?: string | null;
          idempotency_key: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          booking_id?: string;
          payment_transaction_id?: string | null;
          amount_paise?: number;
          reason?: string;
          status?: RefundStatus;
          provider_refund_id?: string | null;
          refund_arn?: string | null;
          idempotency_key?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      mentor_settlements: {
        Row: {
          id: string;
          mentor_id: string;
          booking_id: string;
          gross_amount_paise: number;
          platform_fee_paise: number;
          tds_deduction_paise: number;
          net_payout_paise: number;
          payout_status: SettlementStatus;
          payout_batch_id: string | null;
          payout_utr: string | null;
          settled_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          mentor_id: string;
          booking_id: string;
          gross_amount_paise: number;
          platform_fee_paise?: number;
          tds_deduction_paise?: number;
          net_payout_paise: number;
          payout_status?: SettlementStatus;
          payout_batch_id?: string | null;
          payout_utr?: string | null;
          settled_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          mentor_id?: string;
          booking_id?: string;
          gross_amount_paise?: number;
          platform_fee_paise?: number;
          tds_deduction_paise?: number;
          net_payout_paise?: number;
          payout_status?: SettlementStatus;
          payout_batch_id?: string | null;
          payout_utr?: string | null;
          settled_at?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      smart_match_requests: {
        Row: {
          id: string;
          request_ref: string;
          student_id: string;
          service_code: ServiceCode;
          target_role: string | null;
          preferred_windows: Json;
          pre_session_notes: string | null;
          resume_url: string | null;
          amount_paise: number;
          status: SmartMatchStatus;
          current_wave: number;
          wave_1_dispatched_at: string;
          wave_2_dispatched_at: string | null;
          timeout_at: string;
          matched_mentor_id: string | null;
          matched_booking_id: string | null;
          match_reasons: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          request_ref: string;
          student_id: string;
          service_code: ServiceCode;
          target_role?: string | null;
          preferred_windows?: Json;
          pre_session_notes?: string | null;
          resume_url?: string | null;
          amount_paise: number;
          status?: SmartMatchStatus;
          current_wave?: number;
          wave_1_dispatched_at?: string;
          wave_2_dispatched_at?: string | null;
          timeout_at?: string;
          matched_mentor_id?: string | null;
          matched_booking_id?: string | null;
          match_reasons?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          request_ref?: string;
          student_id?: string;
          service_code?: ServiceCode;
          target_role?: string | null;
          preferred_windows?: Json;
          pre_session_notes?: string | null;
          resume_url?: string | null;
          amount_paise?: number;
          status?: SmartMatchStatus;
          current_wave?: number;
          wave_1_dispatched_at?: string;
          wave_2_dispatched_at?: string | null;
          timeout_at?: string;
          matched_mentor_id?: string | null;
          matched_booking_id?: string | null;
          match_reasons?: Json | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      smart_match_dispatches: {
        Row: {
          id: string;
          request_id: string;
          mentor_id: string;
          wave: number;
          match_score: number;
          status: DispatchOfferStatus;
          responded_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          request_id: string;
          mentor_id: string;
          wave: number;
          match_score?: number;
          status?: DispatchOfferStatus;
          responded_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          request_id?: string;
          mentor_id?: string;
          wave?: number;
          match_score?: number;
          status?: DispatchOfferStatus;
          responded_at?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      session_attendance: {
        Row: {
          id: string;
          booking_id: string;
          user_id: string;
          role: UserRole;
          joined_at: string;
          left_at: string | null;
          duration_seconds: number;
          status: AttendanceStatus;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          booking_id: string;
          user_id: string;
          role: UserRole;
          joined_at?: string;
          left_at?: string | null;
          duration_seconds?: number;
          status?: AttendanceStatus;
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          booking_id?: string;
          user_id?: string;
          role?: UserRole;
          joined_at?: string;
          left_at?: string | null;
          duration_seconds?: number;
          status?: AttendanceStatus;
          metadata?: Json;
          created_at?: string;
        };
        Relationships: [];
      };
      session_reports: {
        Row: {
          id: string;
          booking_id: string;
          mentor_id: string;
          student_id: string;
          service_code: ServiceCode;
          version: number;
          is_latest: boolean;
          rubric_scores: Json;
          summary_notes: string;
          strengths: string[];
          growth_areas: string[];
          action_items: Json;
          deliverable_pdf_url: string | null;
          deliverable_sha256: string | null;
          sla_deadline_at: string;
          submitted_at: string;
          is_late: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          booking_id: string;
          mentor_id: string;
          student_id: string;
          service_code: ServiceCode;
          version?: number;
          is_latest?: boolean;
          rubric_scores?: Json;
          summary_notes: string;
          strengths?: string[];
          growth_areas?: string[];
          action_items?: Json;
          deliverable_pdf_url?: string | null;
          deliverable_sha256?: string | null;
          sla_deadline_at: string;
          submitted_at?: string;
          is_late?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          booking_id?: string;
          mentor_id?: string;
          student_id?: string;
          service_code?: ServiceCode;
          version?: number;
          is_latest?: boolean;
          rubric_scores?: Json;
          summary_notes?: string;
          strengths?: string[];
          growth_areas?: string[];
          action_items?: Json;
          deliverable_pdf_url?: string | null;
          deliverable_sha256?: string | null;
          sla_deadline_at?: string;
          submitted_at?: string;
          is_late?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      session_feedback: {
        Row: {
          id: string;
          booking_id: string;
          student_id: string;
          mentor_id: string;
          rating: number;
          feedback_text: string | null;
          recommend_to_peers: boolean;
          is_self_reported: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          booking_id: string;
          student_id: string;
          mentor_id: string;
          rating: number;
          feedback_text?: string | null;
          recommend_to_peers?: boolean;
          is_self_reported?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          booking_id?: string;
          student_id?: string;
          mentor_id?: string;
          rating?: number;
          feedback_text?: string | null;
          recommend_to_peers?: boolean;
          is_self_reported?: boolean;
        };
        Relationships: [];
      };
      user_subscriptions: {
        Row: {
          id: string;
          user_id: string;
          plan: MembershipPlan;
          billing_cycle: BillingCycle;
          status: SubscriptionStatus;
          amount_paise: number;
          current_period_start: string;
          current_period_end: string;
          cancel_at_period_end: boolean;
          cancelled_at: string | null;
          provider_subscription_id: string | null;
          payment_reference: string | null;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          plan?: MembershipPlan;
          billing_cycle?: BillingCycle;
          status?: SubscriptionStatus;
          amount_paise?: number;
          current_period_start?: string;
          current_period_end: string;
          cancel_at_period_end?: boolean;
          cancelled_at?: string | null;
          provider_subscription_id?: string | null;
          payment_reference?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          plan?: MembershipPlan;
          billing_cycle?: BillingCycle;
          status?: SubscriptionStatus;
          amount_paise?: number;
          current_period_start?: string;
          current_period_end?: string;
          cancel_at_period_end?: boolean;
          cancelled_at?: string | null;
          provider_subscription_id?: string | null;
          payment_reference?: string | null;
          metadata?: Json;
          updated_at?: string;
        };
        Relationships: [];
      };
      service_bundles: {
        Row: {
          id: string;
          student_id: string;
          bundle_ref: string;
          total_services: number;
          redeemed_services: number;
          status: BundleStatus;
          original_amount_paise: number;
          discount_paise: number;
          paid_amount_paise: number;
          discount_percentage: number;
          expires_at: string;
          payment_reference: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          bundle_ref: string;
          total_services?: number;
          redeemed_services?: number;
          status?: BundleStatus;
          original_amount_paise: number;
          discount_paise: number;
          paid_amount_paise: number;
          discount_percentage: number;
          expires_at: string;
          payment_reference?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          bundle_ref?: string;
          total_services?: number;
          redeemed_services?: number;
          status?: BundleStatus;
          original_amount_paise?: number;
          discount_paise?: number;
          paid_amount_paise?: number;
          discount_percentage?: number;
          expires_at?: string;
          payment_reference?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      bundle_items: {
        Row: {
          id: string;
          bundle_id: string;
          service_code: ServiceCode;
          booking_id: string | null;
          is_redeemed: boolean;
          redeemed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          bundle_id: string;
          service_code: ServiceCode;
          booking_id?: string | null;
          is_redeemed?: boolean;
          redeemed_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          bundle_id?: string;
          service_code?: ServiceCode;
          booking_id?: string | null;
          is_redeemed?: boolean;
          redeemed_at?: string | null;
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
      claim_booking_slot: {
        Args: {
          p_student_id: string;
          p_mentor_id: string;
          p_service_code: ServiceCode;
          p_slot_id: string | null;
          p_session_start: string;
          p_session_end: string;
          p_amount_paise: number;
          p_pre_session_notes?: string | null;
          p_resume_url?: string | null;
        };
        Returns: {
          success: boolean;
          booking_id: string;
          booking_ref: string;
          status: BookingStatus;
          hold_expires_at: string;
          amount_paise: number;
        };
      };
      confirm_booking_payment: {
        Args: {
          p_booking_id: string;
          p_payment_reference: string;
          p_meeting_url?: string | null;
        };
        Returns: {
          success: boolean;
          booking_id: string;
          booking_ref: string;
          status: BookingStatus;
          payment_status: PaymentStatus;
        };
      };
      process_payment_webhook: {
        Args: {
          p_idempotency_key: string;
          p_booking_id: string;
          p_provider: string;
          p_provider_order_id: string;
          p_provider_payment_id: string;
          p_amount_paise: number;
          p_status: string;
          p_signature: string;
          p_raw_payload: Json;
        };
        Returns: {
          status: string;
          transaction_id: string;
          booking_id?: string;
          payment_status?: string;
          message?: string;
        };
      };
      initiate_booking_refund: {
        Args: {
          p_booking_id: string;
          p_amount_paise: number;
          p_reason: string;
          p_idempotency_key: string;
        };
        Returns: {
          success: boolean;
          refund_id: string;
          status: string;
        };
      };
      reconcile_daily_payments: {
        Args: {
          p_date: string;
        };
        Returns: {
          total_transactions: number;
          total_gross_paise: number;
          total_platform_fees_paise: number;
          total_mentor_net_paise: number;
          total_refunds_count: number;
          total_refunded_paise: number;
        }[];
      };
      create_smart_match_request: {
        Args: {
          p_student_id: string;
          p_service_code: ServiceCode;
          p_amount_paise: number;
          p_preferred_windows?: Json;
          p_target_role?: string | null;
          p_pre_session_notes?: string | null;
          p_resume_url?: string | null;
        };
        Returns: {
          success: boolean;
          request_id: string;
          request_ref: string;
          wave: number;
          dispatched_mentors: number;
          timeout_at: string;
        };
      };
      accept_smart_match_offer: {
        Args: {
          p_request_id: string;
          p_mentor_id: string;
          p_session_start?: string | null;
          p_session_end?: string | null;
        };
        Returns: {
          success: boolean;
          booking_id: string;
          booking_ref: string;
          mentor_id: string;
          status: string;
        };
      };
      escalate_smart_match_wave: {
        Args: {
          p_request_id: string;
        };
        Returns: {
          success: boolean;
          request_id: string;
          new_dispatches_count: number;
          status: string;
        };
      };
      resolve_smart_match_timeout: {
        Args: {
          p_request_id: string;
          p_student_id: string;
          p_choice: string;
        };
        Returns: {
          success: boolean;
          choice: string;
          status: string;
          amount_paise?: number;
          redirect_url?: string;
        };
      };
      submit_session_report: {
        Args: {
          p_booking_id: string;
          p_mentor_id: string;
          p_rubric_scores: Json;
          p_summary_notes: string;
          p_strengths?: string[];
          p_growth_areas?: string[];
          p_action_items?: Json;
          p_deliverable_pdf_url?: string | null;
          p_deliverable_sha256?: string | null;
        };
        Returns: {
          success: boolean;
          report_id: string;
          booking_id: string;
          version: number;
          is_late: boolean;
          sha256: string;
          escrow_unlocked: boolean;
        };
      };
      get_late_reports_operations_queue: {
        Args: Record<string, never>;
        Returns: {
          booking_id: string;
          booking_ref: string;
          service_code: ServiceCode;
          mentor_id: string;
          mentor_name: string;
          student_id: string;
          student_name: string;
          session_end: string;
          sla_deadline: string;
          hours_overdue: number;
          report_status: string;
        }[];
      };
      submit_session_feedback: {
        Args: {
          p_booking_id: string;
          p_student_id: string;
          p_rating: number;
          p_feedback_text?: string | null;
          p_recommend_to_peers?: boolean;
        };
        Returns: {
          success: boolean;
          feedback_id: string;
          mentor_rating_updated: number;
        };
      };
      get_user_membership: {
        Args: {
          p_user_id: string;
        };
        Returns: {
          plan: MembershipPlan;
          discount_pct: number;
          is_active: boolean;
          renewal_date?: string | null;
          current_period_end?: string | null;
          cancel_at_period_end?: boolean;
          billing_cycle?: BillingCycle;
          amount_paise?: number;
        };
      };
      calculate_service_checkout_price: {
        Args: {
          p_student_id: string;
          p_service_code?: ServiceCode | null;
          p_is_bundle?: boolean;
          p_bundle_service_codes?: ServiceCode[] | null;
        };
        Returns: {
          student_id: string;
          is_bundle: boolean;
          membership_plan: string;
          original_amount_paise: number;
          discount_percentage: number;
          discount_type: string;
          discount_paise: number;
          final_amount_paise: number;
          mentor_payout_paise: number;
          platform_fee_paise: number;
          dreamx_discount_subsidy_paise: number;
        };
      };
      subscribe_membership_plan: {
        Args: {
          p_user_id: string;
          p_plan: MembershipPlan;
          p_billing_cycle?: BillingCycle;
          p_payment_reference?: string | null;
        };
        Returns: {
          success: boolean;
          subscription_id?: string;
          plan: string;
          billing_cycle?: string;
          amount_paise?: number;
          current_period_start?: string;
          current_period_end?: string;
          message?: string;
        };
      };
      cancel_membership_subscription: {
        Args: {
          p_user_id: string;
        };
        Returns: {
          success: boolean;
          subscription_id: string;
          plan: string;
          current_period_end: string;
          benefits_retain_until: string;
          message: string;
        };
      };
      purchase_service_bundle: {
        Args: {
          p_student_id: string;
          p_service_codes: ServiceCode[];
          p_payment_reference?: string | null;
        };
        Returns: {
          success: boolean;
          bundle_id: string;
          bundle_ref: string;
          paid_amount_paise: number;
          discount_percentage: number;
          expires_at: string;
        };
      };
      redeem_bundle_service: {
        Args: {
          p_bundle_id: string;
          p_service_code: ServiceCode;
          p_booking_id: string;
        };
        Returns: {
          success: boolean;
          bundle_id: string;
          redeemed_service: ServiceCode;
          booking_id: string;
          remaining_credits: number;
        };
      };
    };
    Enums: {
      user_role: UserRole;
      candidate_segment: CandidateSegment;
      verification_status: VerificationStatus;
      service_code: ServiceCode;
      booking_status: BookingStatus;
      payment_status: PaymentStatus;
      refund_status: RefundStatus;
      settlement_status: SettlementStatus;
      smart_match_status: SmartMatchStatus;
      dispatch_offer_status: DispatchOfferStatus;
      attendance_status: AttendanceStatus;
      membership_plan: MembershipPlan;
      billing_cycle: BillingCycle;
      subscription_status: SubscriptionStatus;
      bundle_status: BundleStatus;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
