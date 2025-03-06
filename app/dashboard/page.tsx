'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Header from '../components/Header';
import SessionOverview from '../components/SessionOverview';
import Leaderboard from '../components/Leaderboard';

export default function Dashboard() {
  const { ready, authenticated } = usePrivy();
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
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        <div className="space-y-8">
          <SessionOverview />
          <Leaderboard />
        </div>
      </main>
    </div>
  );
} 