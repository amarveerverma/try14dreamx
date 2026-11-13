import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { sanitizeLogData } from "@/lib/security/pii-sanitizer";

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

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    const adminId = user?.id || "00000000-0000-0000-0000-000000000001";

    const { data: scorecard, error: rpcError } = await supabase.rpc(
      "get_pilot_acceptance_review",
      { p_admin_id: adminId }
    );

    if (rpcError) {
      return NextResponse.json({ error: rpcError.message }, { status: 400 });
    }

    return NextResponse.json(sanitizeLogData(scorecard));
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
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

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const adminId = user?.id || "00000000-0000-0000-0000-000000000001";
    const body = await req.json();

    if (!body?.decision || !["EXPAND", "ADJUST", "PAUSE"].includes(body.decision)) {
      return NextResponse.json(
        { error: "Invalid decision. Must be EXPAND, ADJUST, or PAUSE." },
        { status: 400 }
      );
    }

    const { data: recordRes, error: rpcError } = await supabase.rpc(
      "record_pilot_decision",
      {
        p_admin_id: adminId,
        p_decision: body.decision,
        p_notes: body.notes || "Controlled pilot review sign-off completed by platform administrator.",
      }
    );

    if (rpcError) {
      return NextResponse.json({ error: rpcError.message }, { status: 400 });
    }

    return NextResponse.json(sanitizeLogData(recordRes));
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}
