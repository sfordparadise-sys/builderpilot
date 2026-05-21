'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseClient } from '@/lib/supabase';
import {
  HardHat, Home, Building2, ClipboardCheck, AlertCircle,
  BookOpen, Phone, Image, Bot, Settings, LogOut, Menu, Map,
  Calendar, CheckCircle2, Clock, FileText, Camera, Search,
  ShieldAlert, Hammer, Truck, Users, MessageSquare, Download,
  PlusCircle, Wrench, MapPin, KeyRound, Database
} from 'lucide-react';
import { SAMPLE_SITE, STAGES, INSPECTION_TYPES } from '@/lib/constants';
import UnitsView from '@/components/UnitsView';

const NAV_ITEMS = [
  { id: 'dashboard', name: 'Dashboard', icon: Home },
  { id: 'units', name: 'Lots / Units', icon: Building2 },
  { id: 'rough', name: 'Rough Grid', icon: ClipboardCheck },
  { id: 'finishing', name: 'Finishing Grid', icon: ClipboardCheck },
  { id: 'pdo', name: 'PDO / Closing', icon: ClipboardCheck },
  { id: 'inspections', name: 'Inspections', icon: ClipboardCheck },
  { id: 'deficiencies', name: 'Deficiencies', icon: AlertCircle },
  { id: 'daily-log', name: 'Daily Logs', icon: BookOpen },
  { id: 'trades', name: 'Trades', icon: Phone },
  { id: 'photos', name: 'Photos & Docs', icon: Image },
  { id: 'ai', name: 'AI Assistant', icon: Bot, badge: 'NEW' },
  { id: 'map', name: 'Site Map', icon: Map },
  { id: 'settings', name: 'Settings', icon: Settings },
];

const BLOCKS = SAMPLE_SITE.blocks;
const SAMPLE_LOTS = [
  { block: 'B5', lots: '26-36', stage: 'Roof / second subfloor', status: 'In Progress' },
  { block: 'B7', lots: '51-60', stage: 'Framing / stairs', status: 'In Progress' },
  { block: 'B11', lots: '70-79', stage: 'Framing prep', status: 'Upcoming' },
  { block: 'B14', lots: '103-111', stage: 'Priority framing', status: 'Priority' },
  { block: 'B16', lots: '120-124', stage: 'Truss / framing coordination', status: 'In Progress' },
];

const DEFICIENCIES = [
  { lot: 'B14 u103', issue: 'Guard openings at stair / second subfloor', trade: 'Framing', priority: 'P1', status: 'Open' },
  { lot: 'B5 u31', issue: 'Confirm truss delivery clearance and access', trade: 'Site / Supplier', priority: 'P2', status: 'Watching' },
  { lot: 'B7 u55', issue: 'Clean lumber off access route before end of day', trade: 'Framing', priority: 'P2', status: 'Open' },
  { lot: 'B16 u122', issue: 'Confirm steel / framing sequence before loading', trade: 'Site', priority: 'P3', status: 'Pending' },
];

const TRADE_CONTACTS = [
  { name: 'Joe / Isaac', company: 'Cancian Framing', focus: 'Framing, guards, lumber organization', status: 'Active' },
  { name: 'Kevin', company: 'SPR Masonry', focus: 'Brick / stone sequencing', status: 'Coordination' },
  { name: 'Katharine', company: 'Newmar Windows', focus: 'Wednesday window schedule updates', status: 'Weekly' },
  { name: 'Vince / Peter', company: 'Airport Stairs', focus: 'Stairs and railings', status: 'Active' },
  { name: 'Majid', company: 'Welder', focus: 'Steel / welding items', status: 'Scheduled' },
  { name: 'Luis', company: 'Labour', focus: 'Housekeeping and access cleanup', status: 'Daily' },
];

const DAILY_ACTIONS = [
  'Guard all open floor and stair openings before crews leave.',
  'Confirm access is maintained to front doors, garages, roads, and hydrants.',
  'Update window schedule notes for Newmar if framing stage changes.',
  'Capture photos for priority blocks before end of day.',
  'Carry forward unresolved P1 / P2 items into tomorrow focus.',
];

