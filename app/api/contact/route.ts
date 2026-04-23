// app/api/contact/route.ts
// Receives POSTs from the marketing site (equip2lead.coach/contact.html),
// inserts into contact_submissions, and sends notification + auto-reply via Resend.

import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ALLOWED_ORIGINS = [
  'https://equip2lead.coach',
  'https://www.equip2lead.coach',
  'http://localhost:3000',
  'http://localhost:5500',
];

function corsHeaders(origin: string | null) {
  const allow = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(req.headers.get('origin')) });
}

export async function POST(req: NextRequest) {
  const origin = req.headers.get('origin');
  const headers = corsHeaders(origin);

  try {
    const body = await req.json();
    const { name, email, phone, topic, message, website } = body;

    // Honeypot — bots fill hidden 'website' field
    if (website && String(website).trim() !== '') {
      return NextResponse.json({ ok: true }, { headers });
    }

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { ok: false, error: 'Name, email, and message are required.' },
        { status: 400, headers }
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { ok: false, error: 'Please enter a valid email address.' },
        { status: 400, headers }
      );
    }
    if (String(message).length > 5000) {
      return NextResponse.json(
        { ok: false, error: 'Message is too long (max 5000 characters).' },
        { status: 400, headers }
      );
    }

    // Required env
    const resendKey = process.env.RESEND_API_KEY;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const fromEmail = process.env.CONTACT_FROM_EMAIL;
    const fromName = process.env.CONTACT_FROM_NAME || 'Equip2Lead';
    const toEmail = process.env.CONTACT_TO_EMAIL || 'contact@equip2lead.coach';

    if (!resendKey || !supabaseUrl || !serviceRole || !fromEmail) {
      console.error('[contact] Missing env vars', {
        hasResend: !!resendKey,
        hasSupabaseUrl: !!supabaseUrl,
        hasServiceRole: !!serviceRole,
        hasFrom: !!fromEmail,
      });
      return NextResponse.json({ ok: false, error: 'Server misconfigured.' }, { status: 500, headers });
    }

    // Sanitise
    const safeName = String(name).slice(0, 100);
    const safeEmail = String(email).slice(0, 200);
    const safePhone = phone ? String(phone).slice(0, 50) : null;
    const safeTopic = topic ? String(topic).slice(0, 50) : 'general';
    const safeMessage = String(message).slice(0, 5000);
    const ipAddress =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      req.headers.get('x-real-ip') ||
      null;
    const userAgent = req.headers.get('user-agent')?.slice(0, 500) || null;

    const topicLabel =
      ({
        general: 'General question',
        partnership: 'Partnership / institutional use',
        billing: 'Billing or account',
        press: 'Press / media enquiry',
        feedback: 'Platform feedback',
        other: 'Other',
      } as Record<string, string>)[safeTopic] || safeTopic;

    // 1) Log to Supabase FIRST — even if Resend fails, we have the message.
    const supabase = createClient(supabaseUrl, serviceRole);
    const { data: submission, error: dbErr } = await supabase
      .from('contact_submissions')
      .insert({
        name: safeName,
        email: safeEmail,
        phone: safePhone,
        topic: safeTopic,
        message: safeMessage,
        ip_address: ipAddress,
        user_agent: userAgent,
        resend_status: 'skipped', // updated below after send
      })
      .select('id')
      .single();

    if (dbErr) {
      console.error('[contact] Supabase insert failed:', dbErr);
      // Don't hard-fail — still try Resend so the team gets the message.
    }

    // 2) Resend: notify team + auto-reply
    const resend = new Resend(resendKey);
    const fromHeader = `${fromName} <${fromEmail}>`;
    const escaped = safeMessage.replace(/[<>&]/g, (c) =>
      ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c] || c)
    );

    const { data: sent, error: sendErr } = await resend.emails.send({
      from: fromHeader,
      to: [toEmail],
      replyTo: safeEmail,
      subject: `[Contact] ${topicLabel} — ${safeName}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #111827;">
          <h2 style="font-size: 18px; margin: 0 0 16px;">New contact form submission</h2>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr><td style="padding: 8px 0; color: #6B7280; width: 120px;">Name</td><td style="padding: 8px 0;">${safeName}</td></tr>
            <tr><td style="padding: 8px 0; color: #6B7280;">Email</td><td style="padding: 8px 0;"><a href="mailto:${safeEmail}" style="color: #F9250E;">${safeEmail}</a></td></tr>
            <tr><td style="padding: 8px 0; color: #6B7280;">Phone</td><td style="padding: 8px 0;">${safePhone || '(not provided)'}</td></tr>
            <tr><td style="padding: 8px 0; color: #6B7280;">Topic</td><td style="padding: 8px 0;">${topicLabel}</td></tr>
          </table>
          <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 20px 0;">
          <p style="white-space: pre-wrap; font-size: 14px; color: #374151; line-height: 1.6; margin: 0;">${escaped}</p>
          <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 20px 0;">
          <p style="font-size: 12px; color: #9CA3AF; margin: 0;">Sent from equip2lead.coach contact form · Reply directly to respond to ${safeName}.</p>
        </div>
      `,
    });

    // Update submission with delivery outcome
    if (submission?.id) {
      await supabase
        .from('contact_submissions')
        .update({
          resend_status: sendErr ? 'failed' : 'sent',
          resend_email_id: sent?.id || null,
          resend_error: sendErr ? JSON.stringify(sendErr).slice(0, 500) : null,
        })
        .eq('id', submission.id);
    }

    if (sendErr) {
      console.error('[contact] Resend send failed:', sendErr);
      return NextResponse.json(
        { ok: false, error: 'Failed to send.' },
        { status: 500, headers }
      );
    }

    // 3) Auto-reply to user (non-blocking)
    try {
      await resend.emails.send({
        from: fromHeader,
        to: [safeEmail],
        subject: 'We got your message — Equip2Lead',
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #111827;">
            <h2 style="font-size: 20px; margin: 0 0 16px;">Thanks, ${safeName} 👋</h2>
            <p style="font-size: 15px; line-height: 1.6; color: #374151;">Your message landed — we'll get back to you within 24 hours, usually much faster.</p>
            <p style="font-size: 15px; line-height: 1.6; color: #374151;">If it's urgent, WhatsApp us at <a href="https://wa.me/19803272341" style="color: #F9250E;">+1 (980) 327 2341</a>.</p>
            <p style="font-size: 15px; line-height: 1.6; color: #374151; margin-top: 24px;">— The Equip2Lead team</p>
            <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 24px 0 16px;">
            <p style="font-size: 12px; color: #9CA3AF; margin: 0;">Equip2Lead · AFRILEAD · Yaoundé, Cameroon<br><a href="https://equip2lead.coach" style="color: #9CA3AF;">equip2lead.coach</a></p>
          </div>
        `,
      });
    } catch (autoReplyErr) {
      console.warn('[contact] Auto-reply failed (non-blocking):', autoReplyErr);
    }

    return NextResponse.json({ ok: true, id: sent?.id }, { headers });
  } catch (err) {
    console.error('[contact] Route error:', err);
    return NextResponse.json({ ok: false, error: 'Server error.' }, { status: 500, headers });
  }
}
