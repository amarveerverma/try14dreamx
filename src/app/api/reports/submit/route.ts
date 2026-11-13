import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "@/lib/supabase/types";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // Server component context
            }
          },
        },
      }
    );

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Authentication required to submit session reports." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      bookingId,
      rubricScores,
      summaryNotes,
      strengths = [],
      growthAreas = [],
      actionItems = [],
      deliverablePdfUrl = null,
      deliverableSha256 = null,
    } = body;

    if (!bookingId || !rubricScores || !summaryNotes) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: bookingId, rubricScores, and summaryNotes are required.",
        },
        { status: 400 }
      );
    }

    // Call submit_session_report stored procedure
    // Enforces P9 Exit Criteria 1 & 3:
    // - Report uploaded within 48h unlocks mentor settlement payout from in_escrow -> eligible_for_payout
    // - Report revisions keep earlier versions (version++ and previous version is_latest=false)
    const { data: result, error: rpcError } = await supabase.rpc(
      "submit_session_report",
      {
        p_booking_id: bookingId,
        p_mentor_id: user.id,
        p_rubric_scores: rubricScores,
        p_summary_notes: summaryNotes,
        p_strengths: strengths,
        p_growth_areas: growthAreas,
        p_action_items: actionItems,
        p_deliverable_pdf_url: deliverablePdfUrl,
        p_deliverable_sha256: deliverableSha256,
      }
    );

    if (rpcError) {
      return NextResponse.json(
        { error: rpcError.message || "Failed to submit session report." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      report: result,
      message: (result as { escrow_unlocked?: boolean })?.escrow_unlocked
        ? "Report submitted successfully! Mentor settlement payout has been unlocked."
        : "Report submitted. Note: Submitted past the 48-hour SLA deadline.",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