const PHOTO_DOCS = [
  { title: 'Opening protection photos', type: 'Safety', owner: 'Site', status: 'Needed today' },
  { title: 'Window schedule markups', type: 'Schedule', owner: 'Steve', status: 'Weekly' },
  { title: 'Truss delivery confirmations', type: 'Delivery', owner: 'Supplier', status: 'Active' },
  { title: 'Daily recap attachments', type: 'Report', owner: 'Site', status: 'Daily' },
];

export default function HomePage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const supabase = createSupabaseClient();

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUser(user);
      const { data: prof } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      setProfile(prof);
      setLoading(false);
    }
    init();
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    router.push('/login');
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center">
        <div className="flex items-center gap-3 text-concrete">
          <HardHat className="animate-pulse text-gold" size={32} />
          <span>Loading BuilderPilot...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink flex">
      <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:relative inset-y-0 left-0 z-30 w-64 bg-ink-800 border-r border-ink-700 flex flex-col transition-transform`}>
        <div className="p-4 border-b border-ink-700">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded bg-ink border border-gold flex items-center justify-center">
              <HardHat className="text-gold" size={20} />
            </div>
            <div>
              <div className="font-extrabold text-white text-lg leading-none">Builder<span className="text-gold">Pilot</span></div>
              <div className="text-[10px] text-concrete uppercase tracking-widest mt-0.5">Site OS</div>
            </div>
          </div>
        </div>

        <div className="px-4 py-3 border-b border-ink-700">
          <div className="text-[10px] text-concrete uppercase tracking-widest">Active Site</div>
          <div className="text-sm text-white font-medium mt-0.5">{SAMPLE_SITE.name}</div>
          <div className="text-xs text-concrete">{SAMPLE_SITE.type}</div>
        </div>

        <nav className="flex-1 overflow-y-auto py-2">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <button key={item.id} onClick={() => { setActive(item.id); setSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition ${isActive ? 'bg-ink text-gold border-l-2 border-gold font-semibold' : 'text-concrete hover:bg-ink hover:text-white border-l-2 border-transparent'}`}>
                <Icon size={16} />
                <span className="flex-1 text-left">{item.name}</span>
                {item.badge && <span className="bg-gold text-ink text-[9px] font-bold px-1.5 py-0.5 rounded">{item.badge}</span>}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-ink-700 p-4">
          <div className="text-xs text-concrete">{profile?.name || user?.email}</div>
          <div className="text-[10px] text-concrete uppercase tracking-widest">{profile?.role || 'user'}</div>
          <button onClick={signOut} className="mt-2 text-xs text-concrete hover:text-gold flex items-center gap-1.5 transition">
            <LogOut size={12} /> Sign out
          </button>
        </div>
      </aside>

      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} className="lg:hidden fixed inset-0 bg-black/60 z-20" />}

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-ink-700 bg-ink-800/50 backdrop-blur flex items-center px-4 gap-3 sticky top-0 z-10">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-white"><Menu size={20} /></button>
          <h2 className="text-white font-semibold capitalize">{NAV_ITEMS.find(n => n.id === active)?.name}</h2>
          <div className="ml-auto hidden md:block text-xs text-concrete">
            {new Date().toLocaleDateString('en-CA', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <ModuleRouter active={active} profile={profile} />
        </div>
      </main>
    </div>
  );
}

function ModuleRouter({ active, profile }: { active: string; profile: any }) {
  if (active === 'dashboard') return <DashboardView profile={profile} />;
  if (active === 'units') return <UnitsView />;
  if (active === 'rough') return <StageGridView group="rough" title="Rough Grid" />;
  if (active === 'finishing') return <StageGridView group="finishing" title="Finishing Grid" />;
  if (active === 'pdo') return <StageGridView group="pdo" title="PDO / Closing" />;
  if (active === 'inspections') return <InspectionsView />;
  if (active === 'deficiencies') return <DeficienciesView />;
  if (active === 'daily-log') return <DailyLogView />;
  if (active === 'trades') return <TradesView />;
  if (active === 'photos') return <PhotosDocsView />;
  if (active === 'ai') return <AIAssistantView />;
  if (active === 'map') return <SiteMapView />;
  if (active === 'settings') return <SettingsView />;
  return <DashboardView profile={profile} />;
}

