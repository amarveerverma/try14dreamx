import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    const adminIdParam = request.nextUrl.searchParams.get('adminId');
    const targetType = request.nextUrl.searchParams.get('targetType');
    const limitParam = request.nextUrl.searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : 50;

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: authHeader ? { Authorization: authHeader } : undefined,
      },
    });

    let adminId = adminIdParam;
    if (!adminId) {
      const { data: { user } } = await supabase.auth.getUser();
      adminId = user?.id || null;
    }

    if (!adminId) {
      return NextResponse.json(
        { error: 'Unauthorized: Missing administrator credentials.' },
        { status: 401 }
      );
    }

    const { data, error } = await supabase.rpc('query_admin_audit_logs', {
      p_admin_id: adminId,
      p_target_type: targetType || null,
      p_limit: limit,
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
