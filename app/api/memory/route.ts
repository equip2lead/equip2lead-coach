import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const { journeyId, conversationId, messages } = await req.json();

    if (!journeyId || !messages?.length) {
      return NextResponse.json({ error: 'journeyId and messages are required' }, { status: 400 });
    }

    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceKey) {
      return NextResponse.json({ ok: false, reason: 'service key not configured' });
    }

    const res = await fetch(
      'https://vjnzvrhbzaqmzneirmjq.supabase.co/functions/v1/extract-session-memories',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${serviceKey}`,
        },
        body: JSON.stringify({
          journey_id: journeyId,
          conversation_id: conversationId || crypto.randomUUID(),
          messages,
          user_id: user.id,
        }),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      console.error('extract-session-memories error:', err);
      return NextResponse.json({ error: 'Memory extraction failed' }, { status: 500 });
    }

    const data = await res.json();
    return NextResponse.json({ ok: true, memoriesExtracted: data.memories_count ?? 0 });
  } catch (error) {
    console.error('Memory API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
