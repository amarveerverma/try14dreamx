/**
 * DreamX Payment Adapter Interface & Implementations
 * Specifications: PRD V3.0 §13, §16.1, Implementation Plan §P6, §P7
 * Exit Criteria:
 *   - P6 #4: The test-mode adapter cannot be enabled in production.
 *   - P7 #1: Replayed or invalid webhooks create no duplicate payment or booking.
 */

import crypto from "crypto";

export interface CreateOrderParams {
  bookingId: string;
  bookingRef: string;
  amountPaise: number;
  currency?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
}

export interface PaymentOrderResult {
  provider: "test_mode" | "cashfree" | "razorpay";
  orderId: string;
  paymentSessionId?: string;
  amountPaise: number;
  currency: string;
  status: "created" | "pending";
}

export interface CaptureResult {
  success: boolean;
  paymentId: string;
  orderId: string;
  amountPaise: number;
  status: "captured" | "failed";
  rawResponse?: Record<string, unknown>;
}

export interface RefundParams {
  bookingId: string;
  paymentId: string;
  amountPaise: number;
  reason: string;
}

export interface RefundResult {
  success: boolean;
  refundId: string;
  amountPaise: number;
  status: "initiated" | "completed" | "failed";
}

export interface PaymentAdapter {
  readonly providerName: string;
  createPaymentOrder(params: CreateOrderParams): Promise<PaymentOrderResult>;
  verifyWebhookSignature(rawBody: string, signature: string): boolean;
  capturePayment(orderId: string, paymentId: string): Promise<CaptureResult>;
  refundPayment(params: RefundParams): Promise<RefundResult>;
}

/**
 * TestModePaymentAdapter
 * Used ONLY in development, testing, and staging environments.
 * STRICTLY BARRED in production per P6 Exit Criteria 4.
 */
export class TestModePaymentAdapter implements PaymentAdapter {
  readonly providerName = "test_mode";

  constructor() {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "CRITICAL SECURITY VIOLATION: TestModePaymentAdapter cannot be enabled in production (PRD §16.1 & P6 Exit Criteria 4)."
      );
    }
  }

  async createPaymentOrder(params: CreateOrderParams): Promise<PaymentOrderResult> {
    if (process.env.NODE_ENV === "production") {
      throw new Error("P6 SECURITY VIOLATION: TestModePaymentAdapter barred in production.");
    }

    const orderId = `test_order_${params.bookingRef}_${Date.now()}`;
    return {
      provider: "test_mode",
      orderId,
      paymentSessionId: `test_sess_${crypto.randomBytes(8).toString("hex")}`,
      amountPaise: params.amountPaise,
      currency: params.currency || "INR",
      status: "created",
    };
  }

  verifyWebhookSignature(rawBody: string, signature: string): boolean {
    if (process.env.NODE_ENV === "production") {
      throw new Error("P6 SECURITY VIOLATION: TestModePaymentAdapter barred in production.");
    }
    // Test mode accepts test signatures formatted as "test_sig_<hex>"
    if (!signature) return false;
    return signature.startsWith("test_sig_");
  }

  async capturePayment(orderId: string, paymentId: string): Promise<CaptureResult> {
    if (process.env.NODE_ENV === "production") {
      throw new Error("P6 SECURITY VIOLATION: TestModePaymentAdapter barred in production.");
    }
    return {
      success: true,
      paymentId: paymentId || `test_pay_${Date.now()}`,
      orderId,
      amountPaise: 0,
      status: "captured",
    };
  }

  async refundPayment(params: RefundParams): Promise<RefundResult> {
    if (process.env.NODE_ENV === "production") {
      throw new Error("P6 SECURITY VIOLATION: TestModePaymentAdapter barred in production.");
    }
    return {
      success: true,
      refundId: `test_ref_${Date.now()}`,
      amountPaise: params.amountPaise,
      status: "initiated",
    };
  }
}

/**
 * CashfreePaymentAdapter
 * Production PG adapter for India (CM-IN), supporting Escrow, UPI, Netbanking, Cards.
 * Computes HMAC-SHA256 signature verification.
 */
export class CashfreePaymentAdapter implements PaymentAdapter {
  readonly providerName = "cashfree";
  private appId: string;
  private secretKey: string;
  private apiEndpoint: string;

  constructor(appId?: string, secretKey?: string, isSandbox = false) {
    this.appId = appId || process.env.CASHFREE_APP_ID || "";
    this.secretKey = secretKey || process.env.CASHFREE_SECRET_KEY || "";
    this.apiEndpoint = isSandbox
      ? "https://sandbox.cashfree.com/pg"
      : "https://api.cashfree.com/pg";
  }

