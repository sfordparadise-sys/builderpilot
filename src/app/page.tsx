'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseClient } from '@/lib/supabase';
import {
  HardHat, Home, Building2, ClipboardCheck, AlertCircle,
  BookOpen, Phone, Users, Image, Bot, Settings, LogOut, Menu, X, Map
} from 'lucide-react';
import { BRAND, SAMPLE_SITE } from '@/lib/constants';
import UnitsView from '@/components/UnitsView';
import AIAssistantView from '@/components/AIAssistantView';

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
      {/* Sidebar */}
      <aside className={`
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 fixed lg:relative inset-y-0 left-0 z-30
        w-64 bg-ink-800 border-r border-ink-700 flex flex-col transition-transform
      `}>
        {/* Brand */}
        <div className="p-4 border-b border-ink-700">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded bg-ink border border-gold flex items-center justify-center">
              <HardHat className="text-gold" size={20} />
            </div>
            <div>
              <div className="font-extrabold text-white text-lg leading-none">
                Builder<span className="text-gold">Pilot</span>
              </div>
              <div className="text-[10px] text-concrete uppercase tracking-widest mt-0.5">Site OS</div>
            </div>
          </div>
        </div>

        {/* Active site indicator */}
        <div className="px-4 py-3 border-b border-ink-700">
          <div className="text-[10px] text-concrete uppercase tracking-widest">Active Site</div>
          <div className="text-sm text-white font-medium mt-0.5">{SAMPLE_SITE.name}</div>
          <div className="text-xs text-concrete">{SAMPLE_SITE.type}</div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-2">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setActive(item.id); setSidebarOpen(false); }}
                className={`
                  w-full flex items-center gap-3 px-4 py-2.5 text-sm transition
                  ${isActive
                    ? 'bg-ink text-gold border-l-2 border-gold font-semibold'
                    : 'text-concrete hover:bg-ink hover:text-white border-l-2 border-transparent'}
                `}
              >
                <Icon size={16} />
                <span className="flex-1 text-left">{item.name}</span>
                {item.badge && (
                  <span className="bg-gold text-ink text-[9px] font-bold px-1.5 py-0.5 rounded">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User footer */}
        <div className="border-t border-ink-700 p-4">
          <div className="text-xs text-concrete">{profile?.name || user?.email}</div>
          <div className="text-[10px] text-concrete uppercase tracking-widest">{profile?.role || 'user'}</div>
          <button
            onClick={signOut}
            className="mt-2 text-xs text-concrete hover:text-gold flex items-center gap-1.5 transition"
          >
            <LogOut size={12} /> Sign out
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/60 z-20"
        />
      )}

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 border-b border-ink-700 bg-ink-800/50 backdrop-blur flex items-center px-4 gap-3 sticky top-0 z-10">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-white"
          >
            <Menu size={20} />
          </button>
          <h2 className="text-white font-semibold capitalize">
            {NAV_ITEMS.find(n => n.id === active)?.name}
          </h2>
          <div className="ml-auto flex items-center gap-2">
            <div className="hidden md:block text-xs text-concrete">
              {new Date().toLocaleDateString('en-CA', { weekday: 'long', month: 'long', day: 'numeric' })}
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {active === 'dashboard' && <DashboardView profile={profile} />}
          {active === 'units' && <UnitsView />}
          {active === 'ai' && <AIAssistantView />}
          {active !== 'dashboard' && active !== 'units' && active !== 'ai' && <PlaceholderView name={NAV_ITEMS.find(n => n.id === active)?.name || ''} />}
        </div>
      </main>
    </div>
  );
}

function DashboardView({ profile }: any) {
  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <div className="text-xs text-gold uppercase tracking-widest mb-1">Good morning</div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white">
          {profile?.name ? profile.name.split(' ')[0] : 'Welcome'}, here's what's happening.
        </h1>
      </div>

      {/* KPI tiles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiTile label="Active Lots" value="44" sub="11 in finishing" />
        <KpiTile label="Inspections This Week" value="12" sub="3 pending" />
        <KpiTile label="Open Deficiencies" value="27" sub="8 urgent" warning />
        <KpiTile label="Closings Next 30d" value="6" sub="next: May 28" highlight />
      </div>

      {/* Quick actions */}
      <div>
        <div className="text-xs text-concrete uppercase tracking-widest mb-2">Quick Actions</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <QuickAction icon={BookOpen} label="Start Daily Log" />
          <QuickAction icon={AlertCircle} label="Log Deficiency" />
          <QuickAction icon={ClipboardCheck} label="Call Inspection" />
          <QuickAction icon={Bot} label="Ask AI" badge="NEW" />
        </div>
      </div>

      {/* Sample empty state */}
      <div className="card p-8 text-center">
        <HardHat size={32} className="text-gold mx-auto mb-3" />
        <h3 className="text-white font-semibold mb-1">BuilderPilot is ready</h3>
        <p className="text-concrete text-sm max-w-md mx-auto">
          This is the sample dashboard for <strong className="text-white">Aurora Trails</strong>, a demo community of 44 townhomes.
          Connect your data, add your sites, and start running your day from one screen.
        </p>
      </div>
    </div>
  );
}

function KpiTile({ label, value, sub, warning, highlight }: any) {
  return (
    <div className={`card p-4 ${warning ? 'border-amber-700/50' : ''} ${highlight ? 'border-gold/30' : ''}`}>
      <div className="text-[10px] text-concrete uppercase tracking-widest">{label}</div>
      <div className={`text-2xl md:text-3xl font-extrabold mt-1 ${warning ? 'text-amber-400' : highlight ? 'text-gold' : 'text-white'}`}>
        {value}
      </div>
      <div className="text-xs text-concrete mt-0.5">{sub}</div>
    </div>
  );
}

function QuickAction({ icon: Icon, label, badge }: any) {
  return (
    <button className="card p-4 hover:border-gold/50 transition text-left group">
      <div className="flex items-start justify-between mb-2">
        <Icon className="text-gold" size={20} />
        {badge && <span className="bg-gold text-ink text-[9px] font-bold px-1.5 py-0.5 rounded">{badge}</span>}
      </div>
      <div className="text-sm font-medium text-white group-hover:text-gold transition">{label}</div>
    </button>
  );
}

function PlaceholderView({ name }: { name: string }) {
  return (
    <div className="card p-12 text-center">
      <HardHat size={40} className="text-gold mx-auto mb-4" />
      <h3 className="text-xl font-bold text-white mb-2">{name}</h3>
      <p className="text-concrete text-sm max-w-md mx-auto">
        This module will b