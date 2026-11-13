import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database, ServiceCode } from "@/lib/supabase/types";

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
        { error: "Authentication required to purchase service bundles." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { serviceCodes, paymentReference } = body;

    if (!Array.isArray(serviceCodes) || serviceCodes.length !== 3) {
      return NextResponse.json(
        { error: "A custom bundle must contain exactly 3 eligible services." },
        { status: 400 }
      );
    }

    // Call purchase_service_bundle stored procedure
    // Enforces PRD §7.4: 3-service bundle with single better discount (no stacking!)
    const { data: result, error: rpcError } = await supabase.rpc(
      "purchase_service_bundle",
      {
        p_student_id: user.id,
        p_service_codes: serviceCodes as ServiceCode[],
        p_payment_reference: paymentReference || null,
      }
    );

    if (rpcError) {
      return NextResponse.json(
        { error: rpcError.message || "Failed to purchase bundle." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      bundle: result,
      message: "Custom 3-service bundle purchased successfully! Credits added to your vault.",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
