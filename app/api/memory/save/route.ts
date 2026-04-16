import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const { journeyId, conversationId, memoryType, content } = await req.json();

    if (!journeyId || !content) {
      return NextResponse.json({ error: 'journeyId and content are required' }, { status: 400 });
    }

    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase.rpc('save_coaching_memory', {
      p_journey_id: journeyId,
      p_conversation_id: conversationId || null,
      p_memory_type: memoryType || 'breakthrough',
      p_content: content,
    });

    if (error) {
      console.error('save_coaching_memory error:', error);
      return NextResponse.json({ error: 'Failed to save memory' }, { status: 500 });
    }

    return NextResponse.json({ ok: true, id: data ?? null });
  } catch (error) {
    console.error('Memory save API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
