import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const explicitRedirect = searchParams.get('redirect');

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // If caller specified an explicit redirect (not the default), honour it
      if (explicitRedirect && explicitRedirect !== '/track-selection') {
        return NextResponse.redirect(`${origin}${explicitRedirect}`);
      }

      // Otherwise, determine the right destination based on user state
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: journey } = await supabase.from('journeys')
          .select('id')
          .eq('user_id', user.id)
          .limit(1)
          .maybeSingle();

        if (journey) {
          // Has a journey → dashboard
          return NextResponse.redirect(`${origin}/dashboard`);
        }

        // No journey — check onboarding status
        const { data: profile } = await supabase.from('profiles')
          .select('onboarding_completed')
          .eq('id', user.id)
          .single();

        if (profile?.onboarding_completed) {
          // Completed onboarding before but no journey (edge case) → track selection
          return NextResponse.redirect(`${origin}/track-selection`);
        }

        // New user, no onboarding → onboarding
        return NextResponse.redirect(`${origin}/onboarding`);
      }
    }
  }

  // Fallback
  return NextResponse.redirect(`${origin}/track-selection`);
}
