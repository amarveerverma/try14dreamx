import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    const body = await request.json();
    const { approvalId, adminId, approve, notes } = body;

    if (!approvalId || typeof approve !== 'boolean') {
      return NextResponse.json(
        { error: 'Missing required parameters: approvalId and approve boolean are mandatory.' },
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

    const { data, error } = await supabase.rpc('co_sign_financial_approval_p12', {
      p_approval_id: approvalId,
      p_admin_id: effectiveAdminId,
      p_approve: approve,
      p_notes: notes || null,
    });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
