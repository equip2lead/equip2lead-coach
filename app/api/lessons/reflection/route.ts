import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const documentId = searchParams.get('documentId');
    const journeyId = searchParams.get('journeyId');
    const language = searchParams.get('language') || 'en';

    if (!documentId || !journeyId) {
      return NextResponse.json({ error: 'documentId and journeyId are required' }, { status: 400 });
    }

    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase.rpc('get_lesson_reflection_prompt', {
      p_journey_id: journeyId,
      p_document_id: documentId,
      p_language: language,
    });

    if (error) {
      console.error('get_lesson_reflection_prompt error:', error);
      return NextResponse.json({ error: 'Failed to get reflection prompt' }, { status: 500 });
    }

    return NextResponse.json({ question: data || '' });
  } catch (error) {
    console.error('Reflection API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
