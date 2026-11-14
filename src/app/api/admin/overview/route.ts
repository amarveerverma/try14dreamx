import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
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

    // 1. Verify User Authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized: Administrator authentication required." },
        { status: 401 }
      );
    }

    // 2. Fetch Calling User's Profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("id, role, email, full_name")
      .eq("id", user.id)
      .maybeSingle();

    const isPlatformOwner =
      user.email?.toLowerCase().includes("amarveer") ||
      user.email?.toLowerCase() === "vermaamarveer0@gmail.com";

    const isAdmin = profile?.role === "admin" || isPlatformOwner;

    if (!isAdmin) {
      return NextResponse.json(
        { error: "Forbidden: Super Administrator privileges required." },
        { status: 403 }
      );
    }

    // If platform owner is not marked as admin in DB, auto-promote them
    if (isPlatformOwner && profile?.role !== "admin") {
      await supabase
        .from("profiles")
        .update({ role: "admin" })
        .eq("id", user.id);
    }

    // 3. Fetch Real Live System Metrics
    // A. Users Breakdown
    const { data: allProfiles, error: profError } = await supabase
      .from("profiles")
      .select("id, full_name, email, role, segment, created_at")
      .order("created_at", { ascending: false });

    const totalUsers = allProfiles?.length || 0;
    const studentCount = allProfiles?.filter((p) => p.role === "student").length || 0;
    const mentorCount = allProfiles?.filter((p) => p.role === "mentor").length || 0;
    const adminCount = allProfiles?.filter((p) => p.role === "admin").length || 0;

    // B. Bookings & Escrow Financials
    const { data: allBookings, error: bookError } = await supabase
      .from("bookings")
      .select("id, booking_ref, service_code, amount_paise, status, payment_status, created_at, session_start")
      .order("created_at", { ascending: false });

    const totalBookings = allBookings?.length || 0;
    const confirmedBookings = allBookings?.filter((b) => b.status === "confirmed" || b.status === "in_progress") || [];
    const completedBookings = allBookings?.filter((b) => b.status === "completed") || [];
    const heldBookings = allBookings?.filter((b) => b.status === "held") || [];
    const cancelledBookings = allBookings?.filter((b) => b.status === "cancelled" || b.status === "refunded") || [];

    const totalGmvPaise = (allBookings || []).reduce((acc, b) => acc + (b.amount_paise || 0), 0);
    const heldEscrowPaise = confirmedBookings.reduce((acc, b) => acc + (b.amount_paise || 0), 0);
    const settledPayoutsPaise = completedBookings.reduce((acc, b) => acc + (b.amount_paise || 0), 0);
    const platformRevenuePaise = Math.round(settledPayoutsPaise * 0.2); // 20% DreamX platform margin

    // C. Mentor Verification Applications Queue
    const { data: pendingMentors } = await supabase
      .from("mentor_profiles")
      .select("id, current_employer, job_title, years_of_experience, verification_status, created_at, profile:profiles(full_name, email)")
      .eq("verification_status", "pending")
      .order("created_at", { ascending: false });

    const pendingVerificationsCount = pendingMentors?.length || 0;

    // D. Active Disputes Queue
    let activeDisputesCount = 0;
    try {
      const { data: disputes } = await supabase
        .from("disputes")
        .select("id, status")
        .eq("status", "open");
      activeDisputesCount = disputes?.length || 0;
    } catch {
      activeDisputesCount = 0;
    }

    // E. Live Audit Logs
    const { data: auditLogs } = await supabase
      .from("audit_logs")
      .select("id, action, target_type, target_id, reason_code, created_at, metadata")
      .order("created_at", { ascending: false })
      .limit(10);

    return NextResponse.json({
      success: true,
      currentUser: {
        id: user.id,
        email: user.email,
        name: profile?.full_name || user.email?.split("@")[0],
        role: "admin",
      },
      metrics: {
        users: {
          total: totalUsers,
          students: studentCount,
          mentors: mentorCount,
          admins: adminCount,
        },
        escrow: {
          totalGmvInr: Math.round(totalGmvPaise / 100),
          heldEscrowInr: Math.round(heldEscrowPaise / 100),
          settledPayoutsInr: Math.round(settledPayoutsPaise / 100),
          platformRevenueInr: Math.round(platformRevenuePaise / 100),
        },
        bookings: {
          total: totalBookings,
          confirmed: confirmedBookings.length,
          completed: completedBookings.length,
          held: heldBookings.length,
          cancelled: cancelledBookings.length,
        },
        queues: {
          pendingVerifications: pendingVerificationsCount,
          activeDisputes: activeDisputesCount,
        },
      },
      recentProfiles: (allProfiles || []).slice(0, 8),
      recentBookings: (allBookings || []).slice(0, 6),
      pendingMentors: pendingMentors || [],
      auditLogs: auditLogs || [],
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
