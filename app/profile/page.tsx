'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaUser, FaWallet, FaCoins, FaPoop, FaTwitter, FaGithub, FaMapMarkerAlt, FaArrowLeft } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import { useLogs } from '../contexts/LogContext';

// Add proper type for BlockchainLog
type BlockchainLog = {
  user: string;
  latitude: number;
  longitude: number;
  sessionDuration: number;
  timestamp: string;
};

export default function Profile() {
  const { ready, authenticated, user } = usePrivy();
  const router = useRouter();
  const { logs } = useLogs();
  const [isLoading, setIsLoading] = useState(true);
  const [blockchainLogs, setBlockchainLogs] = useState<BlockchainLog[]>([]);

  useEffect(() => {
    if (ready && !authenticated) {
      router.push('/');
    }
  }, [ready, authenticated, router]);

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
        }
      } catch (error) {
        console.error('Error fetching blockchain logs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlockchainLogs();
  }, [user?.wallet?.address]);

  if (!ready || !authenticated) {
    return null;
  }

  // Calculate total logs (local + blockchain)
  const totalLogs = logs.length + blockchainLogs.length;
  
  // Calculate total tokens earned (3 per log)
  const tokensEarned = totalLogs * 3;

  // Fix the type issue in the logsWithLocation calculation
  const logsWithLocation = [
    ...logs, 
    ...blockchainLogs.map((log: BlockchainLog) => ({
      location: { 
        latitude: log.latitude / 1000000, 
        longitude: log.longitude / 1000000 
      }
    }))
  ].filter(log => log.location).length;

  // Format wallet address
  const walletAddress = user?.wallet?.address;
  const formattedWallet = walletAddress
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : '';

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <Header />
      <main className="container mx-auto px-4 py-4 md:pt-24 md:pb-12">
        <div className="flex items-center gap-4 mb-6 md:mb-8">
          <motion.button
            onClick={() => router.push('/dashboard')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="hidden md:flex p-2 hover:bg-white dark:hover:bg-zinc-800 rounded-full transition-colors"
            aria-label="Back to Dashboard"
          >
            <FaArrowLeft className="w-6 h-6" />
          </motion.button>
          <h1 className="text-3xl font-bold">Your Profile</h1>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {/* Profile Card */}
          <div className="md:col-span-1">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg overflow-hidden"
            >
              <div className="bg-gradient-to-r from-amber-500 to-amber-600 h-24 md:h-32"></div>
              <div className="px-4 md:px-6 pb-6 -mt-12 md:-mt-16">
                <div className="flex justify-center">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-700 flex items-center justify-center shadow-lg">
                    <FaUser className="w-12 h-12 md:w-16 md:h-16 text-amber-600 dark:text-amber-400" />
                  </div>
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-center mt-3 md:mt-4 truncate">
                  {user?.email?.address || 'DePoop User'}
                </h2>
                <p className="text-zinc-500 dark:text-zinc-400 text-center text-xs md:text-sm">
                  Joined {new Date().toLocaleDateString()}
                </p>
                
                <div className="mt-4 md:mt-6 flex items-center justify-center">
                  <div className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-zinc-100 dark:bg-zinc-700 rounded-full">
                    <FaWallet className="text-amber-600 text-sm md:text-base" />
                    <span className="text-xs md:text-sm font-medium truncate max-w-[150px]">{formattedWallet}</span>
                  </div>
                </div>
                
                <div className="mt-4 md:mt-6 grid grid-cols-3 gap-2 md:gap-4">
                  <div className="bg-zinc-100 dark:bg-zinc-700 p-2 md:p-4 rounded-lg text-center">
                    <div className="flex justify-center mb-1 md:mb-2">
                      <FaPoop className="text-amber-600 text-lg md:text-xl" />
                    </div>
                    <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400">Shits</p>
                    <p className="text-lg md:text-xl font-bold">{isLoading ? '...' : totalLogs}</p>
                  </div>
                  
                  <div className="bg-zinc-100 dark:bg-zinc-700 p-2 md:p-4 rounded-lg text-center">
                    <div className="flex justify-center mb-1 md:mb-2">
                      <FaCoins className="text-amber-600 text-lg md:text-xl" />
                    </div>
                    <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400">Tokens</p>
                    <p className="text-lg md:text-xl font-bold">{isLoading ? '...' : tokensEarned}</p>
                  </div>
                  
                  <div className="bg-zinc-100 dark:bg-zinc-700 p-2 md:p-4 rounded-lg text-center">
                    <div className="flex justify-center mb-1 md:mb-2">
                      <FaMapMarkerAlt className="text-amber-600 text-lg md:text-xl" />
                    </div>
                    <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400">Places</p>
                    <p className="text-lg md:text-xl font-bold">{isLoading ? '...' : logsWithLocation}</p>
                  </div>
                </div>
                
                <div className="mt-4 md:mt-6 flex justify-center gap-3 md:gap-4">
                  <motion.a
                    href="https://twitter.com/DePoopApp"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 md:p-3 bg-zinc-100 dark:bg-zinc-700 rounded-full text-blue-400 hover:bg-blue-50 dark:hover:bg-zinc-600 transition-colors"
                  >
                    <FaTwitter size={16} className="md:w-5 md:h-5" />
                  </motion.a>
                  
                  <motion.a
                    href="https://github.com/DePoopApp"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 md:p-3 bg-zinc-100 dark:bg-zinc-700 rounded-full text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-600 transition-colors"
                  >
                    <FaGithub size={16} className="md:w-5 md:h-5" />
                  </motion.a>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Stats and Info */}
          <div className="md:col-span-2">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg p-4 md:p-6 mb-6"
            >
              <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4">About DePoop</h2>
              <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-400 mb-3 md:mb-4">
                DePoop is a revolutionary app that helps you track your bathroom habits while earning tokens on the blockchain. Every logged session earns you 3 DePoop tokens that can be used in our ecosystem.
              </p>
              <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-400">
                Your data is securely stored on the blockchain, giving you complete ownership and privacy. Join our community of users who are changing the way we think about personal health tracking.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg p-4 md:p-6"
            >
              <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4">Your Achievements</h2>
              
              {isLoading ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-600" />
                </div>
              ) : (
                <div className="space-y-3 md:space-y-4">
                  <motion.div 
                    whileHover={{ scale: 1.01 }}
                    className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-zinc-100 dark:bg-zinc-700 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-600 transition-colors"
                  >
                    <div className="p-2 md:p-3 bg-amber-100 dark:bg-amber-900/50 rounded-full flex-shrink-0">
                      <FaPoop className="text-amber-600 text-base md:text-xl" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <h3 className="font-medium text-sm md:text-base">Regular Contributor</h3>
                      <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 truncate">
                        {totalLogs > 0 
                          ? `You've logged ${totalLogs} sessions. Keep it up!` 
                          : 'Start logging your sessions to earn this badge!'}
                      </p>
                    </div>
                    {totalLogs > 0 && (
                      <div className="ml-auto flex-shrink-0">
                        <div className="w-5 h-5 md:w-6 md:h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      </div>
                    )}
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ scale: 1.01 }}
                    className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-zinc-100 dark:bg-zinc-700 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-600 transition-colors"
                  >
                    <div className="p-2 md:p-3 bg-amber-100 dark:bg-amber-900/50 rounded-full flex-shrink-0">
                      <FaCoins className="text-amber-600 text-base md:text-xl" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <h3 className="font-medium text-sm md:text-base">Token Collector</h3>
                      <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 truncate">
                        {tokensEarned > 0 
                          ? `You've earned ${tokensEarned} DePoop tokens!` 
                          : 'Log your first session to start earning tokens!'}
                      </p>
                    </div>
                    {tokensEarned > 0 && (
                      <div className="ml-auto flex-shrink-0">
                        <div className="w-5 h-5 md:w-6 md:h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      </div>
                    )}
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ scale: 1.01 }}
                    className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-zinc-100 dark:bg-zinc-700 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-600 transition-colors"
                  >
                    <div className="p-2 md:p-3 bg-amber-100 dark:bg-amber-900/50 rounded-full flex-shrink-0">
                      <FaWallet className="text-amber-600 text-base md:text-xl" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <h3 className="font-medium text-sm md:text-base">Blockchain Pioneer</h3>
                      <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 truncate">
                        {blockchainLogs.length > 0 
                          ? `You have ${blockchainLogs.length} logs on the blockchain!` 
                          : 'Get your data on the blockchain to earn this badge!'}
                      </p>
                    </div>
                    {blockchainLogs.length > 0 && (
                      <div className="ml-auto flex-shrink-0">
                        <div className="w-5 h-5 md:w-6 md:h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      </div>
                    )}
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ scale: 1.01 }}
                    className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-zinc-100 dark:bg-zinc-700 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-600 transition-colors"
                  >
                    <div className="p-2 md:p-3 bg-amber-100 dark:bg-amber-900/50 rounded-full flex-shrink-0">
                      <FaMapMarkerAlt className="text-amber-600 text-base md:text-xl" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <h3 className="font-medium text-sm md:text-base">Location Explorer</h3>
                      <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 truncate">
                        {logsWithLocation > 0 
                          ? `You've logged ${logsWithLocation} different locations!` 
                          : 'Enable location tracking to earn this badge!'}
                      </p>
                    </div>
                    {logsWithLocation > 0 && (
                      <div className="ml-auto flex-shrink-0">
                        <div className="w-5 h-5 md:w-6 md:h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
} 