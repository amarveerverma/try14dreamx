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
        { error: "Authentication required to raise a dispute." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { bookingId, reasonCode, complaintText } = body;

    if (!bookingId || !reasonCode || !complaintText) {
      return NextResponse.json(
        { error: "Missing required dispute fields: bookingId, reasonCode, complaintText." },
        { status: 400 }
      );
    }

    // Invoke Dispute Creation Stored Procedure (PRD §12.1, §12.2)
    const { data: disputeResult, error: disputeError } = await supabase.rpc(
      "raise_booking_dispute",
      {
        p_booking_id: bookingId,
        p_student_id: user.id,
        p_reason_code: reasonCode,
        p_complaint_text: complaintText,
      }
    );

    if (disputeError) {
      return NextResponse.json(
        { error: disputeError.message },
        { status: 400 }
      );
    }

    return NextResponse.json(disputeResult);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to submit dispute.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