  async createPaymentOrder(params: CreateOrderParams): Promise<PaymentOrderResult> {
    if (!this.appId || !this.secretKey) {
      throw new Error("Cashfree credentials missing: CASHFREE_APP_ID and CASHFREE_SECRET_KEY are required.");
    }

    const payload = {
      order_id: params.bookingRef,
      order_amount: (params.amountPaise / 100).toFixed(2),
      order_currency: "INR",
      customer_details: {
        customer_id: `cust_${params.bookingId.slice(0, 8)}`,
        customer_name: params.customerName,
        customer_email: params.customerEmail,
        customer_phone: params.customerPhone || "9999999999",
      },
      order_meta: {
        return_url: `${process.env.NEXT_PUBLIC_APP_URL || "https://try14dreamx.vercel.app"}/dashboard/bookings?order_id={order_id}`,
      },
    };

    const res = await fetch(`${this.apiEndpoint}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-version": "2023-08-01",
        "x-client-id": this.appId,
        "x-client-secret": this.secretKey,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Cashfree Order Creation Failed: ${res.status} - ${errText}`);
    }

    const data = await res.json();
    return {
      provider: "cashfree",
      orderId: data.order_id,
      paymentSessionId: data.payment_session_id,
      amountPaise: params.amountPaise,
      currency: "INR",
      status: "created",
    };
  }

  verifyWebhookSignature(rawBody: string, signature: string): boolean {
    if (!this.secretKey || !signature) return false;
    try {
      const computed = crypto
        .createHmac("sha256", this.secretKey)
        .update(rawBody)
        .digest("base64");
      return crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(signature));
    } catch {
      return false;
    }
  }

  async capturePayment(orderId: string, paymentId: string): Promise<CaptureResult> {
    const res = await fetch(`${this.apiEndpoint}/orders/${orderId}/payments/${paymentId}`, {
      method: "GET",
      headers: {
        "x-api-version": "2023-08-01",
        "x-client-id": this.appId,
        "x-client-secret": this.secretKey,
      },
    });

    if (!res.ok) {
      return {
        success: false,
        paymentId,
        orderId,
        amountPaise: 0,
        status: "failed",
      };
    }

    const data = await res.json();
    const isSuccess = data.payment_status === "SUCCESS";
    return {
      success: isSuccess,
      paymentId,
      orderId,
      amountPaise: Math.round(Number(data.payment_amount) * 100),
      status: isSuccess ? "captured" : "failed",
      rawResponse: data,
    };
  }

  async refundPayment(params: RefundParams): Promise<RefundResult> {
    const res = await fetch(`${this.apiEndpoint}/orders/${params.bookingId}/refunds`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-version": "2023-08-01",
        "x-client-id": this.appId,
        "x-client-secret": this.secretKey,
      },
      body: JSON.stringify({
        refund_amount: (params.amountPaise / 100).toFixed(2),
        refund_id: `ref_${Date.now()}`,
        refund_note: params.reason,
      }),
    });

    if (!res.ok) {
      return {
        success: false,
        refundId: "",
        amountPaise: params.amountPaise,
        status: "failed",
      };
    }

    const data = await res.json();
    return {
      success: true,
      refundId: data.refund_id,
      amountPaise: params.amountPaise,
      status: data.refund_status === "SUCCESS" ? "completed" : "initiated",
    };
  }
}

/**
 * Factory getter enforcing P6 Exit Criteria 4:
 * TestModePaymentAdapter cannot be instantiated or used in production.
 */
export function getPaymentAdapter(): PaymentAdapter {
  const isProduction = process.env.NODE_ENV === "production" || process.env.VERCEL_ENV === "production";
  const forceTestMode = process.env.PAYMENT_PROVIDER === "test_mode";

  if (isProduction) {
    if (forceTestMode) {
      throw new Error(
        "CRITICAL ERROR: PAYMENT_PROVIDER cannot be set to 'test_mode' in production (P6 Exit Criteria 4)."
      );
    }
    return new CashfreePaymentAdapter(
      process.env.CASHFREE_APP_ID,
      process.env.CASHFREE_SECRET_KEY,
      false
    );
  }

  // Non-production fallback
  if (process.env.CASHFREE_APP_ID && !forceTestMode) {
    return new CashfreePaymentAdapter(
      process.env.CASHFREE_APP_ID,
      process.env.CASHFREE_SECRET_KEY,
      true
    );
  }

  return new TestModePaymentAdapter();
}
