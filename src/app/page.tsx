'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { HardHat } from 'lucide-react';
import { createSupabaseClient } from '@/lib/supabase';
import AuroraOperationsApp from '@/components/AuroraOperationsApp';

export default function HomePage() {
  const router = useRouter();
  const supabase = createSupabaseClient();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    async function init() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      setUser(user);

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      setProfile(
        data || {
          id: user.id,
          email: user.email,
          role: 'supervisor',
          name: user.email,
        }
      );

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
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-300">
        <div className="flex items-center gap-3">
          <HardHat className="animate-pulse text-amber-400" size={28} />
          <span>Loading BuilderPilot...</span>
        </div>
      </div>
    );
  }

  return (
    <AuroraOperationsApp
      profile={profile}
      user={user}
      onSignOut={signOut}
    />
  );
}
