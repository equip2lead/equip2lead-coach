import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

async function embedText(text: string): Promise<number[] | null> {
  try {
    const res = await fetch('https://api.voyageai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.VOYAGE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'voyage-multilingual-2',
        input: [text.slice(0, 2000)],
        input_type: 'query',
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data?.[0]?.embedding ?? null;
  } catch {
    return null;
  }
}

async function getCoachingContext(
  userMessage: string,
  trackId: string | null,
  language: string,
  supabase: any
): Promise<{ contextBlock: string; quality: 'strong' | 'weak' | 'none' }> {
  if (!trackId || !process.env.VOYAGE_API_KEY) {
    return { contextBlock: '', quality: 'none' };
  }
  const embedding = await embedText(userMessage);
  if (!embedding) return { contextBlock: '', quality: 'none' };

  const { data: docs, error } = await supabase.rpc('match_documents', {
    query_embedding: embedding,
    match_threshold: 0.62,
    match_count: 5,
    filter_track_id: trackId,
    filter_language: language,
  });

  let finalDocs = docs;
  let finalError = error;

  // If no results within the user's track, search across all tracks
  if (finalError || !finalDocs?.length) {
    const { data: crossDocs, error: crossError } = await supabase.rpc('match_documents', {
      query_embedding: embedding,
      match_threshold: 0.62,
      match_count: 5,
      filter_track_id: null,
      filter_language: language,
    });
    finalDocs = crossDocs;
    finalError = crossError;
  }

  if (finalError || !finalDocs?.length) {
    try {
      await supabase.rpc('upsert_knowledge_gap', {
        p_track_id: trackId,
        p_query: userMessage.slice(0, 500),
        p_similarity: 0,
        p_suggested_topic: userMessage.slice(0, 100),
      });
    } catch {}
    return { contextBlock: '', quality: 'none' };
  }

  const topScore: number = finalDocs[0].similarity;
  const quality: 'strong' | 'weak' | 'none' =
    topScore > 0.75 ? 'strong' : topScore > 0.62 ? 'weak' : 'none';

  if (quality === 'weak') {
    try {
      await supabase.rpc('upsert_knowledge_gap', {
        p_track_id: trackId,
        p_query: userMessage.slice(0, 500),
        p_similarity: topScore,
        p_suggested_topic: userMessage.slice(0, 100),
      });
    } catch {}
  }

  const contextBlock = `
RELEVANT KNOWLEDGE BASE CONTENT:
${finalDocs.map((doc: any, i: number) => `
[${i + 1}] "${doc.title}" — ${doc.sub_domain}
${doc.content.slice(0, 500)}
`).join('\n---\n')}
`;

  return { contextBlock, quality };
}

export async function POST(req: NextRequest) {
  try {
    const { messages, context } = await req.json();
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    let contextBlock = '';
    let quality: 'strong' | 'weak' | 'none' = 'none';
    let memoryContext = '';

    const hasSupabase = process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.NEXT_PUBLIC_SUPABASE_URL;
    const canDoRag = hasSupabase && process.env.VOYAGE_API_KEY;

    if (hasSupabase) {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      // RAG lookup
      if (canDoRag) {
        try {
          const lastUserMessage = [...messages]
            .reverse()
            .find((m: any) => m.role === 'user')?.content || '';

          const ragResult = await getCoachingContext(
            lastUserMessage,
            context?.trackId || null,
            context?.lang || 'en',
            supabase
          );
          contextBlock = ragResult.contextBlock;
          quality = ragResult.quality;
        } catch (ragError) {
          console.warn('RAG lookup failed, continuing without knowledge base:', ragError);
        }
      }

      // Cross-session memory
      if (context?.journeyId) {
        try {
          const { data: memData } = await supabase.rpc('get_coaching_memory_context', {
            p_journey_id: context.journeyId,
            p_max_memories: 10
          });
          memoryContext = memData || '';
        } catch {}
      }
    }

    const systemPrompt = buildSystemPrompt(context, contextBlock, quality, memoryContext);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-beta': 'prompt-caching-2024-07-31',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        system: [
          {
            type: 'text',
            text: systemPrompt,
            cache_control: { type: 'ephemeral' },
          },
        ],
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

    return NextResponse.json({ reply, _rag: { quality, docsFound: !!contextBlock } });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function buildSystemPrompt(context: any, contextBlock: string, quality: 'strong' | 'weak' | 'none', memoryContext: string = ''): string {
  const { trackName, trackNameFr, trackId, pillarScores, focusAreas, coachLensSummary, preAssessment, userName, lang } = context || {};

  const displayTrack = lang === 'fr' ? (trackNameFr || trackName) : (trackName || 'Leadership Coaching');

  let scoresSection = '';
  if (pillarScores && pillarScores.length > 0) {
    scoresSection = `\n\nUSER'S ASSESSMENT RESULTS:\n` +
      pillarScores.map((p: any) => `- ${p.name}: ${p.score}/5.00${p.subScores ? ' (' + Object.entries(p.subScores).map(([k, v]) => `${k}: ${v}`).join(', ') + ')' : ''}`).join('\n');
  }

  let focusSection = '';
  if (focusAreas && focusAreas.length > 0) {
    focusSection = `\n\nTOP FOCUS AREAS (weakest dimensions):\n` +
      focusAreas.map((f: any, i: number) => `${i + 1}. ${f.name || f} (Score: ${f.score || 'N/A'})`).join('\n');
  }

  let preSection = '';
  if (preAssessment && typeof preAssessment === 'object') {
    const entries = Object.entries(preAssessment)
      .filter(([_, v]: any) => v?.answer !== undefined)
      .map(([_, v]: any) => `- ${v.question}: ${typeof v.answer === 'object' ? JSON.stringify(v.answer) : v.answer}`);
    if (entries.length > 0) {
      preSection = `\n\nUSER'S CONTEXT (from intake):\n` + entries.join('\n');
    }
  }

  const ragInstruction = {
    strong: `Strong matches found in the knowledge base above. Ground your response directly in these documents. Reference the specific frameworks and authors by name (e.g. "According to the 5 Languages of Love...", "The E-Myth principle shows...", "Gottman's research on the 4 Horsemen...").`,
    weak: `Partial matches found. Use the documents as background context and supplement with your broader coaching wisdom. Stay within the ${displayTrack} framework.`,
    none: `No specific knowledge base match for this query. Respond using Dr. Denis Ekobena's coaching methodology — the 5-pillar framework, biblical integration where relevant, and African leadership context.`,
  }[quality];

  const langInstruction = lang === 'fr' ? '\n\nIMPORTANT: The user speaks French. Respond entirely in French.' : '';

  return `You are the Equip2Lead AI Coach, a warm, insightful, and action-oriented coaching assistant created by Dr. Denis Ekobena. You provide personalized coaching based on the Equip2Lead framework.

YOUR COACHING PHILOSOPHY (Dr. Ekobena's Framework):
- Diagnose first, coach second — every recommendation must be rooted in the user's actual assessment data
- Growth happens through self-awareness, intentional practice, and accountability
- Meet people where they are — no judgment, only forward movement
- Combine biblical wisdom with practical frameworks when appropriate
- Focus on the person's top 3 weakest areas — that's where transformation begins
- Every session should end with a clear action step

YOUR ROLE:
- You are a holistic life coach covering leadership, marriage, ministry, entrepreneurship and personal development. Answer questions across all these domains — do not redirect users away from personal or relationship questions. The user's current track is their primary focus but you can draw from all coaching domains.
- Reference the user's specific scores and assessment data in your responses
- Be direct but compassionate — like a trusted mentor
- Ask powerful coaching questions that provoke self-reflection
- Provide specific, actionable advice — not vague platitudes
- When appropriate, suggest exercises, templates, or frameworks

USER'S PROFILE:
- Name: ${userName || 'User'}
- Track: ${displayTrack}${scoresSection}${focusSection}${preSection}

${coachLensSummary ? `\nCOACH LENS SUMMARY:\n${coachLensSummary}` : ''}

${memoryContext ? `\nCOACHING HISTORY FROM PREVIOUS SESSIONS:\n${memoryContext}` : ''}

${contextBlock ? contextBlock : ''}

KNOWLEDGE BASE INSTRUCTION: ${ragInstruction}

CONVERSATION GUIDELINES:
- Start by acknowledging what you know about them from their assessment
- Reference specific scores when giving advice (e.g., "Your self-awareness score of 2.8 suggests...")
- Suggest one clear action step per response
- Keep responses focused and under 300 words unless they ask for more detail
- Use their name naturally in conversation
- If they ask about something outside your coaching scope, gently redirect
- If this is the first message, welcome them warmly and summarize what you see in their assessment data${langInstruction}`;
}
