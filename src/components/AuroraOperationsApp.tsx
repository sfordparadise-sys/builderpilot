'use client';

import { useEffect, useMemo, useState } from 'react';
import { createSupabaseClient } from '@/lib/supabase';
import { STAGES, INSPECTION_TYPES } from '@/lib/constants';
import {
  Activity, AlertTriangle, BarChart2, Building2, Calendar, Camera, CheckCircle2,
  ClipboardCheck, ClipboardList, Home, Loader2, LogOut, Mail, Menu, Plus,
  Search, ShieldCheck, TrendingUp, User, X
} from 'lucide-react';

type Tab = 'dashboard' | 'units' | 'progress' | 'deficiencies' | 'daily' | 'inspections' | 'marketing';

type Props = {
  profile: any;
  user: any;
  onSignOut: () => void;
};

const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: Activity },
  { id: 'units', label: 'Units', icon: Home },
  { id: 'progress', label: 'Grid', icon: TrendingUp },
  { id: 'deficiencies', label: 'Deficiencies', icon: AlertTriangle },
  { id: 'daily', label: 'Daily Log', icon: ClipboardList },
  { id: 'inspections', label: 'Inspections', icon: ClipboardCheck },
  { id: 'marketing', label: 'Marketing', icon: BarChart2 },
] as const;

const priorityRank: Record<string, number> = { P1: 1, P2: 2, P3: 3, P4: 4 };

function unitLabel(unit: any) {
  if (unit?.lot) return unit.lot;
  const block = unit?.block ? `B${String(unit.block).replace(/^B/i, '')}` : 'B?';
  const lot = unit?.lot_number || unit?.unit_number || '?';
  return `${block} u${lot}`;
}

function normalizeStatus(status?: string) {
  if (!status) return 'Outstanding';
  if (status === 'active') return 'In Progress';
  if (status === 'closed') return 'Completed';
  return status;
}

