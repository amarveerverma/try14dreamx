# DreamX — Real Data Integration Audit & Execution Plan

**Audit Timestamp**: 2026-11-19T15:05:00+05:30  
**Target Environment**: Supabase PostgreSQL 17.11 (`obmpcruljkghvanozber`) & Next.js 16.4.5 (Turbopack)  
**Objective**: Remove all mock, dummy, simulated, and hardcoded business data across all screens, replacing them with live authenticated Supabase queries, typed models, and genuine loading, empty, and error states.

---

## 1. Application Routes & Screen Inventory

| Route | View / Component | Current Data Source | Required Real Data Source | Status |
|---|---|---|---|---|
| `/login` | Public Login Gateway (`src/app/login/page.tsx`) | Dual switcher: Candidate / Mentor | Supabase Auth (Admin removed from public pill) | Completed |
| `/services` | Services Catalog (`src/app/services/page.tsx`) | Seed definitions | Supabase `services` table | Completed |
| `/dashboard` (Overview) | `StudentOverviewView.tsx` | Live Supabase hook + Blank Baseline | `readiness_assessments`, `bookings`, `session_reports`, `profiles` | Completed |
| `/dashboard` (Discover) | `StudentDiscoverView.tsx` | Live catalogue + empty state | Real approved `mentor_profiles`, active `services` | Completed |
| `/dashboard` (Services) | `StudentServicesView.tsx` | `SERVICES_CATALOGUE` | Supabase `services` table | Completed |
| `/dashboard` (Bookings) | `StudentBookingsView.tsx` | Live Supabase hook + empty state | Supabase `bookings` table | Completed |
| `/dashboard` (Readiness) | `StudentReadinessView.tsx` | Live Supabase + unassessed baseline | Supabase `readiness_assessments` table | Completed |
| `/dashboard` (Journey) | `StudentJourneyView.tsx` | Live Supabase + roadmap baseline | Supabase `career_journey_events` table | Completed |
| `/dashboard` (Reports) | `StudentReportsView.tsx` | Live Supabase + empty state | Supabase `session_reports` table | Completed |
| `/dashboard` (Membership) | `StudentMembershipView.tsx` | Live Supabase hook + Free tier default | Supabase `user_subscriptions` | Completed |
| `/dashboard` (Settings) | `StudentSettingsView.tsx` | Live Supabase `profiles` + Password Reset | Supabase `profiles` & `auth.updateUser` | Completed |
| `/mentor` (Overview) | `OverviewView.tsx` | Live Supabase `mentor_profiles` | `mentor_profiles`, `bookings`, `mentor_settlements` | Completed |
| `/mentor` (Bookings & Sessions) | `BookingsView.tsx`, `SessionConsoleView.tsx` | Live Supabase `bookings` | Supabase `bookings` table for mentor | Completed |
| `/mentor` (Reports) | `ReportsView.tsx` | Live Supabase `session_reports` | Supabase `session_reports` table for mentor | Completed |
| `/mentor` (Earnings) | `EarningsView.tsx` | Live Supabase `mentor_settlements` + empty state | Supabase `mentor_settlements` table | Completed |
| `/mentor` (Availability) | `AvailabilityView.tsx` | Live Supabase `mentor_availability_slots` + live upsert | Supabase `mentor_availability_slots` table | Completed |
| `/mentor` (Dispatch) | `DispatchView.tsx` | Live Supabase `smart_match_dispatches` | Supabase `smart_match_dispatches` table | Completed |
| `/mentor` (Verification) | `VerificationView.tsx` | Dual-track work email OTP & DigiLocker | Supabase `mentor_applications` & `mentor_profiles` | Completed |
| `/mentor` (Settings) | `SettingsView.tsx` | Live Supabase `mentor_profiles` + Password Reset | Supabase `mentor_profiles` & `auth.updateUser` | Completed |
| `/admin` (Overview) | `src/app/admin/page.tsx` | Live `/api/admin/overview` + real events | `/api/admin/overview` (Real Supabase aggregate) | Completed |
| `/admin/verification` | `src/app/admin/verification/page.tsx` | Live `mentor_applications` + clean empty state | Supabase `mentor_applications` & `mentor_profiles` | Completed |
| `/admin/disputes` | `src/app/admin/disputes/page.tsx` | Live `disputes` + clean empty state | Supabase `disputes` join `bookings` | Completed |

