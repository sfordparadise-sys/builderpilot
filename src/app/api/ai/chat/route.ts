// BuilderPilot — Anthropic proxy
// POST /api/ai/chat
//   body: { system?: string, message: string, context?: string, model?: string, max_tokens?: number }
//   returns: { text: string, usage?: any } or { error, detail? }

import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const DEFAULT_MODEL = 'claude-sonnet-4-6';
const DEFAULT_MAX_TOKENS = 1024;

export async function POST(req: NextRequest) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    return NextResponse.json(
      {
        error:
          'ANTHROPIC_API_KEY is not configured. Add it in Vercel → Project Settings → Environment Variables.',
      },
      { status: 500 },
    );
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON in request body.' }, { status: 400 });
  }

  const {
    system,
    message,
    context,
    model = DEFAULT_MODEL,
    max_tokens = DEFAULT_MAX_TOKENS,
  } = body || {};

  if (!message || typeof message !== 'string') {
    return NextResponse.json(
      { error: '`message` (string) is required.' },
      { status: 400 },
    );
  }

  const userContent = context ? `${context}\n\n---\n\n${message}` : message;

  let upstream: Response;
  try {
    upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model,
        max_tokens,
        system,
        messages: [{ role: 'user', content: userContent }],
      }),
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: 'Network error reaching Anthropic API.', detail: String(e?.message || e) },
      { status: 502 },
    );
  }

  if (!upstream.ok) {
    const text = await upstream.text();
    return NextResponse.json(
      {
        error: `Anthropic API error (${upstream.status})`,
        detail: text.slice(0, 1000),
      },
      { status: 502 },
    );
  }

  const data = (await upstream.json()) as any;
  const text: string =
    Array.isArray(data?.content)
      ? data.content
          .filter((c: any) => c?.type === 'text')
          .map((c: any) => c.text)
          .join('\n')
      : '';

  return NextResponse.json({ text, usage: data?.usage, model: data?.model });
}