export default function AuroraOperationsApp({ profile, user, onSignOut }: Props) {
  const supabase = createSupabaseClient();
  const [tab, setTab] = useState<Tab>('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [units, setUnits] = useState<any[]>([]);
  const [deficiencies, setDeficiencies] = useState<any[]>([]);
  const [dailyLog, setDailyLog] = useState<any[]>([]);
  const [inspections, setInspections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const canEdit = ['admin', 'supervisor', 'foreman'].includes(profile?.role || 'supervisor');

  async function loadAll() {
    setLoading(true);
    setError(null);
    await Promise.all([loadUnits(), loadDeficiencies(), loadDailyLog(), loadInspections()]);
    setLoading(false);
  }

  async function loadUnits() {
    const { data, error } = await supabase.from('units').select('*').order('block', { ascending: true });
    if (error) setError(error.message);
    else setUnits(data || []);
  }

  async function loadDeficiencies() {
    const { data, error } = await supabase.from('deficiencies').select('*').order('created_at', { ascending: false });
    if (!error) setDeficiencies(data || []);
  }

  async function loadDailyLog() {
    const old = await supabase.from('daily_log').select('*').order('log_date', { ascending: false }).limit(100);
    if (!old.error) { setDailyLog(old.data || []); return; }
    const newer = await supabase.from('daily_logs').select('*').order('log_date', { ascending: false }).limit(100);
    if (!newer.error) setDailyLog(newer.data || []);
  }

  async function loadInspections() {
    const { data, error } = await supabase.from('inspections').select('*').order('created_at', { ascending: false }).limit(250);
    if (!error) setInspections(data || []);
  }

  useEffect(() => { loadAll(); }, []);

  useEffect(() => {
    const channel = supabase
      .channel('builderpilot-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'units' }, loadUnits)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'deficiencies' }, loadDeficiencies)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'daily_log' }, loadDailyLog)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'daily_logs' }, loadDailyLog)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'inspections' }, loadInspections)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <div className="min-h-screen bg-[#111827] text-slate-100">
      <header className="sticky top-0 z-40 border-b border-slate-700 bg-slate-950/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="md:hidden p-2 rounded bg-slate-900 border border-slate-700"><Menu size={18} /></button>
            <div className="h-10 w-10 rounded-lg border border-amber-400/60 bg-slate-900 flex items-center justify-center"><Building2 className="text-amber-400" size={20} /></div>
            <div>
              <div className="font-black tracking-tight text-lg">Builder<span className="text-amber-400">Pilot</span></div>
              <div className="text-[10px] uppercase tracking-widest text-slate-400">Aurora Trails · Site Management</div>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-1">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setTab(id)} className={`px-3 py-2 rounded text-sm font-medium flex items-center gap-2 ${tab === id ? 'bg-amber-400 text-slate-950' : 'text-slate-300 hover:bg-slate-800'}`}>
                <Icon size={15} />{label}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <div className="hidden lg:flex items-center gap-2 text-xs bg-slate-900 border border-slate-700 rounded px-2 py-1">
              <User size={12} /><span>{profile?.full_name || profile?.name || user?.email}</span><span className="text-amber-400 uppercase">{profile?.role || 'supervisor'}</span>
            </div>
            <button onClick={onSignOut} className="p-2 rounded hover:bg-slate-800" title="Sign out"><LogOut size={17} /></button>
          </div>
        </div>
      </header>

      {mobileOpen && <MobileDrawer tab={tab} setTab={setTab} close={() => setMobileOpen(false)} />}

      <main className="mx-auto max-w-7xl px-4 py-6 pb-24 md:pb-6">
        {error && <div className="mb-4 rounded border border-red-800 bg-red-950/50 p-3 text-sm text-red-200">{error}</div>}
        {loading ? <Loading /> : (
          <>
            {tab === 'dashboard' && <Dashboard units={units} deficiencies={deficiencies} dailyLog={dailyLog} setTab={setTab} />}
            {tab === 'units' && <UnitsPanel units={units} canEdit={canEdit} reload={loadUnits} />}
            {tab === 'progress' && <ProgressPanel units={units} canEdit={canEdit} reload={loadUnits} />}
            {tab === 'deficiencies' && <DeficienciesPanel units={units} deficiencies={deficiencies} canEdit={canEdit} reload={loadDeficiencies} userId={user?.id} />}
            {tab === 'daily' && <DailyLogPanel units={units} dailyLog={dailyLog} canEdit={canEdit} reload={loadDailyLog} userId={user?.id} />}
            {tab === 'inspections' && <InspectionsPanel units={units} inspections={inspections} canEdit={canEdit} reload={loadInspections} />}
            {tab === 'marketing' && <MarketingPanel units={units} />}
          </>
        )}
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950 border-t border-slate-700 flex overflow-x-auto">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setTab(id)} className={`flex-1 min-w-[52px] py-2 flex flex-col items-center gap-1 text-[10px] ${tab === id ? 'text-amber-400' : 'text-slate-400'}`}>
            <Icon size={18} /><span>{label.split(' ')[0]}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

function MobileDrawer({ tab, setTab, close }: any) {
  return <div className="fixed inset-0 z-50 md:hidden"><div className="absolute inset-0 bg-black/70" onClick={close} /><aside className="relative h-full w-72 bg-slate-950 border-r border-slate-700 p-4"><div className="flex justify-between items-center mb-4"><div className="font-bold">Navigation</div><button onClick={close}><X size={20} /></button></div>{tabs.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => { setTab(id); close(); }} className={`w-full flex items-center gap-3 px-3 py-3 rounded text-sm ${tab === id ? 'bg-amber-400 text-slate-950' : 'text-slate-300 hover:bg-slate-800'}`}><Icon size={16} />{label}</button>)}</aside></div>;
}

function Dashboard({ units, deficiencies, dailyLog, setTab }: any) {
  const openDefs = deficiencies.filter((d: any) => !['closed', 'complete', 'Completed'].includes(d.status)).length;
  const p1 = deficiencies.filter((d: any) => d.priority === 'P1' && !['closed', 'complete', 'Completed'].includes(d.status)).length;
  const sold = units.filter((u: any) => u.closing_date).length;
  const latest = dailyLog.slice(0, 4);
  return <div className="space-y-6"><PageTitle title="Site Dashboard" subtitle="Aurora Trails 2026 · field operations command centre" />
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3"><Kpi label="Units" value={units.length} icon={Home} onClick={() => setTab('units')} /><Kpi label="Sold" value={sold} icon={Calendar} /><Kpi label="Open Defs" value={openDefs} icon={AlertTriangle} danger={openDefs > 0} onClick={() => setTab('deficiencies')} /><Kpi label="P1 Critical" value={p1} icon={ShieldCheck} danger={p1 > 0} /></div>
    <div className="grid lg:grid-cols-3 gap-4"><Card title="Block Snapshot" icon={Building2} className="lg:col-span-2"><BlockGrid units={units} /></Card><Card title="Latest Daily Notes" icon={ClipboardList}>{latest.length ? latest.map((l: any) => <MiniLog key={l.id} log={l} />) : <Empty text="No daily log entries yet." />}</Card></div>
    <Card title="Top Priorities" icon={AlertTriangle}>{deficiencies.filter((d: any) => !['closed','complete','Completed'].includes(d.status)).sort((a: any, b: any) => (priorityRank[a.priority] || 9) - (priorityRank[b.priority] || 9)).slice(0, 6).map((d: any) => <IssueRow key={d.id} d={d} />)}</Card>
  </div>;
}

function UnitsPanel({ units, canEdit, reload }: any) {
  const supabase = createSupabaseClient();
  const [q, setQ] = useState('');
  const [block, setBlock] = useState('all');
  const [editing, setEditing] = useState<any | null>(null);
  const filtered = units.filter((u: any) => (block === 'all' || String(u.block).replace(/^B/i,'') === block) && unitLabel(u).toLowerCase().includes(q.toLowerCase()));
  async function save() {
    const update = { status: editing.status, model: editing.model, closing_date: editing.closing_date || null, purchaser_notes: editing.purchaser_notes || editing.purchaser || null };
    const { error } = await supabase.from('units').update(update).eq('id', editing.id);
    if (error) alert(error.message); else { setEditing(null); reload(); }
  }
  return <div className="space-y-4"><PageTitle title="Units" subtitle="Lot-by-lot view with closing, status, model and field notes." /><Toolbar q={q} setQ={setQ} block={block} setBlock={setBlock} />
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">{filtered.map((u: any) => <button key={u.id} onClick={() => setEditing(u)} className="card-dark text-left p-4 hover:border-amber-400/60"><div className="flex justify-between gap-2"><div><div className="text-xl font-black text-white">{unitLabel(u)}</div><div className="text-xs text-slate-400">{u.model || 'Model TBD'} {u.product ? `· ${u.product}` : ''}</div></div><Pill text={normalizeStatus(u.status)} /></div><div className="mt-3 text-xs text-slate-300 space-y-1"><div>Stage: {u.current_stage || 'Not set'}</div><div>Trade: {u.trade || '—'}</div>{u.closing_date && <div className="text-green-300">Closing: {u.closing_date}</div>}</div></button>)}</div>
    {editing && <Modal title={`Edit ${unitLabel(editing)}`} close={() => setEditing(null)}><div className="space-y-3"><Input label="Status" value={editing.status || ''} onChange={(v: string) => setEditing({ ...editing, status: v })} /><Input label="Model" value={editing.model || ''} onChange={(v: string) => setEditing({ ...editing, model: v })} /><Input label="Closing Date" type="date" value={editing.closing_date || ''} onChange={(v: string) => setEditing({ ...editing, closing_date: v })} /><TextArea label="Notes" value={editing.purchaser_notes || editing.purchaser || ''} onChange={(v: string) => setEditing({ ...editing, purchaser_notes: v })} /><button disabled={!canEdit} onClick={save} className="btn-primary w-full">Save Unit</button></div></Modal>}
  </div>;
}

function ProgressPanel({ units, canEdit, reload }: any) {
  const supabase = createSupabaseClient();
  const [group, setGroup] = useState<'rough' | 'finishing' | 'pdo'>('rough');
  const [unitId, setUnitId] = useState(units[0]?.id || '');
  const unit = units.find((u: any) => u.id === unitId) || units[0];
  const stages = STAGES.filter((s: any) => s.group === group || (group === 'rough' && !s.group)).slice(0, group === 'rough' ? 37 : undefined);
  async function toggle(stage: string) {
    if (!unit || !canEdit) return;
    const progress = { ...(unit.progress || {}) };
    const current = progress[stage];
    if (!current) progress[stage] = { status: 'in-progress', date: new Date().toISOString().slice(0,10) };
    else if (current.status === 'in-progress') progress[stage] = { ...current, status: 'complete', completed: new Date().toISOString().slice(0,10) };
    else delete progress[stage];
    const { error } = await supabase.from('units').update({ progress }).eq('id', unit.id);
    if (error) alert('Progress save failed. Confirm the units.progress column exists. ' + error.message); else reload();
  }
  return <div className="space-y-4"><PageTitle title="Progress Grid" subtitle="The old working rough / finishing / PDO grid restored in a cleaner BuilderPilot shell." /><div className="flex flex-wrap gap-2"><Select value={group} onChange={setGroup} options={[['rough','Rough'],['finishing','Finishing'],['pdo','PDO / Closing']]} /><Select value={unit?.id || ''} onChange={setUnitId} options={units.map((u: any) => [u.id, unitLabel(u)])} /></div><div className="card-dark overflow-hidden"><div className="grid grid-cols-12 gap-2 px-4 py-2 text-[10px] uppercase tracking-widest text-slate-400 bg-slate-950"><div className="col-span-6">Stage</div><div className="col-span-2">Trade</div><div className="col-span-2">Status</div><div className="col-span-2 text-right">Action</div></div>{stages.map((s: any) => { const p = unit?.progress?.[s.stage]; const status = p?.status || (p ? 'complete' : 'open'); return <div key={s.stage} className="grid grid-cols-12 gap-2 px-4 py-3 border-t border-slate-700 text-sm"><div className="col-span-6 text-white">{s.stage}</div><div className="col-span-2 text-slate-400">{s.trade}</div><div className="col-span-2"><Pill text={status} /></div><div className="col-span-2 text-right"><button onClick={() => toggle(s.stage)} className="text-amber-300 hover:underline">Toggle</button></div></div> })}</div></div>;
}

function DeficienciesPanel({ units, deficiencies, canEdit, reload, userId }: any) {
  const supabase = createSupabaseClient();
  const [form, setForm] = useState({ unit_id: '', issue: '', trade: '', priority: 'P2', due_date: '', notes: '' });
  async function add() {
    if (!form.issue.trim()) return;
    const unit = units.find((u: any) => u.id === form.unit_id);
    const payload: any = { unit_id: form.unit_id || null, block: unit?.block || null, lot_number: unit?.lot_number || unit?.unit_number || null, issue: form.issue, trade: form.trade, priority: form.priority, status: 'open', due_date: form.due_date || null, notes: form.notes, created_by: userId || null };
    const { error } = await supabase.from('deficiencies').insert(payload);
    if (error) alert(error.message); else { setForm({ unit_id: '', issue: '', trade: '', priority: 'P2', due_date: '', notes: '' }); reload(); }
  }
  async function close(id: string) { const { error } = await supabase.from('deficiencies').update({ status: 'closed', completed_date: new Date().toISOString().slice(0,10) }).eq('id', id); if (error) alert(error.message); else reload(); }
  return <div className="space-y-4"><PageTitle title="Deficiencies" subtitle="Fast field issue capture with priority, trade, due date and closeout." />{canEdit && <Card title="Add Deficiency" icon={Plus}><div className="grid md:grid-cols-6 gap-2"><Select value={form.unit_id} onChange={(v: string) => setForm({ ...form, unit_id: v })} options={[[ '', 'No unit' ], ...units.map((u: any) => [u.id, unitLabel(u)])]} /><Input placeholder="Issue" value={form.issue} onChange={(v: string) => setForm({ ...form, issue: v })} /><Input placeholder="Trade" value={form.trade} onChange={(v: string) => setForm({ ...form, trade: v })} /><Select value={form.priority} onChange={(v: string) => setForm({ ...form, priority: v })} options={['P1','P2','P3','P4'].map(p => [p,p])} /><Input type="date" value={form.due_date} onChange={(v: string) => setForm({ ...form, due_date: v })} /><button onClick={add} className="btn-primary">Add</button></div></Card>}<div className="card-dark overflow-hidden">{deficiencies.map((d: any) => <div key={d.id} className="grid md:grid-cols-12 gap-2 p-4 border-b border-slate-700 last:border-b-0"><div className="md:col-span-2 font-mono text-white">{d.lot || (d.block ? `B${d.block} u${d.lot_number || ''}` : 'Site')}</div><div className="md:col-span-4 text-white">{d.issue}</div><div className="md:col-span-2 text-slate-400">{d.trade || '—'}</div><div className="md:col-span-1"><Pill text={d.priority || 'P3'} /></div><div className="md:col-span-2"><Pill text={d.status || 'open'} /></div><div className="md:col-span-1 text-right">{canEdit && !['closed','complete','Completed'].includes(d.status) && <button onClick={() => close(d.id)} className="text-green-300 hover:underline">Close</button>}</div></div>)}</div></div>;
}

function DailyLogPanel({ units, dailyLog, canEdit, reload, userId }: any) {
  const supabase = createSupabaseClient();
  const [form, setForm] = useState({ lot: '', trade: '', priority: 'P3', update_text: '', next_action: '', status: 'Outstanding' });
  async function add() {
    if (!form.update_text.trim()) return;
    const oldPayload = { ...form, foreman: '', log_date: new Date().toISOString().slice(0,10) };
    let res = await supabase.from('daily_log').insert(oldPayload);
    if (res.error) res = await supabase.from('daily_logs').insert({ log_date: new Date().toISOString().slice(0,10), work_completed: form.update_text, tomorrow_focus: form.next_action, issues: form.trade, summary: `${form.priority} - ${form.status}`, prepared_by: userId || null });
    if (res.error) alert(res.error.message); else { setForm({ lot: '', trade: '', priority: 'P3', update_text: '', next_action: '', status: 'Outstanding' }); reload(); }
  }
  return <div className="space-y-4"><PageTitle title="Daily Log" subtitle="Simple field log. No reports or AI, just useful daily notes." />{canEdit && <Card title="Add Daily Entry" icon={Plus}><div className="grid md:grid-cols-6 gap-2"><Input placeholder="Lot / area" value={form.lot} onChange={(v: string) => setForm({ ...form, lot: v })} /><Input placeholder="Trade" value={form.trade} onChange={(v: string) => setForm({ ...form, trade: v })} /><Select value={form.priority} onChange={(v: string) => setForm({ ...form, priority: v })} options={['P1','P2','P3','P4'].map(p => [p,p])} /><Input className="md:col-span-2" placeholder="Update" value={form.update_text} onChange={(v: string) => setForm({ ...form, update_text: v })} /><button onClick={add} className="btn-primary">Add</button></div></Card>}<div className="space-y-2">{dailyLog.map((l: any) => <div key={l.id} className="card-dark p-4"><div className="flex flex-wrap gap-2 items-center mb-2"><Pill text={l.priority || 'LOG'} /><span className="text-xs text-slate-400">{l.log_date}</span><span className="text-xs text-slate-400">{l.lot || l.weather || ''}</span></div><div className="text-white">{l.update_text || l.work_completed || l.summary}</div>{(l.next_action || l.tomorrow_focus) && <div className="text-sm text-amber-200 mt-2">Next: {l.next_action || l.tomorrow_focus}</div>}</div>)}</div></div>;
}

function InspectionsPanel({ units, inspections, canEdit, reload }: any) {
  const supabase = createSupabaseClient();
  const [form, setForm] = useState({ unit_id: '', inspection_type: INSPECTION_TYPES[0]?.name || 'Framing Inspection', category: INSPECTION_TYPES[0]?.category || 'Building', authority: 'Municipal', status: 'Called', scheduled_date: '', notes: '' });
  async function add() { const { error } = await supabase.from('inspections').insert({ ...form, scheduled_date: form.scheduled_date || null }); if (error) alert(error.message); else reload(); }
  async function pass(id: string) { const { error } = await supabase.from('inspections').update({ status: 'Passed', result_date: new Date().toISOString().slice(0,10) }).eq('id', id); if (error) alert(error.message); else reload(); }
  return <div className="space-y-4"><PageTitle title="Inspections" subtitle="Municipal, ESA, HVAC, plumbing and final inspection tracker." />{canEdit && <Card title="Call / Add Inspection" icon={Plus}><div className="grid md:grid-cols-6 gap-2"><Select value={form.unit_id} onChange={(v: string) => setForm({ ...form, unit_id: v })} options={[[ '', 'No unit' ], ...units.map((u: any) => [u.id, unitLabel(u)])]} /><Select value={form.inspection_type} onChange={(v: string) => { const t: any = INSPECTION_TYPES.find((x: any) => x.name === v); setForm({ ...form, inspection_type: v, category: t?.category || form.category, authority: t?.authority || form.authority }); }} options={INSPECTION_TYPES.map((t: any) => [t.name, t.name])} /><Select value={form.status} onChange={(v: string) => setForm({ ...form, status: v })} options={['Not Scheduled','Called','Passed','Failed','N/A'].map(s => [s,s])} /><Input type="date" value={form.scheduled_date} onChange={(v: string) => setForm({ ...form, scheduled_date: v })} /><Input placeholder="Notes" value={form.notes} onChange={(v: string) => setForm({ ...form, notes: v })} /><button onClick={add} className="btn-primary">Add</button></div></Card>}<div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">{inspections.map((i: any) => <div key={i.id} className="card-dark p-4"><div className="flex justify-between gap-2"><div><div className="font-semibold text-white">{i.inspection_type || i.name || i.inspection_type_id}</div><div className="text-xs text-slate-400">{i.category} · {i.authority}</div></div><Pill text={i.status} /></div><div className="text-xs text-slate-300 mt-3">Scheduled: {i.scheduled_date || i.date_called || '—'}</div>{canEdit && i.status !== 'Passed' && <button onClick={() => pass(i.id)} className="mt-3 text-green-300 hover:underline text-sm">Mark Passed</button>}</div>)}</div></div>;
}

function Toolbar({ q, setQ, block, setBlock }: any) { return <div className="flex flex-wrap gap-2"><div className="relative flex-1 min-w-[220px]"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" /><input value={q} onChange={e => setQ(e.target.value)} placeholder="Search units..." className="input pl-9" /></div><Select value={block} onChange={setBlock} options={[[ 'all','All Blocks' ],['5','Block 5'],['7','Block 7'],['11','Block 11'],['14','Block 14'],['16','Block 16']]} /></div> }
function BlockGrid({ units }: any) { return <div className="grid grid-cols-2 md:grid-cols-5 gap-2">{['5','7','11','14','16'].map(b => { const count = units.filter((u: any) => String(u.block).replace(/^B/i,'') === b).length; return <div key={b} className="bg-slate-950/60 border border-slate-700 rounded p-3"><div className="text-xs text-slate-400">Block {b}</div><div className="text-3xl font-black text-white">{count}</div><div className="text-[11px] text-slate-500">units</div></div> })}</div> }
function MiniLog({ log }: any) { return <div className="border-b border-slate-700 pb-2 mb-2 last:border-0"><div className="text-xs text-slate-400">{log.log_date} · {log.lot || ''}</div><div className="text-sm text-white line-clamp-2">{log.update_text || log.work_completed || log.summary}</div></div> }
function IssueRow({ d }: any) { return <div className="grid md:grid-cols-12 gap-2 py-2 border-b border-slate-700 last:border-0 text-sm"><div className="md:col-span-2 font-mono text-white">{d.lot || (d.block ? `B${d.block} u${d.lot_number || ''}` : 'Site')}</div><div className="md:col-span-6 text-white">{d.issue}</div><div className="md:col-span-2 text-slate-400">{d.trade || '—'}</div><div className="md:col-span-1"><Pill text={d.priority || 'P3'} /></div><div className="md:col-span-1"><Pill text={d.status || 'open'} /></div></div> }
function Loading() { return <div className="flex items-center gap-3 text-slate-300"><Loader2 className="animate-spin text-amber-400" size={22} />Loading site data...</div> }
function PageTitle({ title, subtitle }: any) { return <div><h1 className="text-2xl md:text-3xl font-black text-white">{title}</h1><p className="text-sm text-slate-400 mt-1">{subtitle}</p></div> }
function Card({ title, icon: Icon, children, className = '' }: any) { return <section className={`card-dark p-4 ${className}`}><div className="flex items-center gap-2 mb-3"><Icon className="text-amber-400" size={17} /><h2 className="text-sm uppercase tracking-widest text-slate-400 font-semibold">{title}</h2></div>{children}</section> }
function Kpi({ label, value, icon: Icon, danger, onClick }: any) { return <button onClick={onClick} className={`card-dark p-4 text-left ${onClick ? 'hover:border-amber-400/70' : ''}`}><div className="flex justify-between"><div><div className="text-xs uppercase tracking-widest text-slate-400">{label}</div><div className={`text-3xl font-black mt-1 ${danger ? 'text-red-300' : 'text-white'}`}>{value}</div></div><Icon className={danger ? 'text-red-300' : 'text-amber-400'} size={22} /></div></button> }
function Pill({ text }: any) { const t = String(text || '—'); const cls = t.includes('P1') || t.toLowerCase().includes('fail') || t.toLowerCase().includes('open') ? 'bg-red-950 text-red-200 border-red-800' : t.toLowerCase().includes('pass') || t.toLowerCase().includes('complete') || t.toLowerCase().includes('closed') ? 'bg-green-950 text-green-200 border-green-800' : 'bg-amber-950 text-amber-200 border-amber-800'; return <span className={`inline-flex px-2 py-0.5 rounded text-xs font-semibold border ${cls}`}>{t}</span> }
function Empty({ text }: any) { return <div className="text-sm text-slate-500 py-4 text-center">{text}</div> }
function Input({ label, value, onChange, type = 'text', placeholder = '', className = '' }: any) { return <label className={`block ${className}`}>{label && <span className="text-xs uppercase tracking-widest text-slate-400 mb-1 block">{label}</span>}<input type={type} value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)} className="input" /></label> }
function TextArea({ label, value, onChange }: any) { return <label className="block"><span className="text-xs uppercase tracking-widest text-slate-400 mb-1 block">{label}</span><textarea value={value} onChange={e => onChange(e.target.value)} className="input min-h-[90px]" /></label> }
function Select({ value, onChange, options }: any) { return <select value={value} onChange={e => onChange(e.target.value)} className="input">{options.map((o: any) => <option key={o[0]} value={o[0]}>{o[1]}</option>)}</select> }
function Modal({ title, close, children }: any) { return <div className="fixed inset-0 z-50 flex items-center justify-center p-4"><div className="absolute inset-0 bg-black/70" onClick={close} /><div className="relative w-full max-w-lg card-dark p-5"><div className="flex items-center justify-between mb-4"><h2 className="text-xl font-bold text-white">{title}</h2><button onClick={close}><X size={20} /></button></div>{children}</div></div> }

function MarketingPanel({ units }: { units: any[] }) {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [campaignLoading, setCampaignLoading] = useState(true);
  const [campaignError, setCampaignError] = useState<string | null>(null);

  const today = new Date().toISOString().slice(0, 10);
  const in30 = new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10);
  const thisMonth = today.slice(0, 7);

  const sold = units.filter((u: any) => u.closing_date && u.closing_date <= today).length;
  const closingThisMonth = units.filter((u: any) => u.closing_date?.startsWith(thisMonth)).length;
  const closingNext30 = units.filter((u: any) => u.closing_date > today && u.closing_date <= in30).length;
  const available = units.filter((u: any) => !u.closing_date).length;

  useEffect(() => {
    fetch('/api/marketing/campaigns')
      .then(r => r.json())
      .then(d => { if (d.error) setCampaignError(d.error); else setCampaigns(d.campaigns || []); })
      .catch(e => setCampaignError(e.message))
      .finally(() => setCampaignLoading(false));
  }, []);

  const upcoming = units
    .filter((u: any) => u.closing_date && u.closing_date >= today)
    .sort((a: any, b: any) => a.closing_date.localeCompare(b.closing_date))
    .slice(0, 8);

  return (
    <div className="space-y-6">
      <PageTitle title="Marketing Performance" subtitle="Sales pipeline · email campaigns · conversion overview" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Kpi label="Total Units" value={units.length} icon={Home} />
        <Kpi label="Sold / Closed" value={sold} icon={CheckCircle2} />
        <Kpi label="Closing This Month" value={closingThisMonth} icon={Calendar} />
        <Kpi label="Available" value={available} icon={BarChart2} />
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        <Card title="Closing Pipeline (Next 30 Days)" icon={Calendar}>
          {upcoming.length ? upcoming.map((u: any) => (
            <div key={u.id} className="flex justify-between items-center py-2 border-b border-slate-700 last:border-0 text-sm">
              <div><span className="font-mono text-white">{unitLabel(u)}</span><span className="text-slate-400 ml-2">{u.model || '—'}</span></div>
              <span className={u.closing_date <= in30 ? 'text-amber-300' : 'text-slate-300'}>{u.closing_date}</span>
            </div>
          )) : <Empty text="No upcoming closings scheduled." />}
        </Card>
        <Card title="Email Campaigns" icon={Mail}>
          {campaignLoading ? (
            <div className="flex items-center gap-2 text-slate-400 text-sm py-4"><Loader2 size={14} className="animate-spin text-amber-400" />Loading...</div>
          ) : campaignError ? (
            <div className="text-sm text-slate-400 py-2">
              {campaignError.toLowerCase().includes('not configured')
                ? <span>Add <code className="text-amber-300">MAILERLITE_API_KEY</code> in Vercel environment variables to connect email campaigns.</span>
                : campaignError}
            </div>
          ) : campaigns.length === 0 ? (
            <Empty text="No sent campaigns found." />
          ) : (
            <div className="space-y-2">
              {campaigns.map((c: any) => (
                <div key={c.id} className="py-2 border-b border-slate-700 last:border-0">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-sm text-white">{c.name}</span>
                    <Pill text={c.status || 'sent'} />
                  </div>
                  <div className="flex gap-4 mt-1 text-xs text-slate-400">
                    <span>Sent: <span className="text-slate-200">{c.sent?.toLocaleString() || '—'}</span></span>
                    <span>Opens: <span className="text-green-300">{c.open_rate != null ? `${c.open_rate}%` : '—'}</span></span>
                    <span>Clicks: <span className="text-amber-300">{c.click_rate != null ? `${c.click_rate}%` : '—'}</span></span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