---

## 2. Mock Data Files & Fabricated Constants Identified

The following mock and seed definitions must be eliminated or decoupled from production runtime:
1. `src/data/mentors.ts` (Contains 4 hardcoded fictitious mentors: Rajesh Kannan, Dr. Neha Kapoor, Arjun Mehta, Kavya Subramanian).
2. `src/components/student/types.ts`:
   - `SEED_STUDENT_PROFILE`
   - `SEED_DIMENSIONS` (Arbitrary 3.2 - 3.8 readiness scores)
   - `SEED_READINESS_HISTORY` (Fake past assessment dates)
   - `SEED_STUDENT_BOOKINGS` (Fake bookings BK-2026-0881, etc.)
   - `SEED_STUDENT_REPORTS` (Fake rubric feedback)
   - `SEED_JOURNEY_STAGES` (Fabricated 4-stage completion status)
   - `SEED_VOLUNTARY_OUTCOMES` (Fabricated placement offers)
   - `SEED_AVAILABLE_MENTORS`
   - `SEED_MEMBERSHIP`
   - `SEED_NOTIFICATIONS`
3. `src/components/mentor/types.ts`:
   - `SEED_PROFILE`
   - `SEED_BOOKINGS`
   - `SEED_REPORTS`
   - `SEED_FINANCIAL_LEDGER`
   - `SEED_DISPATCH_OFFERS`
   - `SEED_NOTIFICATIONS`
   - `DEFAULT_WEEKLY_SLOTS`
4. `src/app/admin/verification/page.tsx`:
   - `INITIAL_DOSSIERS`
5. `src/app/admin/disputes/page.tsx`:
   - Hardcoded dispute records and simulated timers.
6. `src/app/admin/page.tsx`:
   - Hardcoded telemetry events list.

---

## 3. Database Schema Mapping Matrix

