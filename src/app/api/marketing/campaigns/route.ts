// BuilderPilot — MailerLite campaign stats proxy
// GET /api/marketing/campaigns
// Returns last 10 sent campaigns with open/click rates.
// Requires MAILERLITE_API_KEY in environment variables.

import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET() {
  const key = process.env.MAILERLITE_API_KEY;
  if (!key) {
    return NextResponse.json({ error: 'MAILERLITE_API_KEY not configured.' });
  }

  let res: Response;
  try {
    res = await fetch('https://connect.mailerlite.com/api/campaigns?limit=10&filter[status]=sent', {
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: `Network error: ${e?.message || e}` });
  }

  if (!res.ok) {
    return NextResponse.json({ error: `MailerLite API error (${res.status})` });
  }

  const data = (await res.json()) as any;
  const campaigns = (data.data || []).map((c: any) => ({
    id: c.id,
    name: c.name,
    status: c.status,
    sent: c.stats?.sent ?? null,
    open_rate: c.stats?.open_rate != null ? Math.round(c.stats.open_rate * 10) / 10 : null,
    click_rate: c.stats?.click_rate != null ? Math.round(c.stats.click_rate * 10) / 10 : null,
  }));

  return NextResponse.json({ campaigns });
}
