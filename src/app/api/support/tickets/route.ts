import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database, TicketPriority } from "@/lib/supabase/types";

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
        { error: "Authentication required to submit a support ticket." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { category, subject, description, priority } = body;

    if (!category || !subject || !description) {
      return NextResponse.json(
        { error: "Missing required fields: category, subject, description." },
        { status: 400 }
      );
    }

    // Enforce PRD §15.1 Support ticket creation with SLA target
    const { data: ticketResult, error: ticketError } = await supabase.rpc(
      "create_support_ticket",
      {
        p_user_id: user.id,
        p_category: category,
        p_subject: subject,
        p_description: description,
        p_priority: (priority as TicketPriority) || "normal",
      }
    );

    if (ticketError) {
      return NextResponse.json(
        { error: ticketError.message },
        { status: 400 }
      );
    }

    return NextResponse.json(ticketResult);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create support ticket.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

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
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    const { data: tickets, error: ticketsErr } = await supabase
      .from("support_tickets")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (ticketsErr) {
      return NextResponse.json(
        { error: ticketsErr.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      tickets: tickets || [],
      supportMetadata: {
        operatingHours: "Monday – Saturday, 9:00 AM – 9:00 PM IST",
        responseSla: "< 4 Hours",
        primaryEmail: "support@dreamx.in",
        emergencyEscalation: "help-desk@dreamx.in",
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to load support tickets.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
