import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

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
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Authentication required to accept Smart Match offers." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { requestId, sessionStart, sessionEnd } = body;

    if (!requestId) {
      return NextResponse.json(
        { error: "Missing required parameter: requestId." },
        { status: 400 }
      );
    }

    // Call atomic acceptance stored procedure
    // Enforces P8 Exit Criteria 1: First mentor wins, second mentor receives OFFER_ALREADY_ACCEPTED
    const { data: result, error: rpcError } = await supabase.rpc(
      "accept_smart_match_offer",
      {
        p_request_id: requestId,
        p_mentor_id: user.id,
        p_session_start: sessionStart || null,
        p_session_end: sessionEnd || null,
      }
    );

    if (rpcError) {
      const isAlreadyAccepted = rpcError.message.includes("OFFER_ALREADY_ACCEPTED");
      const isExpired = rpcError.message.includes("OFFER_EXPIRED");
      return NextResponse.json(
        {
          error: rpcError.message,
          code: isAlreadyAccepted
            ? "OFFER_ALREADY_ACCEPTED"
            : isExpired
            ? "OFFER_EXPIRED"
            : "ACCEPT_FAILED",
        },
        { status: isAlreadyAccepted ? 409 : 400 }
      );
    }

    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to accept Smart Match offer.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