| Domain | Database Table | Key Columns | Relationships / Joins | Security / RLS Policy |
|---|---|---|---|---|
| **Profiles** | `public.profiles` | `id`, `full_name`, `email`, `role`, `segment`, `target_role`, `target_company_tier`, `experience_years`, `bio`, `avatar_url`, `onboarding_completed` | Primary entity | `auth.uid() = id`, Admins full access |
| **Services** | `public.services` | `id`, `code`, `slug`, `title`, `short_description`, `full_description`, `category`, `duration_minutes`, `list_paise`, `deliverable`, `sla_hours`, `format`, `popular`, `prerequisites`, `rubric_criteria` | Base service catalogue | `anon` and `authenticated` can SELECT; only admins can write |
| **Mentors** | `public.mentor_profiles` | `id`, `current_employer`, `job_title`, `years_of_experience`, `verification_status`, `approved_services`, `bio`, `linkedin_url`, `upi_id`, `sla_compliance_rate`, `rating`, `reviews_count`, `hourly_rate_inr`, `verified_company`, `employment_type` | `id -> profiles.id` | Approved profiles visible to public; mentor manages own profile; admin manages all |
| **Availability** | `public.mentor_availability_slots` | `id`, `mentor_id`, `day_of_week`, `start_time`, `end_time`, `timezone`, `is_active`, `buffer_minutes`, `min_notice_hours` | `mentor_id -> mentor_profiles.id` | Mentor manages own; public can view active slots of approved mentors |
| **Bookings** | `public.bookings` | `id`, `booking_ref`, `student_id`, `mentor_id`, `service_code`, `slot_id`, `session_start`, `session_end`, `duration_minutes`, `amount_paise`, `status`, `payment_status`, `meeting_url`, `candidate_resume_url`, `pre_session_notes` | `student_id -> profiles.id`, `mentor_id -> profiles.id`, `service_code -> services.code` | Student & Mentor view own; Student creates hold; Admin views all |
| **Readiness** | `public.readiness_assessments` | `id`, `user_id`, `overall_score`, `segment`, `rubric_version`, `evidence_coverage`, `dimension_scores`, `assessor_id`, `is_private`, `created_at` | `user_id -> profiles.id` | User views own; User & Admin can insert |
| **Career Journey** | `public.career_journey_events` | `id`, `user_id`, `title`, `description`, `category`, `metadata`, `created_at` | `user_id -> profiles.id` | User views own; User & Admin can insert |
| **Session Reports**| `public.session_reports` | `id`, `booking_id`, `mentor_id`, `student_id`, `service_code`, `rubric_scores`, `summary_notes`, `strengths`, `growth_areas`, `action_items`, `deliverable_pdf_url`, `sla_deadline_at`, `submitted_at`, `is_late` | `booking_id -> bookings.id` | Student & Mentor view own; Mentor submits |
| **Subscriptions**| `public.user_subscriptions` | `id`, `user_id`, `plan`, `billing_cycle`, `status`, `amount_paise`, `current_period_start`, `current_period_end`, `cancel_at_period_end` | `user_id -> profiles.id` | User views own; Admin views all |
| **Bundles** | `public.service_bundles`, `bundle_items` | `id`, `student_id`, `bundle_ref`, `total_services`, `redeemed_services`, `status`, `paid_amount_paise` | `student_id -> profiles.id` | User views own |
| **Settlements** | `public.mentor_settlements` | `id`, `mentor_id`, `booking_id`, `gross_amount_paise`, `platform_fee_paise`, `tds_deduction_paise`, `net_payout_paise`, `payout_status`, `settled_at` | `mentor_id -> profiles.id`, `booking_id -> bookings.id` | Mentor views own; Admin views all |
| **Dispatches** | `public.smart_match_dispatches`, `smart_match_requests` | `id`, `request_id`, `mentor_id`, `wave`, `match_score`, `status`, `responded_at` | `mentor_id -> profiles.id` | Mentor views assigned offers |
| **Disputes** | `public.disputes` | `id`, `dispute_ref`, `booking_id`, `student_id`, `mentor_id`, `reason_code`, `complaint_text`, `status`, `resolution_notes`, `refund_amount_paise` | `booking_id -> bookings.id` | Student, Mentor, Admin view |
| **Audit Logs** | `public.audit_logs` | `id`, `actor_id`, `action`, `target_type`, `target_id`, `reason_code`, `metadata`, `created_at` | `actor_id -> profiles.id` | Admin views all; Authenticated users insert |

---

## 4. Execution Roadmap

1. **Step 1: Student Workspace Live Integration** (`StudentPortalShell.tsx` + 9 views):
   - Replace static initialization with live Supabase queries (`profiles`, `readiness_assessments`, `bookings`, `session_reports`, `career_journey_events`, `user_subscriptions`, `services`, `mentor_profiles`).
   - Implement loading skeleton states, proper zero-record empty states, and error handling.
   - Wire booking creation to real Supabase RPC (`claim_booking_slot` / checkout flow).
2. **Step 2: Mentor Workspace Live Integration** (`src/app/mentor/page.tsx` + 10 views):
   - Replace seed states with live queries (`mentor_profiles`, `bookings`, `session_reports`, `mentor_settlements`, `mentor_availability_slots`, `smart_match_dispatches`).
   - Implement empty states for zero-booking, zero-dispatch, and zero-report conditions.
3. **Step 3: Admin Operations Live Integration** (`src/app/admin/...`):
   - Remove fake event array in `/admin`; render live `audit_logs` and metrics from `/api/admin/overview`.
   - Wire `/admin/verification` to live `mentor_applications` & `mentor_profiles`.
   - Wire `/admin/disputes` to live `disputes` & `bookings`.
4. **Step 4: Public Marketing & Services Roster** (`/services`, `/mentors`, `/page.tsx`):
   - Fetch services dynamically from Supabase `services` table.
   - Query approved mentors from Supabase `mentor_profiles`.
5. **Step 5: Rigorous Verification & Build Auditing**:
   - Verify TypeScript compliance (`next build`).
   - Test empty states with unseeded candidate and mentor accounts.
   - Verify that all fabricated business numbers are removed.
