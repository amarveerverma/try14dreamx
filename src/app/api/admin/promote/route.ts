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
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    const isPlatformOwner =
      user.email?.toLowerCase().includes("amarveer") ||
      user.email?.toLowerCase() === "vermaamarveer0@gmail.com";

    // Verify calling user is admin or owner
    const { data: callerProfile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (callerProfile?.role !== "admin" && !isPlatformOwner) {
      return NextResponse.json({ error: "Only administrators can change roles." }, { status: 403 });
    }

    const { targetUserId, newRole } = await req.json();

    if (!targetUserId || !["student", "mentor", "admin"].includes(newRole)) {
      return NextResponse.json({ error: "Invalid parameters." }, { status: 400 });
    }

    // Update target user profile
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ role: newRole, updated_at: new Date().toISOString() })
      .eq("id", targetUserId);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 400 });
    }

    // Insert into audit logs
    await supabase.from("audit_logs").insert({
      actor_id: user.id,
      action: "USER_ROLE_CHANGED",
      target_type: "profile",
      target_id: targetUserId,
      reason_code: "ADMIN_CONSOLE_ACTION",
      metadata: { new_role: newRole, changed_by: user.email },
    });

    return NextResponse.json({ success: true, updatedRole: newRole });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
