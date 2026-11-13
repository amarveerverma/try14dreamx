import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getPaymentAdapter } from "@/lib/payments/adapter";

/**
 * DreamX P7 Webhook Handler
 * Specifications: PRD V3.0 §13, §16.1
 * Exit Criteria:
 *   - P7 #1: Replayed or invalid webhooks create no duplicate payment or booking.
 */
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature =
      req.headers.get("x-webhook-signature") ||
      req.headers.get("x-cashfree-signature") ||
      req.headers.get("x-razorpay-signature") ||
      "";

    const adapter = getPaymentAdapter();

    // 1. Verify Webhook Signature (Barred unverified calls)
    const isValid = adapter.verifyWebhookSignature(rawBody, signature);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid webhook signature." },
        { status: 401 }
      );
    }

    const payload = JSON.parse(rawBody);

    // Extract standardized fields (Cashfree / Test Mode structure)
    const provider = adapter.providerName;
    const providerOrderId = payload.data?.order?.order_id || payload.orderId;
    const providerPaymentId =
      payload.data?.payment?.cf_payment_id?.toString() || payload.paymentId || `pay_${Date.now()}`;
    const amountPaise = Math.round(
      Number(payload.data?.payment?.payment_amount || payload.amount || 0) * 100
    );
    const paymentStatus =
      payload.data?.payment?.payment_status === "SUCCESS" || payload.status === "captured"
        ? "captured"
        : payload.status === "failed"
        ? "failed"
        : "created";

    const bookingId = payload.data?.order?.order_tags?.booking_id || payload.bookingId;
    const idempotencyKey =
      req.headers.get("x-idempotency-key") ||
      `${provider}_${providerOrderId}_${providerPaymentId}_${paymentStatus}`;

    if (!bookingId) {
      return NextResponse.json(
        { error: "Missing booking identifier in webhook payload." },
        { status: 400 }
      );
    }

    // 2. Initialize Supabase Admin Client for Webhook Execution
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // 3. Invoke Idempotent Webhook Stored Procedure (P7 Exit Criteria 1)
    const { data: result, error: rpcError } = await supabaseAdmin.rpc(
      "process_payment_webhook",
      {
        p_idempotency_key: idempotencyKey,
        p_booking_id: bookingId,
        p_provider: provider,
        p_provider_order_id: providerOrderId,
        p_provider_payment_id: providerPaymentId,
        p_amount_paise: amountPaise,
        p_status: paymentStatus,
        p_signature: signature,
        p_raw_payload: payload,
      }
    );

    if (rpcError) {
      return NextResponse.json(
        { error: rpcError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Webhook processing error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
