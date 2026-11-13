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
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { requestId, choice } = body;

    if (!requestId || !choice || !["refund", "choose_open_slot"].includes(choice)) {
      return NextResponse.json(
        { error: "Invalid parameters. Choice must be 'refund' or 'choose_open_slot'." },
        { status: 400 }
      );
    }

    // Call timeout resolution stored procedure
    // Enforces P8 Exit Criteria 2 & 4 (student choice guaranteed, P7 refund model)
    const { data: result, error: rpcError } = await supabase.rpc(
      "resolve_smart_match_timeout",
      {
        p_request_id: requestId,
        p_student_id: user.id,
        p_choice: choice,
      }
    );

    if (rpcError) {
      return NextResponse.json(
        { error: rpcError.message },
        { status: 400 }
      );
    }

    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to resolve Smart Match timeout.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
