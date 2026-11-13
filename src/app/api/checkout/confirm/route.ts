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

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Authentication required to confirm booking." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { bookingId, paymentReference, orderId } = body;

    if (!bookingId || !paymentReference) {
      return NextResponse.json(
        { error: "Missing required confirmation parameters: bookingId and paymentReference." },
        { status: 400 }
      );
    }

    // 1. Verify Payment with Payment Adapter
    const adapter = getPaymentAdapter();
    const captureResult = await adapter.capturePayment(orderId || bookingId, paymentReference);

    if (!captureResult.success) {
      return NextResponse.json(
        { error: "Payment verification failed with provider." },
        { status: 402 }
      );
    }

    // 2. Transition booking state to confirmed via stored procedure
    // Enforces P6 Exit Criteria 3: Client cannot directly set status to confirmed via update
    const { data: confirmResult, error: confirmError } = await supabase.rpc(
      "confirm_booking_payment",
      {
        p_booking_id: bookingId,
        p_payment_reference: paymentReference,
        p_meeting_url: null, // Generated dynamically inside procedure
      }
    );

    if (confirmError) {
      return NextResponse.json(
        { error: confirmError.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      booking: confirmResult,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to confirm payment.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