function DashboardView({ profile }: any) {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs text-gold uppercase tracking-widest mb-1">Good morning</div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white">{profile?.name ? profile.name.split(' ')[0] : 'Welcome'}, here&apos;s what&apos;s happening.</h1>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiTile label="Active Lots" value="44" sub="5 blocks active" />
        <KpiTile label="Inspections This Week" value="12" sub="3 pending" />
        <KpiTile label="Open Deficiencies" value="27" sub="8 urgent" warning />
        <KpiTile label="Closings Next 30d" value="6" sub="next: May 28" highlight />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Panel title="Today Focus" icon={Clock}>
          <div className="space-y-2">{DAILY_ACTIONS.map((a, i) => <CheckRow key={a} text={a} checked={i < 2} />)}</div>
        </Panel>
        <Panel title="Priority Blocks" icon={Building2} className="xl:col-span-2">
          <div className="grid md:grid-cols-2 gap-2">{SAMPLE_LOTS.map(b => <BlockStatus key={b.block} {...b} />)}</div>
        </Panel>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <QuickAction icon={BookOpen} label="Start Daily Log" />
        <QuickAction icon={AlertCircle} label="Log Deficiency" />
        <QuickAction icon={ClipboardCheck} label="Call Inspection" />
        <QuickAction icon={Bot} label="Ask AI" badge="NEW" />
      </div>
    </div>
  );
}

function StageGridView({ group, title }: { group: 'rough' | 'finishing' | 'pdo'; title: string }) {
  const [query, setQuery] = useState('');
  const rows = useMemo(() => STAGES.filter(s => s.group === group && (query.trim() === '' || `${s.stage} ${s.trade}`.toLowerCase().includes(query.toLowerCase()))), [group, query]);
  return (
    <div className="space-y-4">
      <ModuleHeader icon={ClipboardCheck} title={title} subtitle={`Live-style stage tracker for ${SAMPLE_SITE.name}. Demo rows are generated from the construction stage library.`} />
      <SearchBox value={query} onChange={setQuery} placeholder="Search stages or trades..." />
      <div className="card overflow-hidden">
        <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-ink text-[10px] uppercase tracking-widest text-concrete border-b border-ink-700">
          <div className="col-span-5">Stage</div><div className="col-span-2">Trade</div><div className="col-span-2">Block</div><div className="col-span-2">Status</div><div className="col-span-1 text-right">#</div>
        </div>
        {rows.map((s, i) => <StageRow key={s.stage} stage={s.stage} trade={s.trade} order={s.order} block={BLOCKS[i % BLOCKS.length]} status={i % 5 === 0 ? 'Called' : i % 4 === 0 ? 'Hold' : i % 3 === 0 ? 'Ready' : 'Open'} />)}
      </div>
    </div>
  );
}

function InspectionsView() {
  const [category, setCategory] = useState('all');
  const rows = INSPECTION_TYPES.filter(i => category === 'all' || i.category === category);
  const categories = Array.from(new Set(INSPECTION_TYPES.map(i => i.category)));
  return (
    <div className="space-y-4">
      <ModuleHeader icon={ShieldAlert} title="Inspections" subtitle="Municipal, ESA, TSSA, builder and final inspections in one working screen." />
      <div className="flex flex-wrap gap-2"><Chip active={category === 'all'} onClick={() => setCategory('all')}>All</Chip>{categories.map(c => <Chip key={c} active={category === c} onClick={() => setCategory(c)}>{c}</Chip>)}</div>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">{rows.map((i, idx) => <InspectionCard key={i.id} item={i} block={BLOCKS[idx % BLOCKS.length]} status={idx % 4 === 0 ? 'Passed' : idx % 3 === 0 ? 'Called' : 'Not Scheduled'} />)}</div>
    </div>
  );
}

