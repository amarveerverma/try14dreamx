import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database, MembershipPlan, BillingCycle } from "@/lib/supabase/types";

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
        { error: "Authentication required to subscribe to membership." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { plan, billingCycle = "monthly", paymentReference } = body;

    if (!plan || !["free", "pro", "elite"].includes(plan)) {
      return NextResponse.json(
        { error: "Invalid membership plan. Must be 'free', 'pro', or 'elite'." },
        { status: 400 }
      );
    }

    if (!["monthly", "yearly"].includes(billingCycle)) {
      return NextResponse.json(
        { error: "Invalid billing cycle. Must be 'monthly' or 'yearly'." },
        { status: 400 }
      );
    }

    // Call subscribe_membership_plan stored procedure
    // Enforces PRD §7.1 plan pricing and verified status
    const { data: result, error: rpcError } = await supabase.rpc(
      "subscribe_membership_plan",
      {
        p_user_id: user.id,
        p_plan: plan as MembershipPlan,
        p_billing_cycle: billingCycle as BillingCycle,
        p_payment_reference: paymentReference || null,
      }
    );

    if (rpcError) {
      return NextResponse.json(
        { error: rpcError.message || "Failed to update subscription." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      subscription: result,
      message:
        plan === "free"
          ? "Switched to Free Tier."
          : `Subscribed to ${plan.toUpperCase()} (${billingCycle}) successfully!`,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
