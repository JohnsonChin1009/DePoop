'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCrown, FaMedal } from 'react-icons/fa';

type LeaderboardEntry = {
  rank: number;
  address: string;
  username?: string;
  totalShits: number;
};

export default function Leaderboard() {
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly'>('weekly');
  
  // Mock data - replace with real data from blockchain
  const mockData: LeaderboardEntry[] = [
    { rank: 1, address: "0x1234...5678", username: "CryptoShitter", totalShits: 42 },
    { rank: 2, address: "0x8765...4321", username: "ThroneMaster", totalShits: 38 },
    { rank: 3, address: "0x9876...1234", username: "PoopChamp", totalShits: 35 },
    // ... add more mock entries
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <FaCrown className="text-yellow-500" size={20} />;
      case 2:
        return <FaMedal className="text-gray-400" size={20} />;
      case 3:
        return <FaMedal className="text-amber-600" size={20} />;
      default:
        return <span className="font-bold">{rank}</span>;
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Leaderboard</h2>
        <div className="flex gap-2 bg-zinc-100 dark:bg-zinc-700 p-1 rounded-full">
          {(['weekly', 'monthly'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setTimeframe(tab)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                ${timeframe === tab 
                  ? 'bg-white dark:bg-zinc-600 text-amber-600 dark:text-amber-400' 
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-amber-400'
                }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {mockData.map((entry) => (
          <motion.div
            key={entry.address}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-center justify-between p-4 rounded-lg
              ${entry.rank <= 3 
                ? 'bg-amber-50 dark:bg-amber-900/20' 
                : 'bg-zinc-50 dark:bg-zinc-700/30'
              }`}
          >
            <div className="flex items-center gap-4">
              <div className="w-8 flex justify-center">
                {getRankIcon(entry.rank)}
              </div>
              <div>
                <p className="font-medium">{entry.username}</p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {entry.address}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{entry.totalShits}</p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">shits</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 