import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "@/lib/supabase/types";

export async function GET() {
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
      return NextResponse.json({
        isAuthenticated: false,
        membership: {
          plan: "free",
          discount_pct: 0,
          is_active: false,
          cancel_at_period_end: false,
        },
        bundles: [],
      });
    }

    // 1. Get verified membership from database (PRD §7.2: "Derived from verified events, never from browser")
    const { data: membershipData, error: memberErr } = await supabase.rpc(
      "get_user_membership",
      { p_user_id: user.id }
    );

    if (memberErr) {
      return NextResponse.json(
        { error: memberErr.message || "Failed to load membership status." },
        { status: 400 }
      );
    }

    // 2. Get active service bundles
    const { data: bundlesData, error: bundlesErr } = await supabase
      .from("service_bundles")
      .select(`
        id,
        bundle_ref,
        total_services,
        redeemed_services,
        status,
        original_amount_paise,
        discount_paise,
        paid_amount_paise,
        discount_percentage,
        expires_at,
        created_at,
        bundle_items (
          id,
          service_code,
          is_redeemed,
          redeemed_at,
          booking_id
        )
      `)
      .eq("student_id", user.id)
      .order("created_at", { ascending: false });

    if (bundlesErr) {
      return NextResponse.json(
        { error: bundlesErr.message || "Failed to load bundles." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      isAuthenticated: true,
      membership: membershipData,
      bundles: bundlesData || [],
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
