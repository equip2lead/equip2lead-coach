import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const { journeyId } = await req.json();

    if (!journeyId) {
      return NextResponse.json({ error: 'journeyId is required' }, { status: 400 });
    }

    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { error } = await supabase.rpc('update_streak', {
      p_journey_id: journeyId,
    });

    if (error) {
      console.error('update_streak error:', error);
      return NextResponse.json({ error: 'Failed to update streak' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Progress API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
