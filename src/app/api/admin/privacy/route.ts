import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    const body = await request.json();
    const { action, targetUserId, adminId, reason } = body;

    if (!action || !targetUserId) {
      return NextResponse.json(
        { error: 'Missing required parameters: action ("export" | "soft_delete") and targetUserId.' },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: authHeader ? { Authorization: authHeader } : undefined,
      },
    });

    let effectiveAdminId = adminId;
    if (!effectiveAdminId) {
      const { data: { user } } = await supabase.auth.getUser();
      effectiveAdminId = user?.id || null;
    }

    if (!effectiveAdminId) {
      return NextResponse.json(
        { error: 'Unauthorized: Missing administrator credentials.' },
        { status: 401 }
      );
    }

    if (action === 'export') {
      const { data, error } = await supabase.rpc('request_user_data_export', {
        p_admin_id: effectiveAdminId,
        p_target_user_id: targetUserId,
      });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
      return NextResponse.json(data);
    } else if (action === 'soft_delete') {
      const { data, error } = await supabase.rpc('execute_privacy_soft_delete', {
        p_admin_id: effectiveAdminId,
        p_target_user_id: targetUserId,
        p_reason: reason || 'User requested account closure & personal data erasure',
      });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
      return NextResponse.json(data);
    } else {
      return NextResponse.json(
        { error: 'Invalid action. Supported actions: "export", "soft_delete".' },
        { status: 400 }
      );
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
