'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaMapMarkerAlt, FaSort, FaFilter, FaArrowLeft } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import { useLogs } from '../contexts/LogContext';

type ShitLog = {
  id: number;
  timestamp: Date;
  notes?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  status: 'pending' | 'confirmed';
};

export default function History() {
  const { ready, authenticated } = usePrivy();
  const router = useRouter();
  const { logs, isLoading } = useLogs();
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showLocationOnly, setShowLocationOnly] = useState(false);

  useEffect(() => {
    if (ready && !authenticated) {
      router.push('/');
    }
  }, [ready, authenticated, router]);

  if (!ready || !authenticated) {
    return null;
  }

  const filteredLogs = logs
    .filter(log => !showLocationOnly || log.location)
    .sort((a, b) => {
      const order = sortOrder === 'desc' ? -1 : 1;
      return order * (a.timestamp.getTime() - b.timestamp.getTime());
    });

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <motion.button
              onClick={() => router.push('/dashboard')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 hover:bg-white dark:hover:bg-zinc-800 rounded-full transition-colors"
              aria-label="Back to Dashboard"
            >
              <FaArrowLeft className="w-6 h-6" />
            </motion.button>
            <h1 className="text-3xl font-bold">Your Shit History</h1>
          </div>
          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-800 
                       rounded-lg shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-700/50 
                       transition-colors"
            >
              <FaSort />
              <span>{sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowLocationOnly(prev => !prev)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-sm
                         transition-colors ${
                           showLocationOnly
                             ? 'bg-amber-100 dark:bg-amber-900/20 text-amber-600'
                             : 'bg-white dark:bg-zinc-800'
                         }`}
            >
              <FaFilter />
              <span>Location Only</span>
            </motion.button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600" />
          </div>
        ) : (
          <div className="space-y-4">
            {filteredLogs.map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white dark:bg-zinc-800 rounded-xl p-6 shadow-lg
                  ${log.status === 'pending' ? 'opacity-70' : ''}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold">
                    Shit #{log.id}
                    {log.status === 'pending' && (
                      <span className="ml-2 text-sm text-amber-600">
                        (Pending...)
                      </span>
                    )}
                  </h3>
                  <span className="text-sm text-zinc-500">
                    {formatDate(log.timestamp)}
                  </span>
                </div>
                {log.notes && (
                  <p className="text-zinc-600 dark:text-zinc-400 mb-4">{log.notes}</p>
                )}
                {log.location && (
                  <a
                    href={`https://www.google.com/maps?q=${log.location.latitude},${log.location.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-amber-600 hover:text-amber-700"
                  >
                    <FaMapMarkerAlt />
                    <span>View Location</span>
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
} 