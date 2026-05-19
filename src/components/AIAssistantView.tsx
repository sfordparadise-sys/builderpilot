'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { createSupabaseClient } from '@/lib/supabase';
import {
  Bot, Mic, MicOff, Send, Loader2, Sparkles, BookOpen,
  Mail, ClipboardCheck, AlertCircle, Copy, Check, Save,
  ChevronDown, ChevronUp,
} from 'lucide-react';

type Role = 'user' | 'assistant';
type Msg = { role: Role; content: string; kind?: 'summary' | 'email' | 'prep' | 'log' | 'chat' };

type Unit = {
  id: string;
  block: string | null;
  lot_number: string | null;
  unit_number: string | null;
  model: string | null;
  closing_date: string | null;
  site_id: string;
};

const SYSTEM_PROMPT = `You are BuilderPilot's site-supervisor co-pilot. You are talking to a residential construction site supervisor on a phone, probably standing on a job site. Be concise. Use short paragraphs, bullets, or numbered lists. Use Canadian construction terminology where relevant (TARION, ESA, TSSA, OBC). Never invent data — if context doesn't include something the supervisor would need, say so plainly and suggest what they should add. Skip filler like "Sure!" or "Of course!". Lead with the answer.`;

const QUICK_ACTIONS = [
  {
    id: 'summary' as const,
    label: "Summarize today's site activity",
    icon: BookOpen,
    blurb: 'I pull recent daily log + open deficiencies and give you a wrap-up.',
  },
  {
    id: 'email' as const,
    label: 'Draft purchaser deficiency email',
    icon: Mail,
    blurb: 'Pick a unit. I draft a clean handoff email from its deficiency list.',
  },
  {
    id: 'prep' as const,
    label: 'Prep me for an inspection',
    icon: ClipboardCheck,
    blurb: 'Pick a unit + inspection type, I prep a focused checklist.',
  },
  {
    id: 'log' as const,
    label: 'Voice-to-text daily log',
    icon: Mic,
    blurb: 'Dictate. I clean it up. Save to daily log with one tap.',
  },
];

