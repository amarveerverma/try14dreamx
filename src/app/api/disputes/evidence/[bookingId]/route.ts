import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "@/lib/supabase/types";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  try {
    const { bookingId } = await params;
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
        { error: "Authentication required to view dispute evidence." },
        { status: 401 }
      );
    }

    if (!bookingId) {
      return NextResponse.json(
        { error: "Missing required bookingId parameter." },
        { status: 400 }
      );
    }

    // Retrieve full evidence pack (PRD §12.3: Booking, Payment, Attendance, Report, Feedback)
    const { data: evidence, error: evidenceError } = await supabase.rpc(
      "get_dispute_evidence",
      { p_booking_id: bookingId }
    );

    if (evidenceError) {
      return NextResponse.json(
        { error: evidenceError.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      evidence,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to load dispute evidence.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