function DeficienciesView() {
  return (
    <div className="space-y-4">
      <ModuleHeader icon={AlertCircle} title="Deficiencies" subtitle="Priority issue list with trade, lot, status and action ownership." />
      <div className="grid md:grid-cols-4 gap-3"><KpiTile label="P1" value="1" sub="safety critical" warning /><KpiTile label="P2" value="2" sub="today/tomorrow" /><KpiTile label="P3" value="1" sub="monitor" /><KpiTile label="Closed Today" value="6" sub="field cleared" highlight /></div>
      <div className="card overflow-hidden">{DEFICIENCIES.map((d) => <IssueRow key={d.lot + d.issue} {...d} />)}</div>
    </div>
  );
}

function DailyLogView() {
  return (
    <div className="space-y-4">
      <ModuleHeader icon={BookOpen} title="Daily Logs" subtitle="Field recap builder for weather, manpower, safety, deliveries, inspections, notes and tomorrow focus." />
      <div className="grid lg:grid-cols-3 gap-4">
        <Panel title="Today&apos;s Recap Draft" icon={FileText} className="lg:col-span-2"><DailyLogDraft /></Panel>
        <Panel title="Carry Forward" icon={Clock}><div className="space-y-2">{DAILY_ACTIONS.map((a, i) => <CheckRow key={a} text={a} checked={i === 0} />)}</div></Panel>
      </div>
    </div>
  );
}

function TradesView() {
  return (
    <div className="space-y-4">
      <ModuleHeader icon={Phone} title="Trades" subtitle="Simple trade contact board and active coordination tracker." />
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">{TRADE_CONTACTS.map(t => <TradeCard key={t.company} {...t} />)}</div>
    </div>
  );
}

function PhotosDocsView() {
  return (
    <div className="space-y-4">
      <ModuleHeader icon={Camera} title="Photos & Docs" subtitle="Holding area for photos, markups, delivery tickets, schedules and daily recap attachments." />
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-3">{PHOTO_DOCS.map(doc => <DocCard key={doc.title} {...doc} />)}</div>
    </div>
  );
}

function AIAssistantView() {
  const [input, setInput] = useState('Summarize today and tell me what to focus on tomorrow.');
  return (
    <div className="space-y-4">
      <ModuleHeader icon={Bot} title="AI Assistant" subtitle="Site-super style prompts for daily summaries, trade messages, deficiency lists and weekly reports." />
      <div className="grid lg:grid-cols-3 gap-4">
        <Panel title="Prompt Builder" icon={MessageSquare} className="lg:col-span-2">
          <textarea value={input} onChange={(e) => setInput(e.target.value)} className="w-full min-h-[180px] bg-ink border border-ink-700 rounded p-3 text-sm text-white focus:outline-none focus:border-gold/60" />
          <div className="mt-3 flex flex-wrap gap-2"><SmallButton>Generate Daily Recap</SmallButton><SmallButton>Draft Trade Text</SmallButton><SmallButton>Build Weekly Summary</SmallButton></div>
        </Panel>
        <Panel title="Fast Prompts" icon={Bot}><div className="space-y-2"><PromptChip text="Turn these notes into a Procore-style daily log." /><PromptChip text="Create a firm but fair trade instruction." /><PromptChip text="Extract P1/P2 safety items from today." /><PromptChip text="Summarize for Dale in management tone." /></div></Panel>
      </div>
    </div>
  );
}

function SiteMapView() {
  return (
    <div className="space-y-4">
      <ModuleHeader icon={Map} title="Site Map" subtitle="Block-level field map for Aurora Trails. Interactive lot mapping can be wired to drawings later." />
      <div className="grid md:grid-cols-5 gap-3">{SAMPLE_LOTS.map((b, i) => <div key={b.block} className="card p-4 min-h-[140px] flex flex-col justify-between"><div><MapPin className="text-gold mb-2" size={22} /><div className="text-white font-bold text-xl">{b.block}</div><div className="text-xs text-concrete">Lots {b.lots}</div></div><span className={i === 2 ? 'pill-na' : i === 3 ? 'pill-fail' : 'pill-pending'}>{b.status}</span></div>)}</div>
    </div>
  );
}