export default function AIAssistantView() {
  const supabase = useMemo(() => createSupabaseClient(), []);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [showActions, setShowActions] = useState(true);
  const [units, setUnits] = useState<Unit[]>([]);
  const [siteId, setSiteId] = useState<string | null>(null);
  const [picker, setPicker] = useState<null | {
    kind: 'email' | 'prep';
    title: string;
    extraField?: { label: string; placeholder: string; value: string };
  }>(null);
  const [recording, setRecording] = useState(false);
  const recognitionRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load units (for picker)
  useEffect(() => {
    let cancelled = false;
    async function load() {
      const { data: us } = await supabase
        .from('units')
        .select('id, block, lot_number, unit_number, model, closing_date, site_id')
        .order('block', { ascending: true })
        .order('lot_number', { ascending: true });
      if (!cancelled && us) {
        setUnits(us as Unit[]);
        if (us.length > 0) setSiteId(us[0].site_id);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [supabase]);

  // Auto-scroll on new message
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [msgs, busy]);

  async function callAI(payload: { system?: string; message: string; context?: string }) {
    setBusy(true);
    try {
      const r = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ system: SYSTEM_PROMPT, ...payload }),
      });
      const data = await r.json();
      if (!r.ok) {
        setMsgs((m) => [
          ...m,
          {
            role: 'assistant',
            content: `[error] ${data?.error || 'Unknown error'}\n${data?.detail || ''}`,
            kind: 'chat',
          },
        ]);
        return null;
      }
      return data.text as string;
    } catch (e: any) {
      setMsgs((m) => [
        ...m,
        { role: 'assistant', content: `[network error] ${e?.message || e}`, kind: 'chat' },
      ]);
      return null;
    } finally {
      setBusy(false);
    }
  }

  async function runSummary() {
    if (!siteId) return;
    setShowActions(false);
    setMsgs((m) => [...m, { role: 'user', content: "Summarize today's site activity.", kind: 'summary' }]);

    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const [logRes, defRes] = await Promise.all([
      supabase
        .from('daily_log')
        .select('log_date, weather, temperature, manpower, deliveries, visitors, incidents, notes')
        .eq('site_id', siteId)
        .gte('created_at', since)
        .order('log_date', { ascending: false })
        .limit(10),
      supabase
        .from('deficiencies')
        .select('issue, location, trade, priority, status, due_date, unit_id')
        .eq('status', 'open')
        .order('created_at', { ascending: false })
        .limit(50),
    ]);

    const logRows = (logRes.data || []) as any[];
    const defRows = (defRes.data || []) as any[];
    const context = [
      `## Recent daily log entries (last 7 days, ${logRows.length}):`,
      logRows.length
        ? logRows
            .map(
              (l) =>
                `- ${l.log_date} | weather: ${l.weather || '—'} | manpower: ${l.manpower || '—'} | deliveries: ${l.deliveries || '—'} | notes: ${l.notes || '—'}`,
            )
            .join('\n')
        : '(no entries — supervisor has not logged this week)',
      '',
      `## Open deficiencies (${defRows.length}):`,
      defRows.length
        ? defRows
            .map(
              (d) =>
                `- [${d.priority}] ${d.trade || 'no trade'} — ${d.issue}${d.location ? ` @ ${d.location}` : ''}${d.due_date ? ` (due ${d.due_date})` : ''}`,
            )
            .join('\n')
        : '(none open)',
    ].join('\n');

    const text = await callAI({
      context,
      message:
        "Give me a 4-6 bullet summary of where the site stands today, what got done this week, and what's at risk. Then 2-3 short action items I should hit tomorrow.",
    });
    if (text) {
      setMsgs((m) => [...m, { role: 'assistant', content: text, kind: 'summary' }]);
    }
  }

  function openUnitPicker(kind: 'email' | 'prep') {
    setShowActions(false);
    setPicker({
      kind,
      title: kind === 'email' ? 'Pick a unit for the deficiency email' : 'Pick a unit to prep for inspection',
      extraField:
        kind === 'prep'
          ? { label: 'Inspection type', placeholder: 'e.g. Framing, Pre-Drywall, Final Building', value: '' }
          : undefined,
    });
  }

  async function runEmail(unit: Unit) {
    setMsgs((m) => [
      ...m,
      {
        role: 'user',
        content: `Draft a purchaser deficiency email for ${unit.block}/Lot ${unit.lot_number}.`,
        kind: 'email',
      },
    ]);
    const { data: defs } = await supabase
      .from('deficiencies')
      .select('issue, location, trade, priority, status, due_date')
      .eq('unit_id', unit.id)
      .order('priority', { ascending: false });

    const list = defs && defs.length
      ? (defs as any[])
          .map(
            (d) =>
              `- ${d.issue}${d.location ? ` (${d.location})` : ''}${d.trade ? ` — ${d.trade}` : ''} [${d.status}${d.due_date ? `, due ${d.due_date}` : ''}]`,
          )
          .join('\n')
      : '(no deficiencies logged for this unit yet)';

    const context = [
      `## Unit`,
      `- ${unit.block}/Lot ${unit.lot_number} (${unit.model || 'model TBD'})`,
      `- Unit #: ${unit.unit_number || '—'}`,
      `- Closing date: ${unit.closing_date || '—'}`,
      '',
      '## Deficiencies for this unit',
      list,
    ].join('\n');

    const text = await callAI({
      context,
      message:
        "Draft a short, professional email I can send the purchaser summarizing the open deficiencies and our next step on each. Sign as 'Stephen, Site Supervisor'. Plain text, no marketing fluff. If the deficiency list is empty, say so and offer to schedule the next walkthrough.",
    });
    if (text) setMsgs((m) => [...m, { role: 'assistant', content: text, kind: 'email' }]);
  }

  async function runPrep(unit: Unit, inspectionType: string) {
    setMsgs((m) => [
      ...m,
      {
        role: 'user',
        content: `Prep me for the ${inspectionType} inspection on ${unit.block}/Lot ${unit.lot_number}.`,
        kind: 'prep',
      },
    ]);

    const { data: stages } = await supabase
      .from('stage_progress')
      .select('stage_name, stage_group, status, completed_date, notes')
      .eq('unit_id', unit.id)
      .order('stage_order', { ascending: true });

    const stageList = stages && stages.length
      ? (stages as any[])
          .map((s) => `- [${s.status}] ${s.stage_name}${s.completed_date ? ` (done ${s.completed_date})` : ''}${s.notes ? ` — ${s.notes}` : ''}`)
          .join('\n')
      : '(no stage progress logged yet)';

    const context = [
      `## Unit`,
      `${unit.block}/Lot ${unit.lot_number} (${unit.model || 'model TBD'})`,
      '',
      `## Inspection`,
      `Type: ${inspectionType}`,
      '',
      '## Stage progress so far',
      stageList,
    ].join('\n');

    const text = await callAI({
      context,
      message:
        "Give me a focused pre-inspection checklist for this. Include: (1) what the inspector will likely check, (2) the 3-5 things most often missed for this inspection type, (3) any trade callbacks I should make tonight. Keep it under 250 words.",
    });
    if (text) setMsgs((m) => [...m, { role: 'assistant', content: text, kind: 'prep' }]);
  }

  async function sendChat() {
    const msg = input.trim();
    if (!msg) return;
    setInput('');
    setShowActions(false);
    setMsgs((m) => [...m, { role: 'user', content: msg, kind: 'chat' }]);
    const text = await callAI({ message: msg });
    if (text) setMsgs((m) => [...m, { role: 'assistant', content: text, kind: 'chat' }]);
  }

  function toggleVoice() {
    const SR: any =
      typeof window !== 'undefined' &&
      ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
    if (!SR) {
      alert('Voice input not supported in this browser. Try Safari on iOS or Chrome.');
      return;
    }
    if (recording) {
      try {
        recognitionRef.current?.stop();
      } catch {}
      setRecording(false);
      return;
    }
    const r = new SR();
    r.lang = 'en-CA';
    r.interimResults = true;
    r.continuous = true;
    let finalSoFar = input ? input + ' ' : '';
    r.onresult = (ev: any) => {
      let interim = '';
      for (let i = ev.resultIndex; i < ev.results.length; i++) {
        const res = ev.results[i];
        if (res.isFinal) finalSoFar += res[0].transcript + ' ';
        else interim += res[0].transcript;
      }
      setInput((finalSoFar + interim).replace(/\s+/g, ' '));
    };
    r.onerror = (ev: any) => {
      setRecording(false);
      if (ev?.error && ev.error !== 'aborted') {
        setMsgs((m) => [...m, { role: 'assistant', content: `[voice error] ${ev.error}`, kind: 'chat' }]);
      }
    };
    r.onend = () => setRecording(false);
    recognitionRef.current = r;
    r.start();
    setRecording(true);
  }

  async function saveAsDailyLog(text: string) {
    if (!siteId) {
      alert('No site loaded yet.');
      return;
    }
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from('daily_log').insert({
      site_id: siteId,
      log_date: new Date().toISOString().slice(0, 10),
      notes: text,
      voice_transcript: text,
      created_by: user?.id,
    });
    if (error) {
      alert(`Save failed: ${error.message}`);
      return;
    }
    setMsgs((m) => [
      ...m,
      { role: 'assistant', content: '✓ Saved to daily log.', kind: 'log' },
    ]);
  }

  return (
    <div className="space-y-4">
      {/* Hero */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded bg-ink border border-gold flex items-center justify-center shrink-0">
          <Bot className="text-gold" size={20} />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-white">
            Site<span className="text-gold"> Co-pilot</span>
          </h1>
          <p className="text-concrete text-sm">
            Voice in, clean output. Summaries, emails, inspection prep — pulled live from your site data.
          </p>
        </div>
      </div>

      {/* Quick actions */}
      <div className="card">
        <button
          onClick={() => setShowActions((s) => !s)}
          className="w-full flex items-center justify-between px-4 py-3 text-left"
        >
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-gold" />
            <span className="text-sm font-semibold text-white">Quick actions</span>
          </div>
          {showActions ? <ChevronUp size={16} className="text-concrete" /> : <ChevronDown size={16} className="text-concrete" />}
        </button>
        {showActions && (
          <div className="border-t border-ink-700 grid grid-cols-1 sm:grid-cols-2 gap-2 p-3">
            {QUICK_ACTIONS.map((a) => {
              const Icon = a.icon;
              return (
                <button
                  key={a.id}
                  onClick={() => {
                    if (a.id === 'summary') runSummary();
                    else if (a.id === 'email') openUnitPicker('email');
                    else if (a.id === 'prep') openUnitPicker('prep');
                    else if (a.id === 'log') {
                      setShowActions(false);
                      setInput('Cleanup this for the daily log: ');
                      if (!recording) toggleVoice();
                    }
                  }}
                  className="card p-3 text-left hover:border-gold/50 transition group"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Icon size={14} className="text-gold" />
                    <span className="text-sm font-semibold text-white group-hover:text-gold transition">
                      {a.label}
                    </span>
                  </div>
                  <div className="text-xs text-concrete">{a.blurb}</div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Unit picker overlay */}
      {picker && (
        <UnitPicker
          units={units}
          title={picker.title}
          extraFieldLabel={picker.extraField?.label}
          extraFieldPlaceholder={picker.extraField?.placeholder}
          requireExtra={picker.kind === 'prep'}
          onCancel={() => setPicker(null)}
          onConfirm={(u, extra) => {
            setPicker(null);
            if (picker.kind === 'email') runEmail(u);
            else if (picker.kind === 'prep') runPrep(u, extra || 'inspection');
          }}
        />
      )}

      {/* Conversation */}
      <div
        ref={scrollRef}
        className="card max-h-[55vh] overflow-y-auto p-3 space-y-3"
      >
        {msgs.length === 0 && !busy && (
          <div className="py-10 text-center text-concrete text-sm">
            Pick a quick action above or just ask. Try: "What inspections are on
            for next week?" or "Summarize today."
          </div>
        )}
        {msgs.map((m, i) => (
          <Bubble key={i} msg={m} onSaveAsLog={saveAsDailyLog} />
        ))}
        {busy && (
          <div className="flex items-center gap-2 text-concrete text-sm">
            <Loader2 size={14} className="animate-spin text-gold" />
            Thinking...
          </div>
        )}
      </div>

      {/* Input bar */}
      <div className="card p-2 flex items-end gap-2">
        <button
          onClick={toggleVoice}
          className={`shrink-0 w-10 h-10 rounded flex items-center justify-center transition border ${
            recording
              ? 'bg-gold text-ink border-gold animate-pulse'
              : 'bg-ink border-ink-700 text-concrete hover:text-white hover:border-ink-600'
          }`}
          aria-label={recording ? 'Stop dictating' : 'Start dictating'}
          title={recording ? 'Stop dictating' : 'Start dictating'}
        >
          {recording ? <MicOff size={16} /> : <Mic size={16} />}
        </button>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              sendChat();
            }
          }}
          rows={1}
          placeholder={recording ? 'Listening…' : 'Ask anything, or dictate…'}
          className="flex-1 resize-none bg-ink border border-ink-700 rounded px-3 py-2 text-sm text-white placeholder:text-concrete focus:border-gold/60 focus:outline-none max-h-32"
        />
        <button
          onClick={sendChat}
          disabled={busy || !input.trim()}
          className="shrink-0 btn-gold disabled:opacity-50 px-3 py-2 flex items-center gap-1.5"
        >
          {busy ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
          <span className="hidden sm:inline">Send</span>
        </button>
      </div>

      <div className="text-[10px] text-concrete">
        Powered by Anthropic. Set <span className="font-mono text-gold">ANTHROPIC_API_KEY</span> in Vercel to enable.
      </div>
    </div>
  );
}

function Bubble({
  msg,
  onSaveAsLog,
}: {
  msg: Msg;
  onSaveAsLog: (text: string) => void;
}) {
  const [copied, setCopied] = useState(false);
  const isUser = msg.role === 'user';
  const canSaveAsLog = !isUser && (msg.kind === 'summary' || msg.kind === 'log');
  async function copy() {
    try {
      await navigator.clipboard.writeText(msg.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[90%] rounded px-3 py-2 text-sm whitespace-pre-wrap ${
          isUser
            ? 'bg-gold/15 border border-gold/30 text-white'
            : 'bg-ink border border-ink-700 text-white'
        }`}
      >
        {msg.content}
        {!isUser && msg.content.length > 40 && (
          <div className="mt-2 pt-2 border-t border-ink-700 flex flex-wrap gap-2">
            <button
              onClick={copy}
              className="text-[11px] text-concrete hover:text-gold flex items-center gap-1"
            >
              {copied ? <Check size={11} /> : <Copy size={11} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
            {canSaveAsLog && (
              <button
                onClick={() => onSaveAsLog(msg.content)}
                className="text-[11px] text-concrete hover:text-gold flex items-center gap-1"
              >
                <Save size={11} />
                Save as daily log
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function UnitPicker({
  units,
  title,
  extraFieldLabel,
  extraFieldPlaceholder,
  requireExtra,
  onCancel,
  onConfirm,
}: {
  units: Unit[];
  title: string;
  extraFieldLabel?: string;
  extraFieldPlaceholder?: string;
  requireExtra?: boolean;
  onCancel: () => void;
  onConfirm: (u: Unit, extra?: string) => void;
}) {
  const [selected, setSelected] = useState<Unit | null>(null);
  const [extra, setExtra] = useState('');
  const [filter, setFilter] = useState('');

  const visible = units.filter((u) => {
    if (!filter.trim()) return true;
    const q = filter.toLowerCase();
    return (
      u.block?.toLowerCase().includes(q) ||
      u.lot_number?.toLowerCase().includes(q) ||
      u.unit_number?.toLowerCase().includes(q) ||
      u.model?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative card w-full max-w-md p-4 max-h-[80vh] flex flex-col">
        <div className="text-[10px] text-gold uppercase tracking-widest">Pick a unit</div>
        <h3 className="text-lg font-bold text-white mt-0.5">{title}</h3>

        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter by block, lot, model..."
          className="mt-3 bg-ink border border-ink-700 rounded px-3 py-2 text-sm text-white placeholder:text-concrete focus:border-gold/60 focus:outline-none"
        />

        <div className="mt-3 flex-1 overflow-y-auto -mx-1 px-1">
          {visible.length === 0 ? (
            <div className="text-concrete text-sm py-6 text-center">No units match.</div>
          ) : (
            visible.map((u) => (
              <button
                key={u.id}
                onClick={() => setSelected(u)}
                className={`w-full text-left p-2 rounded border mb-1 transition ${
                  selected?.id === u.id
                    ? 'border-gold bg-gold/10'
                    : 'border-ink-700 hover:border-ink-600'
                }`}
              >
                <div className="font-mono text-sm text-white">
                  {u.block} / Lot {u.lot_number}
                </div>
                <div className="text-xs text-concrete">
                  {u.model || '—'} {u.unit_number ? `• #${u.unit_number}` : ''}
                </div>
              </button>
            ))
          )}
        </div>

        {extraFieldLabel && (
          <div className="mt-3">
            <div className="text-[10px] text-concrete uppercase tracking-widest mb-1">
              {extraFieldLabel}
            </div>
            <input
              value={extra}
              onChange={(e) => setExtra(e.target.value)}
              placeholder={extraFieldPlaceholder}
              className="w-full bg-ink border border-ink-700 rounded px-3 py-2 text-sm text-white placeholder:text-concrete focus:border-gold/60 focus:outline-none"
            />
          </div>
        )}

        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onCancel} className="btn-ghost">
            Cancel
          </button>
          <button
            onClick={() => selected && onConfirm(selected, extra)}
            disabled={!selected || (requireExtra && !extra.trim())}
            className="btn-gold disabled:opacity-50"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
