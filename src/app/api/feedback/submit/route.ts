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
        { error: "Authentication required to submit feedback." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      bookingId,
      rating,
      feedbackText = null,
      recommendToPeers = true,
    } = body;

    if (!bookingId || rating === undefined || rating === null) {
      return NextResponse.json(
        { error: "Missing required fields: bookingId and rating (1-5)." },
        { status: 400 }
      );
    }

    const numRating = Number(rating);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      return NextResponse.json(
        { error: "Rating must be a numeric score between 1.0 and 5.0." },
        { status: 400 }
      );
    }

    // Call submit_session_feedback stored procedure
    // Enforces P9 Exit Criteria 4: Feedback isolation and dynamic mentor rating calculation
    const { data: result, error: rpcError } = await supabase.rpc(
      "submit_session_feedback",
      {
        p_booking_id: bookingId,
        p_student_id: user.id,
        p_rating: numRating,
        p_feedback_text: feedbackText,
        p_recommend_to_peers: recommendToPeers,
      }
    );

    if (rpcError) {
      return NextResponse.json(
        { error: rpcError.message || "Failed to submit session feedback." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      feedback: result,
      message: "Thank you! Your feedback has been recorded securely.",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
