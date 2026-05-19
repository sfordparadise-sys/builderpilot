'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseClient } from '@/lib/supabase';
import { HardHat, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createSupabaseClient();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/');
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center p-4">
      {/* Background gradient effect */}
      <div className="fixed inset-0 bg-gradient-to-br from-ink via-ink-800 to-ink pointer-events-none" />
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, #F5B400 0%, transparent 50%), radial-gradient(circle at 80% 80%, #F5B400 0%, transparent 50%)'
        }} />

      <div className="relative w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-ink-800 border-2 border-gold rounded-lg">
            <HardHat className="text-gold" size={32} />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Builder<span className="text-gold">Pilot</span>
          </h1>
          <p className="text-concrete text-sm mt-2">Run Your Sites. Not Just Your Day.</p>
        </div>

        {/* Login card */}
        <div className="card p-6 shadow-tool-lg">
          <h2 className="text-lg font-semibold mb-4 text-white">Sign in</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-concrete uppercase tracking-wide mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full bg-ink border border-ink-700 rounded px-3 py-2 text-white placeholder-ink-400 focus:border-gold focus:outline-none"
                placeholder="you@company.com"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-concrete uppercase tracking-wide mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full bg-ink border border-ink-700 rounded px-3 py-2 text-white focus:border-gold focus:outline-none"
              />
            </div>
            {error && (
              <div className="bg-red-950/40 border border-red-900 rounded px-3 py-2 text-red-300 text-sm">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-gold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : null}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center text-concrete text-xs mt-6">
          Built by site supers. For site supers.
        </p>
      </div>
    </div>
  );
}
