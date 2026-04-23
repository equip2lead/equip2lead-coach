import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });

    const { data: profile } = await supabase
      .from('profiles')
      .select('role, full_name')
      .eq('id', user.id)
      .single();
    if (!profile || profile.role !== 'super_admin') {
      return NextResponse.json({ ok: false, error: 'forbidden' }, { status: 403 });
    }

    const { invite_id, email, role, message } = await req.json();
    if (!invite_id || !email) {
      return NextResponse.json({ ok: false, error: 'missing fields' }, { status: 400 });
    }

    const resendKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.CONTACT_FROM_EMAIL || 'contact@equip2lead.coach';
    const fromName = process.env.CONTACT_FROM_NAME || 'Equip2Lead';
    if (!resendKey) return NextResponse.json({ ok: false, error: 'misconfigured' }, { status: 500 });

    const acceptUrl = `https://app.equip2lead.coach/accept-invite?id=${invite_id}`;
    const inviterName = profile.full_name || 'The Equip2Lead team';
    const resend = new Resend(resendKey);
    const esc = (s: string) =>
      s.replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' } as Record<string, string>)[c] || c);

    const { data: sent, error: sendErr } = await resend.emails.send({
      from: `${fromName} <${fromEmail}>`,
      to: [email],
      subject: `${inviterName} invited you to Equip2Lead Coaching`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; color: #111827;">
          <div style="display:flex; align-items:flex-end; gap:2px; margin-bottom:24px;">
            <div style="width:7px; height:12px; background:#F9250E; border-radius:2px"></div>
            <div style="width:7px; height:20px; background:#F9250E; border-radius:2px"></div>
            <div style="width:7px; height:28px; background:#F9250E; border-radius:2px"></div>
            <div style="margin-left:10px; font-family:'Libre Baskerville', Georgia, serif; font-weight:700; font-size:20px; color:#111827;">
              equip<span style="color:#F9250E">2</span>lead
            </div>
          </div>
          <h1 style="font-size:22px; margin:0 0 16px;">You're invited</h1>
          <p style="font-size:15px; line-height:1.6; color:#374151;">
            ${esc(inviterName)} has invited you to join <strong>Equip2Lead Coaching</strong>${role && role !== 'user' ? ` as a <strong>${esc(role)}</strong>` : ''}.
          </p>
          ${message ? `<blockquote style="border-left:3px solid #F9250E; padding:4px 16px; margin:20px 0; color:#4B5563; font-style:italic;">${esc(message)}</blockquote>` : ''}
          <p style="font-size:15px; line-height:1.6; color:#374151;">
            Equip2Lead helps you grow across Leadership, Ministry, Marriage, Entrepreneurship, and Personal Development — with a personalised diagnostic, 12-week plan, and 24/7 AI coach.
          </p>
          <div style="margin:32px 0;">
            <a href="${acceptUrl}" style="display:inline-block; background:#F9250E; color:white; padding:14px 28px; border-radius:10px; text-decoration:none; font-weight:600; font-size:15px;">
              Accept invitation →
            </a>
          </div>
          <p style="font-size:13px; color:#6B7280; line-height:1.6;">
            This invite expires in 7 days. If the button doesn't work, copy this link:<br>
            <span style="color:#9CA3AF; word-break:break-all;">${acceptUrl}</span>
          </p>
          <hr style="border:none; border-top:1px solid #E5E7EB; margin:24px 0 16px;">
          <p style="font-size:12px; color:#9CA3AF; margin:0;">
            Equip2Lead · AFRILEAD · Yaoundé, Cameroon<br>
            <a href="https://equip2lead.coach" style="color:#9CA3AF;">equip2lead.coach</a>
          </p>
        </div>
      `,
    });

    if (sendErr) {
      console.error('[invite-send] Resend:', sendErr);
      return NextResponse.json({ ok: false, error: 'email send failed' }, { status: 500 });
    }

    await supabase.rpc('admin_mark_invite_sent', {
      invite_id: invite_id,
      email_id: sent?.id || '',
    });

    return NextResponse.json({ ok: true, email_id: sent?.id });
  } catch (err) {
    console.error('[invite-send] error:', err);
    return NextResponse.json({ ok: false, error: 'server error' }, { status: 500 });
  }
}
