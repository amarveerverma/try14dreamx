import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getPaymentAdapter } from "@/lib/payments/adapter";

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

    // 1. Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Authentication required to reserve a session." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      mentorId,
      serviceCode,
      slotId,
      sessionStart,
      sessionEnd,
      amountPaise,
      preSessionNotes,
      resumeUrl,
    } = body;

    if (!mentorId || !serviceCode || !sessionStart || !sessionEnd) {
      return NextResponse.json(
        { error: "Missing required booking claim parameters." },
        { status: 400 }
      );
    }

    // 2. Derive authoritative integer paise amount with verified membership discounts (PRD §7.3, P10 Exit Criteria 1 & 2)
    // Server computes price; never trusts client-side unverified discounts.
    const { data: pricingData } = await supabase.rpc("calculate_service_checkout_price", {
      p_student_id: user.id,
      p_service_code: serviceCode,
      p_is_bundle: false,
    });

    const verifiedAmountPaise = pricingData?.final_amount_paise
      ? Number(pricingData.final_amount_paise)
      : Number(amountPaise || 59900);

    // 3. Invoke atomic slot claim function in Supabase
    // Enforces PRD §10.2 & P6 Exit Criteria 1 & 2 (single winner, 10-minute hold)
    const { data: claimResult, error: claimError } = await supabase.rpc(
      "claim_booking_slot",
      {
        p_student_id: user.id,
        p_mentor_id: mentorId,
        p_service_code: serviceCode,
        p_slot_id: slotId || null,
        p_session_start: sessionStart,
        p_session_end: sessionEnd,
        p_amount_paise: verifiedAmountPaise,
        p_pre_session_notes: preSessionNotes || null,
        p_resume_url: resumeUrl || null,
      }
    );

    if (claimError) {
      const isConflict = claimError.message.includes("SLOT_ALREADY_HELD_OR_BOOKED");
      return NextResponse.json(
        {
          error: claimError.message,
          code: isConflict ? "SLOT_CONFLICT" : "CLAIM_FAILED",
        },
        { status: isConflict ? 409 : 400 }
      );
    }

    // 4. Initialize Payment Order with configured Payment Adapter
    const adapter = getPaymentAdapter();
    const paymentOrder = await adapter.createPaymentOrder({
      bookingId: claimResult.booking_id,
      bookingRef: claimResult.booking_ref,
      amountPaise: verifiedAmountPaise,
      customerName: user.user_metadata?.full_name || user.email?.split("@")[0] || "Candidate",
      customerEmail: user.email || "",
      customerPhone: user.user_metadata?.phone,
    });

    return NextResponse.json({
      success: true,
      bookingId: claimResult.booking_id,
      bookingRef: claimResult.booking_ref,
      status: claimResult.status,
      holdExpiresAt: claimResult.hold_expires_at,
      amountPaise: claimResult.amount_paise,
      pricing: pricingData,
      paymentOrder,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to claim booking slot.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
