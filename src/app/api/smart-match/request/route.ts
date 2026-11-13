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
        { error: "Authentication required to request Smart Match." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      serviceCode,
      amountPaise,
      preferredWindows,
      targetRole,
      preSessionNotes,
      resumeUrl,
    } = body;

    if (!serviceCode || !amountPaise) {
      return NextResponse.json(
        { error: "Missing required parameters: serviceCode and amountPaise." },
        { status: 400 }
      );
    }

    // Call stored procedure to create request and dispatch Wave 1 (PRD §10.3)
    const { data: result, error: rpcError } = await supabase.rpc(
      "create_smart_match_request",
      {
        p_student_id: user.id,
        p_service_code: serviceCode,
        p_amount_paise: Number(amountPaise),
        p_preferred_windows: preferredWindows || [],
        p_target_role: targetRole || null,
        p_pre_session_notes: preSessionNotes || null,
        p_resume_url: resumeUrl || null,
      }
    );

    if (rpcError) {
      return NextResponse.json(
        { error: rpcError.message },
        { status: 500 }
      );
    }

    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create Smart Match request.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
