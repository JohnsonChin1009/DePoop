'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaTrophy, FaMedal, FaAward, FaSpinner } from 'react-icons/fa';

type LeaderboardEntry = {
  user: string;
  count: number;
};

export default function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/getUsersPoopCount', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        const data = await response.json();
        
        if (Array.isArray(data)) {
          // Sort by count in descending order
          const sortedData = [...data].sort((a, b) => b.count - a.count);
          setLeaderboardData(sortedData);
        } else {
          setLeaderboardData([]);
        }
      } catch (error) {
        console.error('Error fetching leaderboard data:', error);
        setLeaderboardData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboardData();
  }, []);

  // Format wallet address
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Get medal for position
  const getMedal = (position: number) => {
    switch (position) {
      case 0:
        return <FaTrophy className="text-yellow-500" />;
      case 1:
        return <FaMedal className="text-gray-400" />;
      case 2:
        return <FaMedal className="text-amber-700" />;
      default:
        return <FaAward className="text-zinc-500" />;
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg overflow-hidden">
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-700">
        <h2 className="text-xl font-bold">Global Leaderboard</h2>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center">
            <FaSpinner className="animate-spin text-amber-600 text-2xl mb-2" />
            <p>Loading leaderboard...</p>
          </div>
        </div>
      ) : leaderboardData.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-zinc-500 dark:text-zinc-400">No data available yet.</p>
        </div>
      ) : (
        <div className="divide-y divide-zinc-200 dark:divide-zinc-700">
          {leaderboardData.map((entry, index) => (
            <motion.div
              key={entry.user}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex items-center p-4 ${index < 3 ? 'bg-amber-50/50 dark:bg-amber-900/10' : ''}`}
            >
              <div className="w-8 flex justify-center">
                <span className="font-bold text-zinc-500">{index + 1}</span>
              </div>
              
              <div className="w-8 flex justify-center mx-2">
                {getMedal(index)}
              </div>
              
              <div className="flex-grow">
                <p className="font-medium">{formatAddress(entry.user)}</p>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-amber-600 font-bold">{entry.count}</span>
                <span className="text-xs text-zinc-500">shits</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
} 