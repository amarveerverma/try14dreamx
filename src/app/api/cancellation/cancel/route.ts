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
        { error: "Authentication required to cancel a booking." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { bookingId, reason } = body;

    if (!bookingId) {
      return NextResponse.json(
        { error: "Missing required bookingId parameter." },
        { status: 400 }
      );
    }

    // Invoke Cancellation Policy Engine (PRD §12.1, §12.2, P11 Exit Criteria 1 & 2)
    const { data: policyResult, error: policyError } = await supabase.rpc(
      "apply_booking_cancellation_policy",
      {
        p_booking_id: bookingId,
        p_cancelling_user_id: user.id,
        p_reason: reason || null,
      }
    );

    if (policyError) {
      return NextResponse.json(
        { error: policyError.message },
        { status: 400 }
      );
    }

    return NextResponse.json(policyResult);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to cancel booking.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
