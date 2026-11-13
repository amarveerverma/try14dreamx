import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database, AttendanceStatus } from "@/lib/supabase/types";

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
        { error: "Authentication required to mark session attendance." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      bookingId,
      status = "joined",
      durationSeconds = 0,
      metadata = {},
    } = body;

    if (!bookingId) {
      return NextResponse.json(
        { error: "Missing required parameter: bookingId." },
        { status: 400 }
      );
    }

    // Verify booking and determine role
    const { data: booking, error: bookingErr } = await supabase
      .from("bookings")
      .select("id, student_id, mentor_id")
      .eq("id", bookingId)
      .single();

    if (bookingErr || !booking) {
      return NextResponse.json({ error: "Booking not found." }, { status: 404 });
    }

    let role: "student" | "mentor" | "admin" = "student";
    if (user.id === booking.mentor_id) {
      role = "mentor";
    } else if (user.id === booking.student_id) {
      role = "student";
    } else {
      // Check admin
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      if (profile?.role === "admin") {
        role = "admin";
      } else {
        return NextResponse.json(
          { error: "Unauthorized: User not associated with this session." },
          { status: 403 }
        );
      }
    }

    const { data: attendance, error: insertErr } = await supabase
      .from("session_attendance")
      .insert({
        booking_id: bookingId,
        user_id: user.id,
        role: role,
        status: status as AttendanceStatus,
        duration_seconds: durationSeconds,
        metadata: metadata,
      })
      .select()
      .single();

    if (insertErr) {
      return NextResponse.json(
        { error: insertErr.message || "Failed to record attendance." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      attendance,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
