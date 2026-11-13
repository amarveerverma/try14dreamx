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
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { disputeId, substantiated, rulingNotes, customRefundPaise } = body;

    if (!disputeId || typeof substantiated !== "boolean" || !rulingNotes) {
      return NextResponse.json(
        { error: "Missing required parameters: disputeId, substantiated (boolean), rulingNotes." },
        { status: 400 }
      );
    }

    // Invoke Dispute Resolution Stored Procedure (PRD §12.1, §15.2)
    const { data: resolutionResult, error: resolutionError } = await supabase.rpc(
      "resolve_booking_dispute",
      {
        p_dispute_id: disputeId,
        p_admin_id: user.id,
        p_substantiated: substantiated,
        p_ruling_notes: rulingNotes,
        p_custom_refund_paise: customRefundPaise ? Number(customRefundPaise) : null,
      }
    );

    if (resolutionError) {
      return NextResponse.json(
        { error: resolutionError.message },
        { status: 400 }
      );
    }

    return NextResponse.json(resolutionResult);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to resolve dispute.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
