import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

async function checkSuperAdmin(supabase: any) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'super_admin') return null;
  return user;
}

export async function GET() {
  try {
    const supabase = await createClient();
    if (!(await checkSuperAdmin(supabase))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { data, error } = await supabase
      .from('knowledge_documents')
      .select('id, title, sub_domain, difficulty, language, pillar_id, track_id, source, author, created_at, embedding')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const docs = (data || []).map((d: any) => ({
      ...d,
      has_embedding: !!d.embedding,
      embedding: undefined,
    }));

    return NextResponse.json({ docs });
  } catch (error) {
    console.error('Admin documents GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    if (!(await checkSuperAdmin(supabase))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { track_id, pillar_id, title, content, language, difficulty, sub_domain, source, author } = body;

    if (!track_id || !pillar_id || !title || !content || !language) {
      return NextResponse.json({ error: 'track_id, pillar_id, title, content, and language are required' }, { status: 400 });
    }

    const { data, error } = await supabase.from('knowledge_documents').insert({
      track_id,
      pillar_id,
      title,
      content,
      language,
      difficulty: difficulty || 'beginner',
      sub_domain: sub_domain || '',
      source: source || null,
      author: author || null,
    }).select('id').single();

    if (error) {
      console.error('Insert document error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, id: data.id });
  } catch (error) {
    console.error('Admin documents POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