function SettingsView() {
  return (
    <div className="space-y-4">
      <ModuleHeader icon={Settings} title="Settings" subtitle="Project, users, permissions, data sources and Supabase connection status." />
      <div className="grid md:grid-cols-2 gap-4">
        <Panel title="Project" icon={Building2}><SettingsRow label="Site" value={SAMPLE_SITE.name} /><SettingsRow label="Units" value={`${SAMPLE_SITE.unitCount}`} /><SettingsRow label="Blocks" value={SAMPLE_SITE.blocks.join(', ')} /></Panel>
        <Panel title="Data Connection" icon={Database}><SettingsRow label="Supabase client" value="Enabled" /><SettingsRow label="Auth required" value="Yes" /><SettingsRow label="Mode" value="Demo + live Units table" /></Panel>
        <Panel title="Security" icon={KeyRound}><SettingsRow label="Roles" value="Admin, Supervisor, Foreman, Viewer" /><SettingsRow label="RLS" value="Configure in Supabase" /></Panel>
        <Panel title="Exports" icon={Download}><SettingsRow label="Daily recap" value="Ready for PDF/CSV workflow" /><SettingsRow label="Weekly recap" value="Ready for template output" /></Panel>
      </div>
    </div>
  );
}

function KpiTile({ label, value, sub, warning, highlight }: any) {
  return <div className={`card p-4 ${warning ? 'border-amber-700/50' : ''} ${highlight ? 'border-gold/30' : ''}`}><div className="text-[10px] text-concrete uppercase tracking-widest">{label}</div><div className={`text-2xl md:text-3xl font-extrabold mt-1 ${warning ? 'text-amber-400' : highlight ? 'text-gold' : 'text-white'}`}>{value}</div><div className="text-xs text-concrete mt-0.5">{sub}</div></div>;
}

function QuickAction({ icon: Icon, label, badge }: any) {
  return <button className="card p-4 hover:border-gold/50 transition text-left group"><div className="flex items-start justify-between mb-2"><Icon className="text-gold" size={20} />{badge && <span className="bg-gold text-ink text-[9px] font-bold px-1.5 py-0.5 rounded">{badge}</span>}</div><div className="text-sm font-medium text-white group-hover:text-gold transition">{label}</div></button>;
}

function ModuleHeader({ icon: Icon, title, subtitle }: any) {
  return <div className="flex items-start gap-3"><div className="w-10 h-10 rounded bg-ink-800 border border-gold/40 flex items-center justify-center shrink-0"><Icon className="text-gold" size={20} /></div><div><h1 className="text-2xl md:text-3xl font-extrabold text-white">{title}</h1><p className="text-sm text-concrete mt-1 max-w-3xl">{subtitle}</p></div></div>;
}

function Panel({ title, icon: Icon, children, className = '' }: any) {
  return <div className={`card p-4 ${className}`}><div className="flex items-center gap-2 mb-3"><Icon className="text-gold" size={16} /><div className="text-xs text-concrete uppercase tracking-widest">{title}</div></div>{children}</div>;
}

function CheckRow({ text, checked }: { text: string; checked?: boolean }) {
  return <div className="flex items-start gap-2 text-sm"><CheckCircle2 size={16} className={checked ? 'text-gold mt-0.5' : 'text-concrete mt-0.5'} /><span className={checked ? 'text-white' : 'text-concrete'}>{text}</span></div>;
}

function BlockStatus({ block, lots, stage, status }: any) {
  return <div className="bg-ink border border-ink-700 rounded p-3"><div className="flex justify-between items-start"><div className="text-white font-bold">{block}</div><span className={status === 'Priority' ? 'pill-fail' : status === 'Upcoming' ? 'pill-na' : 'pill-pending'}>{status}</span></div><div className="text-xs text-concrete mt-1">Lots {lots}</div><div className="text-sm text-white mt-2">{stage}</div></div>;
}

function SearchBox({ value, onChange, placeholder }: any) {
  return <div className="relative max-w-xl"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-concrete" /><input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full bg-ink-800 border border-ink-700 rounded pl-9 pr-3 py-2 text-sm text-white placeholder:text-concrete focus:border-gold/60 focus:outline-none" /></div>;
}

