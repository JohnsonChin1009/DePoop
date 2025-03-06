'use client';

import { motion } from 'framer-motion';
import { FaPoop, FaCoins, FaClock, FaHistory } from 'react-icons/fa';
import Link from 'next/link';
import { useLogs } from '../contexts/LogContext';

export default function SessionOverview() {
  const { stats, isLoading } = useLogs();

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

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-6">
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
                {isLoading ? '...' : stats.totalShits}
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
                {isLoading ? '...' : stats.tokensEarned}
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
                {isLoading ? '...' : formatTimeAgo(stats.lastSession)}
              </h3>
            </div>
          </div>
        </motion.div>
      </div>
      
      <Link href="/history" className="block w-full">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full p-4 bg-white dark:bg-zinc-800 rounded-xl shadow-lg
                   flex items-center justify-center gap-2 text-amber-600 dark:text-amber-400
                   hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors"
        >
          <FaHistory />
          <span>View All Logs</span>
        </motion.button>
      </Link>
    </div>
  );
} 