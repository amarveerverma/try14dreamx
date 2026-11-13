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
    } = await supabase.auth.getUser();

    const body = await req.json();
    const { serviceCode, isBundle = false, bundleServiceCodes = [] } = body;

    // Call stored procedure calculate_service_checkout_price
    // Enforces PRD §7.3: Single better eligible discount, NO discount stacking, integer paise
    const { data: pricing, error: rpcError } = await supabase.rpc(
      "calculate_service_checkout_price",
      {
        p_student_id: user?.id || "00000000-0000-0000-0000-000000000000",
        p_service_code: (serviceCode as ServiceCode) || null,
        p_is_bundle: Boolean(isBundle),
        p_bundle_service_codes: isBundle ? (bundleServiceCodes as ServiceCode[]) : null,
      }
    );

    if (rpcError) {
      return NextResponse.json(
        { error: rpcError.message || "Failed to calculate checkout price." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      pricing,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
