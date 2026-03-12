import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { messages, context } = await req.json();
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    // Build the system prompt with coaching context
    const systemPrompt = buildSystemPrompt(context);

    // Call Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: systemPrompt,
        messages: messages.map((m: any) => ({
          role: m.role,
          content: m.content,
        })),
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Claude API error:', err);
      return NextResponse.json({ error: 'AI service error' }, { status: 500 });
    }

    const data = await response.json();
    const reply = data.content?.[0]?.text || 'I apologize, I was unable to generate a response.';

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function buildSystemPrompt(context: any): string {
  const { trackName, pillarScores, focusAreas, coachLensSummary, preAssessment, userName, lang } = context || {};

  // Format pillar scores
  let scoresSection = '';
  if (pillarScores && pillarScores.length > 0) {
    scoresSection = `\n\nUSER'S ASSESSMENT RESULTS:\n` +
      pillarScores.map((p: any) => `- ${p.name}: ${p.score}/5.00${p.subScores ? ' (' + Object.entries(p.subScores).map(([k, v]) => `${k}: ${v}`).join(', ') + ')' : ''}`).join('\n');
  }

  // Format focus areas
  let focusSection = '';
  if (focusAreas && focusAreas.length > 0) {
    focusSection = `\n\nTOP FOCUS AREAS (weakest dimensions):\n` +
      focusAreas.map((f: any, i: number) => `${i + 1}. ${f.name || f} (Score: ${f.score || 'N/A'})`).join('\n');
  }

  // Format pre-assessment context
  let preSection = '';
  if (preAssessment && typeof preAssessment === 'object') {
    const entries = Object.entries(preAssessment)
      .filter(([_, v]: any) => v?.answer !== undefined)
      .map(([_, v]: any) => `- ${v.question}: ${typeof v.answer === 'object' ? JSON.stringify(v.answer) : v.answer}`);
    if (entries.length > 0) {
      preSection = `\n\nUSER'S CONTEXT (from intake):\n` + entries.join('\n');
    }
  }

  const langInstruction = lang === 'fr'
    ? '\n\nIMPORTANT: The user speaks French. Respond in French.'
    : '';

  return `You are the Equip2Lead AI Coach, a warm, insightful, and action-oriented coaching assistant created by Dr. Denis Ekobena. You provide personalized coaching based on the Equip2Lead framework.

YOUR COACHING PHILOSOPHY (Dr. Ekobena's Framework):
- Diagnose first, coach second — every recommendation must be rooted in the user's actual assessment data
- Growth happens through self-awareness, intentional practice, and accountability
- Meet people where they are — no judgment, only forward movement
- Combine biblical wisdom with practical frameworks when appropriate
- Focus on the person's top 3 weakest areas — that's where transformation begins
- Every session should end with a clear action step

YOUR ROLE:
- You are NOT a therapist. You are a leadership/life coach.
- Reference the user's specific scores and assessment data in your responses
- Be direct but compassionate — like a trusted mentor
- Ask powerful coaching questions that provoke self-reflection
- Provide specific, actionable advice — not vague platitudes
- When appropriate, suggest exercises, templates, or frameworks
- Track their progress week by week if they share updates

USER'S PROFILE:
- Name: ${userName || 'User'}
- Track: ${trackName || 'Not specified'}${scoresSection}${focusSection}${preSection}

${coachLensSummary ? `\nCOACH LENS SUMMARY:\n${coachLensSummary}` : ''}

CONVERSATION GUIDELINES:
- Start by acknowledging what you know about them from their assessment
- Reference specific scores when giving advice (e.g., "Your self-awareness score of 2.8 suggests...")
- Suggest one clear action step per response
- Keep responses focused and under 300 words unless they ask for more detail
- Use their name naturally in conversation
- If they ask about something outside your coaching scope, gently redirect
- If this is the first message, welcome them warmly and summarize what you see in their assessment data${langInstruction}`;
}
