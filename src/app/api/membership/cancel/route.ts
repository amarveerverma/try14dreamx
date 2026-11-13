import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "@/lib/supabase/types";

export async function POST() {
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
        { error: "Authentication required to manage membership." },
        { status: 401 }
      );
    }

    // Call cancel_membership_subscription stored procedure
    // Enforces PRD §7.2: Scheduled cancellation without immediate refund; retains active benefits until current period end
    const { data: result, error: rpcError } = await supabase.rpc(
      "cancel_membership_subscription",
      { p_user_id: user.id }
    );

    if (rpcError) {
      return NextResponse.json(
        { error: rpcError.message || "Failed to cancel subscription." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      result,
      message:
        "Membership cancellation scheduled. Benefits remain active until current period ends.",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
