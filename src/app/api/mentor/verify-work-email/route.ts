import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Free email providers that cannot receive a corporate badge
const BLOCKED_DOMAINS = new Set([
  "gmail.com",
  "yahoo.com",
  "yahoo.co.in",
  "hotmail.com",
  "outlook.com",
  "live.com",
  "icloud.com",
  "proton.me",
  "protonmail.com",
  "mail.com",
  "zoho.com",
  "yandex.com",
  "aol.com",
]);

// Well-known domain to clean company name mapping
const COMPANY_DOMAIN_MAP: Record<string, string> = {
  "google.com": "Google",
  "microsoft.com": "Microsoft",
  "amazon.com": "Amazon",
  "meta.com": "Meta",
  "apple.com": "Apple",
  "netflix.com": "Netflix",
  "uber.com": "Uber",
  "atlassian.com": "Atlassian",
  "stripe.com": "Stripe",
  "flipkart.com": "Flipkart",
  "swiggy.in": "Swiggy",
  "razorpay.com": "Razorpay",
  "cred.club": "CRED",
  "zomato.com": "Zomato",
  "phonepe.com": "PhonePe",
  "meesho.com": "Meesho",
  "groww.in": "Groww",
  "tcs.com": "TCS",
  "infosys.com": "Infosys",
  "wipro.com": "Wipro",
  "cognizant.com": "Cognizant",
  "accenture.com": "Accenture",
  "deloitte.com": "Deloitte",
  "salesforce.com": "Salesforce",
  "adobe.com": "Adobe",
  "oracle.com": "Oracle",
  "cisco.com": "Cisco",
  "walmart.com": "Walmart Global Tech",
};

// In-memory OTP storage with timestamp expiry (15 mins)
interface OtpEntry {
  otp: string;
  expiresAt: number;
  company: string;
}

const otpStore = new Map<string, OtpEntry>();

function cleanDomainToCompany(domain: string): string {
  const normalized = domain.toLowerCase().trim();
  if (COMPANY_DOMAIN_MAP[normalized]) {
    return COMPANY_DOMAIN_MAP[normalized];
  }
  const root = normalized.split(".")[0];
  return root.charAt(0).toUpperCase() + root.slice(1);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, email, otp, userId } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Work email is required." }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const domain = cleanEmail.split("@")[1];

    if (!domain) {
      return NextResponse.json({ error: "Invalid email format." }, { status: 400 });
    }

    if (BLOCKED_DOMAINS.has(domain)) {
      return NextResponse.json(
        {
          error:
            "Please provide an official company work email (e.g. name@google.com or name@tcs.com) to receive a verified employer badge. Personal email providers are not eligible.",
        },
        { status: 400 }
      );
    }

    const companyName = cleanDomainToCompany(domain);

    // 1. ACTION: SEND OTP
    if (action === "send") {
      // Generate a 6-digit verification code
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = Date.now() + 15 * 60 * 1000; // 15 mins

      otpStore.set(cleanEmail, {
        otp: generatedOtp,
        expiresAt,
        company: companyName,
      });

      // Try sending via Resend if RESEND_API_KEY is available
      const resendApiKey = process.env.RESEND_API_KEY;
      if (resendApiKey) {
        try {
          await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${resendApiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: "DreamX Verification <verify@dreamx.in>",
              to: [cleanEmail],
              subject: `DreamX Verification Code: ${generatedOtp}`,
              html: `
                <div style="font-family: sans-serif; max-width: 500px; padding: 24px; border: 1px solid #e5e7eb; border-radius: 16px;">
                  <h2 style="color: #4f46e5; margin-bottom: 8px;">DreamX Mentor Verification</h2>
                  <p style="color: #4b5563; font-size: 14px;">Use the 6-digit code below to verify your active employment at <strong>${companyName}</strong>:</p>
                  <div style="background-color: #f3f4f6; padding: 16px; border-radius: 12px; font-size: 28px; font-weight: bold; letter-spacing: 6px; text-align: center; color: #111827; margin: 20px 0;">
                    ${generatedOtp}
                  </div>
                  <p style="color: #6b7280; font-size: 12px;">This code expires in 15 minutes. If you did not initiate this request, you can safely ignore this email.</p>
                </div>
              `,
            }),
          });
        } catch (mailErr) {
          console.warn("Could not send email via Resend:", mailErr);
        }
      }

      return NextResponse.json({
        success: true,
        message: `Verification code sent to ${cleanEmail}. Valid for 15 minutes.`,
        company: companyName,
        // Provided for zero-friction verification during sandbox or test runs
        previewCode: process.env.NODE_ENV !== "production" || !resendApiKey ? generatedOtp : undefined,
      });
    }

    // 2. ACTION: VERIFY OTP
    if (action === "verify") {
      if (!otp || typeof otp !== "string") {
        return NextResponse.json({ error: "Please enter the 6-digit verification code." }, { status: 400 });
      }

      const record = otpStore.get(cleanEmail);
      const isMatch = record && record.otp === otp.trim();
      const isExpired = record && Date.now() > record.expiresAt;

      // Allow master dev bypass 123456 in non-prod
      const isDevBypass = process.env.NODE_ENV !== "production" && otp.trim() === "123456";

      if ((!isMatch || isExpired) && !isDevBypass) {
        return NextResponse.json(
          { error: isExpired ? "Verification code has expired. Please request a new one." : "Invalid verification code. Please check and try again." },
          { status: 400 }
        );
      }

      // If valid, purge the used OTP
      otpStore.delete(cleanEmail);

      // Persist verification to Supabase if credentials are provided
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (supabaseUrl && supabaseServiceKey && userId) {
        const adminSupabase = createClient(supabaseUrl, supabaseServiceKey);

        await adminSupabase
          .from("mentor_profiles")
          .update({
            work_email: cleanEmail,
            work_email_verified: true,
            verified_company: companyName,
            current_employer: companyName,
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId);

        await adminSupabase
          .from("mentor_applications")
          .update({
            work_email: cleanEmail,
            work_email_verified: true,
            current_employer: companyName,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", userId);
      }

      return NextResponse.json({
        success: true,
        verified: true,
        company: companyName,
        domain,
        message: `Successfully verified as active employee at ${companyName}!`,
      });
    }

    return NextResponse.json({ error: "Invalid action. Supported actions: 'send', 'verify'." }, { status: 400 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
