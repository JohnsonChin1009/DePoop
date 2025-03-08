'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Header from '../components/Header';
import SessionOverview from '../components/SessionOverview';
import Leaderboard from '../components/Leaderboard';
import ShitMap from '../components/ShitMap';

export default function Dashboard() {
  const { ready, authenticated} = usePrivy();
  const router = useRouter();

  useEffect(() => {
    if (ready && !authenticated) {
      router.push('/');
    }
  }, [ready, authenticated, router]);

  if (!ready || !authenticated) {
    return null;
  }

  return (
    <>
      <main className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
        <Header />
        <main className="container mx-auto px-4 py-4 md:pt-24 md:pb-12">
          <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
          
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <div>
            <h2 className="text-2xl font-bold mb-4">Your Stats</h2>
            <SessionOverview />
            </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
            <Leaderboard />
            </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Your Shit Map</h2>
          <ShitMap />
        </div>
        </main>
      </main>
    </>
  );
}
