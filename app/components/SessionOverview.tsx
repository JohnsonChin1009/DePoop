'use client';

import { motion } from 'framer-motion';
import { FaPoop, FaCoins, FaClock, FaHistory, FaMapMarkerAlt, FaLink } from 'react-icons/fa';
import Link from 'next/link';
import { useLogs } from '../contexts/LogContext';
import { useEffect, useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';

type BlockchainLog = {
  user: string;
  latitude: number;
  longitude: number;
  sessionDuration: number;
  timestamp: string;
};

export default function SessionOverview() {
  const { logs } = useLogs();
  const { user } = usePrivy();
  const [blockchainLogs, setBlockchainLogs] = useState<BlockchainLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch blockchain logs
  useEffect(() => {
    const fetchBlockchainLogs = async () => {
      if (!user?.wallet?.address) return;
      
      setIsLoading(true);
      try {
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
        
        if (data.message && Array.isArray(data.message)) {
          setBlockchainLogs(data.message);
        } else {
          setBlockchainLogs([]);
        }
      } catch (error) {
        console.error('Error fetching blockchain logs:', error);
        setBlockchainLogs([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlockchainLogs();
  }, [user?.wallet?.address]);

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

  // Combine and sort all logs by timestamp (newest first)
  const allLogs = [...logs, ...formattedBlockchainLogs].sort((a, b) => 
    b.timestamp.getTime() - a.timestamp.getTime()
  );

  // Assign sequential IDs
  const logsWithSequentialIds = allLogs.map((log, index) => ({
    ...log,
    sequentialId: allLogs.length - index
  }));

  // Get the 3 most recent logs
  const recentLogs = logsWithSequentialIds.slice(0, 3);

  // Calculate stats directly from allLogs
  const totalShits = allLogs.filter(log => log.status === 'confirmed').length;
  const tokensEarned = totalShits * 3; // 3 tokens per shit
  const lastSession = allLogs.find(log => log.status === 'confirmed')?.timestamp;

  const formatTimeAgo = (date?: Date) => {
    if (!date) return 'No sessions yet';
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }).format(date);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-3 gap-3 md:gap-6 w-auto">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-lg"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-100 dark:bg-amber-900/50 rounded-lg">
              <FaPoop className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Total Shits</p>
              <h3 className="text-2xl font-bold">
                {isLoading ? '...' : totalShits}
              </h3>
            </div>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-lg"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-100 dark:bg-amber-900/50 rounded-lg">
              <FaCoins className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Tokens Earned</p>
              <h3 className="text-2xl font-bold">
                {isLoading ? '...' : tokensEarned}
              </h3>
            </div>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-lg"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-100 dark:bg-amber-900/50 rounded-lg">
              <FaClock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Latest Session</p>
              <h3 className="text-lg font-bold">
                {isLoading ? '...' : formatTimeAgo(lastSession)}
              </h3>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Recent Logs Preview */}
      <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold mb-4">Recent Logs</h3>
        
        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-600" />
          </div>
        ) : recentLogs.length === 0 ? (
          <p className="text-zinc-500 dark:text-zinc-400 text-center py-4">
            No logs yet. Start tracking your shits!
          </p>
        ) : (
          <div className="space-y-3">
            {recentLogs.map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3 border-l-4 border-amber-500 bg-zinc-50 dark:bg-zinc-700/50 rounded-r-lg
                  ${log.status === 'pending' ? 'opacity-70' : ''}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">
                        Shit #{log.sequentialId}
                      </p>
                      {log.status === 'pending' && (
                        <span className="text-xs text-amber-600">
                          (Pending...)
                        </span>
                      )}
                      {'isBlockchain' in log && (
                        <span className="text-xs text-blue-600 flex items-center gap-1">
                          <FaLink size={10} />
                          <span>On-Chain</span>
                        </span>
                      )}
                    </div>
                    
                    {('duration' in log && log.duration) && (
                      <p className="text-xs text-zinc-600 dark:text-zinc-400">
                        Duration: {formatDuration(log.duration)}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-zinc-500">{formatDate(log.timestamp)}</p>
                    {log.location && (
                      <p className="text-xs flex items-center justify-end gap-1 text-amber-600">
                        <FaMapMarkerAlt size={10} />
                        <span>Location added</span>
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        
        <Link href="/history" className="block w-full mt-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full p-3 bg-zinc-100 dark:bg-zinc-700 rounded-lg
                     flex items-center justify-center gap-2 text-amber-600 dark:text-amber-400
                     hover:bg-zinc-200 dark:hover:bg-zinc-600 transition-colors"
          >
            <FaHistory />
            <span>View All Logs</span>
          </motion.button>
        </Link>
      </div>
    </div>
  );
} 