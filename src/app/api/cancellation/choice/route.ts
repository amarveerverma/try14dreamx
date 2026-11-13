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
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { bookingId, choice } = body;

    if (!bookingId || !choice || !["refund", "reschedule_credit"].includes(choice)) {
      return NextResponse.json(
        { error: "Invalid request: bookingId and valid choice ('refund' or 'reschedule_credit') required." },
        { status: 400 }
      );
    }

    // Enforce PRD §12.2 & P11 Exit Criteria 2: Student explicitly chooses
    const { data: choiceResult, error: choiceError } = await supabase.rpc(
      "execute_student_cancellation_choice",
      {
        p_booking_id: bookingId,
        p_student_id: user.id,
        p_choice: choice as "refund" | "reschedule_credit",
      }
    );

    if (choiceError) {
      return NextResponse.json(
        { error: choiceError.message },
        { status: 400 }
      );
    }

    return NextResponse.json(choiceResult);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to record choice.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
