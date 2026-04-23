import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const { journeyId, documentId } = await req.json();

    if (!journeyId || !documentId) {
      return NextResponse.json({ error: 'journeyId and documentId are required' }, { status: 400 });
    }

    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: journey, error: journeyErr } = await supabase
      .from('journeys')
      .select('id, user_id')
      .eq('id', journeyId)
      .single();
    if (journeyErr || !journey || journey.user_id !== user.id) {
      return NextResponse.json({ error: 'Journey not found' }, { status: 404 });
    }

    const { error: upsertErr } = await supabase
      .from('lesson_progress')
      .upsert(
        {
          journey_id: journeyId,
          document_id: documentId,
          status: 'skipped',
          started_at: new Date().toISOString(),
        },
        { onConflict: 'journey_id,document_id' }
      );

    if (upsertErr) {
      console.error('[lessons/skip] upsert error:', upsertErr);
      return NextResponse.json({ error: 'Failed to mark lesson skipped' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[lessons/skip] route error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