function Chip({ children, active, onClick }: any) {
  return <button onClick={onClick} className={`px-3 py-1.5 rounded text-xs font-medium transition border ${active ? 'bg-gold text-ink border-gold' : 'bg-ink-800 text-concrete border-ink-700 hover:text-white hover:border-ink-600'}`}>{children}</button>;
}

function StageRow({ stage, trade, order, block, status }: any) {
  return <div className="grid grid-cols-12 gap-2 px-4 py-3 text-sm border-b border-ink-700 last:border-b-0 hover:bg-ink/50"><div className="col-span-5 text-white font-medium">{stage}</div><div className="col-span-2 text-concrete">{trade}</div><div className="col-span-2 text-white font-mono">{block}</div><div className="col-span-2"><span className={status === 'Ready' ? 'pill-pass' : status === 'Hold' ? 'pill-fail' : status === 'Called' ? 'pill-pending' : 'pill-na'}>{status}</span></div><div className="col-span-1 text-right text-concrete font-mono">{order}</div></div>;
}

function InspectionCard({ item, block, status }: any) {
  return <div className="card p-4"><div className="flex justify-between gap-2"><div><div className="text-white font-semibold">{item.name}</div><div className="text-xs text-concrete mt-1">{item.category} · {item.authority}</div></div><span className={status === 'Passed' ? 'pill-pass' : status === 'Called' ? 'pill-pending' : 'pill-na'}>{status}</span></div><div className="text-xs text-concrete mt-3 font-mono">Next block: {block}</div></div>;
}

function IssueRow({ lot, issue, trade, priority, status }: any) {
  return <div className="grid md:grid-cols-12 gap-2 p-4 border-b border-ink-700 last:border-b-0"><div className="md:col-span-2 text-white font-mono">{lot}</div><div className="md:col-span-5 text-white">{issue}</div><div className="md:col-span-2 text-concrete">{trade}</div><div className="md:col-span-1"><span className={priority === 'P1' ? 'pill-fail' : 'pill-pending'}>{priority}</span></div><div className="md:col-span-2 text-concrete">{status}</div></div>;
}

function DailyLogDraft() {
  return <div className="bg-ink border border-ink-700 rounded p-4 text-sm text-concrete space-y-3"><p><strong className="text-white">Summary:</strong> Framing, structural coordination, deliveries and site organization continued across active blocks. Safety focus remained on stair and second subfloor opening protection.</p><p><strong className="text-white">Safety:</strong> Guard openings, maintain clean access, confirm roads and garage approaches remain clear.</p><p><strong className="text-white">Tomorrow:</strong> Follow up with framing, welder, stairs, windows and priority block sequencing.</p></div>;
}

function TradeCard({ name, company, focus, status }: any) {
  return <div className="card p-4"><div className="flex items-start gap-3"><Users className="text-gold shrink-0" size={20} /><div><div className="text-white font-semibold">{name}</div><div className="text-xs text-concrete">{company}</div><div className="text-sm text-white mt-3">{focus}</div><span className="pill-pending inline-block mt-3">{status}</span></div></div></div>;
}

function DocCard({ title, type, owner, status }: any) {
  return <div className="card p-4"><FileText className="text-gold mb-3" size={22} /><div className="text-white font-semibold">{title}</div><div className="text-xs text-concrete mt-1">{type} · {owner}</div><span className="pill-pending inline-block mt-3">{status}</span></div>;
}

function PromptChip({ text }: { text: string }) {
  return <button className="w-full text-left bg-ink border border-ink-700 rounded p-3 text-sm text-concrete hover:text-white hover:border-gold/50 transition">{text}</button>;
}

function SmallButton({ children }: any) {
  return <button className="btn-gold text-xs flex items-center gap-1"><PlusCircle size={13} />{children}</button>;
}

function SettingsRow({ label, value }: any) {
  return <div className="flex items-center justify-between gap-3 border-b border-ink-700 last:border-b-0 py-2"><div className="text-sm text-concrete">{label}</div><div className="text-sm text-white text-right">{value}</div></div>;
}
