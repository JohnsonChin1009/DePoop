'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaSort, FaArrowLeft, FaLink } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import { useLogs } from '../contexts/LogContext';
import ShitMap from '../components/ShitMap';

type BlockchainLog = {
  user: string;
  latitude: number;
  longitude: number;
  sessionDuration: number;
  timestamp: string;
};

export default function History() {
  const { ready, authenticated, user } = usePrivy();
  const router = useRouter();
  const { logs } = useLogs();
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [blockchainLogs, setBlockchainLogs] = useState<BlockchainLog[]>([]);
  const [isLoadingBlockchain, setIsLoadingBlockchain] = useState(false);

  useEffect(() => {
    if (ready && !authenticated) {
      router.push('/');
    }
  }, [ready, authenticated, router]);

  // Fetch blockchain logs
  useEffect(() => {
    const fetchBlockchainLogs = async () => {
      if (!user?.wallet?.address) return;
      
      setIsLoadingBlockchain(true);
      try {
        console.log("Fetching blockchain logs for:", user.wallet.address);
        
        const response = await fetch('/api/getUserPoopData', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            address: user.wallet.address
          }),
        });
        
        const data = await response.json();
        console.log("Received blockchain data:", data);
        
        if (data.message && Array.isArray(data.message)) {
          setBlockchainLogs(data.message);
        } else {
          // If no valid data, set empty array
          setBlockchainLogs([]);
        }
      } catch (error) {
        console.error('Error fetching blockchain logs:', error);
        // Set empty array on error
        setBlockchainLogs([]);
      } finally {
        setIsLoadingBlockchain(false);
        console.log("Blockchain loading complete");
      }
    };

    fetchBlockchainLogs();
  }, [user?.wallet?.address]);

  if (!ready || !authenticated) {
    return null;
  }

  // Convert blockchain logs to a format compatible with local logs
  const formattedBlockchainLogs = blockchainLogs.map((log, index) => ({
    id: `chain-${index}`,
    timestamp: new Date(parseInt(log.timestamp) * 1000),
    location: {
      latitude: log.latitude / 1000000,
      longitude: log.longitude / 1000000
    },
    status: 'confirmed' as const,
    duration: log.sessionDuration,
    isBlockchain: true
  }));

  // Combine local and blockchain logs
  const allLogs = [...logs, ...formattedBlockchainLogs].sort((a, b) => 
    b.timestamp.getTime() - a.timestamp.getTime()
  );

  // Then assign sequential IDs based on the sorted order
  const logsWithSequentialIds = allLogs.map((log, index) => ({
    ...log,
    sequentialId: allLogs.length - index // Newest log gets highest number
  }));

  // Then apply the user's sort preference
  const filteredLogs = logsWithSequentialIds
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

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <Header />
      <main className="container mx-auto px-4 py-4 md:pt-24 md:pb-12">
        <div className="mb-8">
          <ShitMap />
        </div>
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <motion.button
              onClick={() => router.push('/dashboard')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 hidden md:block hover:bg-white dark:hover:bg-zinc-800 rounded-full transition-colors"
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
          </div>
        </div>

        {isLoadingBlockchain ? (
          <div className="flex justify-center py-12">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600 mb-4" />
              <p>Loading blockchain data...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredLogs.length === 0 ? (
              <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 shadow-lg text-center">
                <p className="text-zinc-600 dark:text-zinc-400">No logs found. Start tracking your shits!</p>
              </div>
            ) : (
              filteredLogs.map((log) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-white dark:bg-zinc-800 rounded-xl p-6 shadow-lg
                    ${log.status === 'pending' ? 'opacity-70' : ''}`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold">
                        Shit #{log.sequentialId}
                      </h3>
                      {log.status === 'pending' && (
                        <span className="text-sm text-amber-600 bg-amber-100 dark:bg-amber-900/20 px-2 py-1 rounded-full">
                          Pending...
                        </span>
                      )}
                      {'isBlockchain' in log && (
                        <span className="text-sm text-blue-600 bg-blue-100 dark:bg-blue-900/20 px-2 py-1 rounded-full flex items-center gap-1">
                          <FaLink size={12} />
                          On-Chain
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-zinc-500">
                      {formatDate(log.timestamp)}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 items-center">
                    {('duration' in log && log.duration) ? (
                      <div className="text-sm text-zinc-600 dark:text-zinc-400">
                        <span className="font-medium">Duration:</span> {formatDuration(log.duration)}
                      </div>
                    ) : (
                      <div className="text-sm text-zinc-600 dark:text-zinc-400">
                        <span className="font-medium">Duration:</span> Unknown
                      </div>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
} 