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

    const { data, error } = await supabase.rpc('mark_lesson_complete', {
      p_journey_id: journeyId,
      p_document_id: documentId,
    });

    if (error) {
      console.error('mark_lesson_complete error:', error);
      return NextResponse.json({ error: 'Failed to mark lesson complete' }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      pillar_pct_complete: data?.pillar_pct_complete ?? null,
      badge_earned: data?.badge_earned ?? null,
    });
  } catch (error) {
    console.error('Lessons complete API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
