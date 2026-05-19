'use client';

import { useEffect, useMemo, useState } from 'react';
import { createSupabaseClient } from '@/lib/supabase';
import {
  Building2, Search, X, Calendar, Home, ClipboardCheck,
  AlertCircle, FileText, Loader2,
} from 'lucide-react';

type Unit = {
  id: string;
  site_id: string;
  block: string | null;
  lot_number: string | null;
  unit_number: string | null;
  address: string | null;
  model: string | null;
  elevation: string | null;
  closing_date: string | null;
  purchaser_notes: string | null;
  status: 'active' | 'closed' | 'hold' | 'cancelled';
};

type Counts = {
  inspections: number;
  deficiencies: number;
  stage_progress: number;
  photos: number;
};

const STATUS_LABEL: Record<string, string> = {
  active: 'Active',
  closed: 'Closed',
  hold: 'On Hold',
  cancelled: 'Cancelled',
};

const STATUS_PILL: Record<string, string> = {
  active: 'pill-pending',
  closed: 'pill-pass',
  hold: 'pill-fail',
  cancelled: 'pill-na',
};

export default function UnitsView() {
  const [units, setUnits] = useState<Unit[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [blockFilter, setBlockFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'block' | 'lot' | 'closing' | 'model'>('block');
  const [selected, setSelected] = useState<Unit | null>(null);
  const supabase = createSupabaseClient();

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const { data, error } = await supabase.from('units').select('*');
      if (cancelled) return;
      if (error) setError(error.message);
      else setUnits((data || []) as Unit[]);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const blocks = useMemo(() => {
    if (!units) return [] as string[];
    const s = new Set(units.map((u) => u.block).filter(Boolean) as string[]);
    return Array.from(s).sort();
  }, [units]);

  const filtered = useMemo(() => {
    if (!units) return [] as Unit[];
    let list = units;
    if (blockFilter !== 'all') list = list.filter((u) => u.block === blockFilter);
    if (statusFilter !== 'all') list = list.filter((u) => u.status === statusFilter);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (u) =>
          u.block?.toLowerCase().includes(q) ||
          u.lot_number?.toLowerCase().includes(q) ||
          u.unit_number?.toLowerCase().includes(q) ||
          u.model?.toLowerCase().includes(q) ||
          u.address?.toLowerCase().includes(q),
      );
    }
    return [...list].sort((a, b) => {
      switch (sortBy) {
        case 'block': {
          const ba = (a.block || '').localeCompare(b.block || '');
          if (ba !== 0) return ba;
          return (
            parseInt(a.lot_number || '0', 10) - parseInt(b.lot_number || '0', 10)
          );
        }
        case 'lot':
          return (
            parseInt(a.lot_number || '0', 10) - parseInt(b.lot_number || '0', 10)
          );
        case 'closing': {
          const da = a.closing_date ? new Date(a.closing_date).getTime() : Infinity;
          const db = b.closing_date ? new Date(b.closing_date).getTime() : Infinity;
          return da - db;
        }
        case 'model':
          return (a.model || '').localeCompare(b.model || '');
      }
    });
  }, [units, blockFilter, statusFilter, search, sortBy]);

  if (error) {
    return (
      <div className="card p-6 border-red-800/50">
        <div className="text-red-300 text-sm font-medium">Couldn&apos;t load units</div>
        <div className="text-red-400 text-xs mt-1 font-mono">{error}</div>
      </div>
    );
  }
  if (!units) {
    return (
      <div className="flex items-center gap-3 text-concrete">
        <Loader2 className="animate-spin text-gold" size={20} />
        <span>Loading units...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[220px]">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-concrete pointer-events-none"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by lot, block, model, address..."
            className="w-full bg-ink-800 border border-ink-700 rounded pl-9 pr-3 py-2 text-sm text-white placeholder:text-concrete focus:border-gold/60 focus:outline-none"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="bg-ink-800 border border-ink-700 rounded px-3 py-2 text-sm text-white focus:border-gold/60 focus:outline-none"
        >
          <option value="block">Sort: Block &amp; Lot</option>
          <option value="lot">Sort: Lot #</option>
          <option value="closing">Sort: Closing date</option>
          <option value="model">Sort: Model</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-ink-800 border border-ink-700 rounded px-3 py-2 text-sm text-white focus:border-gold/60 focus:outline-none"
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="closed">Closed</option>
          <option value="hold">On Hold</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Block chips */}
      <div className="flex flex-wrap gap-2">
        <Chip active={blockFilter === 'all'} onClick={() => setBlockFilter('all')}>
          All <span className="opacity-70 ml-1">({units.length})</span>
        </Chip>
        {blocks.map((b) => {
          const count = units.filter((u) => u.block === b).length;
          return (
            <Chip
              key={b}
              active={blockFilter === b}
              onClick={() => setBlockFilter(b)}
            >
              {b} <span className="opacity-70 ml-1">({count})</span>
            </Chip>
          );
        })}
      </div>

      {/* Result count */}
      <div className="text-xs text-concrete">
        Showing {filtered.length} of {units.length}{' '}
        {filtered.length === 1 ? 'unit' : 'units'}
      </div>

      {/* Card grid */}
      {filtered.length === 0 ? (
        <div className="card p-8 text-center">
          <Building2 size={32} className="text-concrete mx-auto mb-2" />
          <div className="text-white font-medium">No units match these filters</div>
          <div className="text-concrete text-sm mt-1">
            Try clearing the search or block filter.
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filtered.map((u) => (
            <UnitCard key={u.id} unit={u} onClick={() => setSelected(u)} />
          ))}
        </div>
      )}

      {selected && (
        <UnitDrawer unit={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

function Chip({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded text-xs font-medium transition border ${
        active
          ? 'bg-gold text-ink border-gold'
          : 'bg-ink-800 text-concrete border-ink-700 hover:text-white hover:border-ink-600'
      }`}
    >
      {children}
    </button>
  );
}

function UnitCard({ unit, onClick }: { unit: Unit; onClick: () => void }) {
  const closing = unit.closing_date
    ? new Date(unit.closing_date).toLocaleDateString('en-CA', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '—';
  return (
    <button
      onClick={onClick}
      className="card p-4 text-left hover:border-gold/50 transition group"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <div className="text-[10px] text-concrete uppercase tracking-widest">
            Block / Lot
          </div>
          <div className="font-mono font-bold text-white text-lg group-hover:text-gold transition">
            {unit.block || '—'} / Lot {unit.lot_number || '—'}
          </div>
        </div>
        <span className={STATUS_PILL[unit.status] || 'pill-na'}>
          {STATUS_LABEL[unit.status] || unit.status}
        </span>
      </div>

      <div className="space-y-1 mt-3">
        <div className="flex items-center gap-2 text-xs">
          <Home size={12} className="text-concrete" />
          <span className="text-white font-medium">{unit.model || '—'}</span>
          {unit.elevation && (
            <span className="text-concrete">/ Elev. {unit.elevation}</span>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-concrete">
          <Calendar size={12} />
          <span>Closing {closing}</span>
        </div>
        {unit.unit_number && (
          <div className="text-[11px] text-concrete font-mono pt-1">
            #{unit.unit_number}
          </div>
        )}
      </div>
    </button>
  );
}

function UnitDrawer({ unit, onClose }: { unit: Unit; onClose: () => void }) {
  const supabase = createSupabaseClient();
  const [counts, setCounts] = useState<Counts | null>(null);
  const [tab, setTab] =
    useState<'overview' | 'progress' | 'inspections' | 'deficiencies'>('overview');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const [ins, def, sp, ph] = await Promise.all([
        supabase
          .from('inspections')
          .select('id', { count: 'exact', head: true })
          .eq('unit_id', unit.id),
        supabase
          .from('deficiencies')
          .select('id', { count: 'exact', head: true })
          .eq('unit_id', unit.id),
        supabase
          .from('stage_progress')
          .select('id', { count: 'exact', head: true })
          .eq('unit_id', unit.id),
        supabase
          .from('photos')
          .select('id', { count: 'exact', head: true })
          .eq('unit_id', unit.id),
      ]);
      if (cancelled) return;
      setCounts({
        inspections: ins.count || 0,
        deficiencies: def.count || 0,
        stage_progress: sp.count || 0,
        photos: ph.count || 0,
      });
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [unit.id]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const closing = unit.closing_date
    ? new Date(unit.closing_date).toLocaleDateString('en-CA', {
        weekday: 'short',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Not set';

  return (
    <div className="fixed inset-0 z-50 flex">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <aside className="relative ml-auto w-full max-w-xl bg-ink-800 border-l border-ink-700 h-full overflow-y-auto shadow-tool-lg">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-ink-800 border-b border-ink-700 p-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[10px] text-gold uppercase tracking-widest">
              Unit Details
            </div>
            <h2 className="text-2xl font-extrabold text-white font-mono mt-1 truncate">
              {unit.block} <span className="text-concrete">/</span> Lot{' '}
              {unit.lot_number}
            </h2>
            <div className="text-xs text-concrete mt-1 flex items-center gap-2 flex-wrap">
              <span>
                {unit.model || '—'}
                {unit.elevation ? ` / Elev. ${unit.elevation}` : ''}
              </span>
              <span className={STATUS_PILL[unit.status] || 'pill-na'}>
                {STATUS_LABEL[unit.status] || unit.status}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-concrete hover:text-white p-1 shrink-0"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <nav className="border-b border-ink-700 flex overflow-x-auto">
          {[
            { id: 'overview' as const, label: 'Overview', icon: FileText },
            {
              id: 'progress' as const,
              label: 'Progress',
              icon: ClipboardCheck,
              badge: counts?.stage_progress,
            },
            {
              id: 'inspections' as const,
              label: 'Inspections',
              icon: ClipboardCheck,
              badge: counts?.inspections,
            },
            {
              id: 'deficiencies' as const,
              label: 'Deficiencies',
              icon: AlertCircle,
              badge: counts?.deficiencies,
            },
          ].map((t) => {
            const Icon = t.icon;
            const isActive = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 px-4 py-3 text-xs font-semibold border-b-2 transition whitespace-nowrap ${
                  isActive
                    ? 'text-gold border-gold'
                    : 'text-concrete border-transparent hover:text-white'
                }`}
              >
                <Icon size={13} />
                {t.label}
                {typeof t.badge === 'number' && t.badge > 0 && (
                  <span className="ml-1 bg-ink-700 text-white text-[10px] px-1.5 rounded">
                    {t.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Body */}
        <div className="p-4">
          {tab === 'overview' && (
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              <Field label="Unit Number" value={unit.unit_number} mono />
              <Field label="Status" value={STATUS_LABEL[unit.status] || unit.status} />
              <Field label="Model" value={unit.model} />
              <Field label="Elevation" value={unit.elevation} />
              <div className="col-span-2">
                <Field label="Closing Date" value={closing} />
              </div>
              <div className="col-span-2">
                <Field label="Address" value={unit.address} />
              </div>
              {unit.purchaser_notes && (
                <div className="col-span-2">
                  <div className="text-[10px] text-concrete uppercase tracking-widest mb-1">
                    Purchaser Notes
                  </div>
                  <div className="card p-3 text-sm text-white whitespace-pre-wrap">
                    {unit.purchaser_notes}
                  </div>
                </div>
              )}
            </div>
          )}

          {tab === 'progress' && (
            <PlaceholderTab
              count={counts?.stage_progress || 0}
              kind="stage rows"
              label="The full rough / finishing / PDO grid editor lands in the next sprint. Counts here are pulled live from the stage_progress table."
            />
          )}
          {tab === 'inspections' && (
            <PlaceholderTab
              count={counts?.inspections || 0}
              kind="inspections"
              label="Inspections module is coming next. ESA, TSSA, Municipal, HVAC types are already seeded in the codebase."
            />
          )}
          {tab === 'deficiencies' && (
            <PlaceholderTab
              count={counts?.deficiencies || 0}
              kind="deficiencies"
              label="Deficiency tracker arrives with the AI Assistant work — voice-to-text deficiencies coming."
            />
          )}
        </div>
      </aside>
    </div>
  );
}

function Field({
  label,
  value,
  mono,
}: {
  label: string;
  value: string | null | undefined;
  mono?: boolean;
}) {
  return (
    <div>
      <div className="text-[10px] text-concrete uppercase tracking-widest mb-0.5">
        {label}
      </div>
      <div className={`text-sm text-white ${mono ? 'font-mono' : ''}`}>
        {value && String(value).trim() !== '' ? value : (
          <span className="text-concrete">—</span>
        )}
      </div>
    </div>
  );
}

function PlaceholderTab({
  count,
  kind,
  label,
}: {
  count: number;
  kind: string;
  label: string;
}) {
  return (
    <div className="card p-6 text-center">
      <div className="text-4xl font-extrabold text-gold">{count}</div>
      <div className="text-xs text-concrete uppercase tracking-widest mt-1">
        {kind}
      </div>
      <div className="text-sm text-concrete mt-3 max-w-sm mx-auto">{label}</div>
    </div>
  );
}
