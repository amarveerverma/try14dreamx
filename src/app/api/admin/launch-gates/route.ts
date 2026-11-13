import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    const adminIdParam = request.nextUrl.searchParams.get('adminId');

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

    const { data, error } = await supabase.rpc('get_launch_gates_readiness_audit', {
      p_admin_id: adminId,
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
