'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePrivy } from '@privy-io/react-auth';
import { motion } from 'framer-motion';
import { FaSignOutAlt } from 'react-icons/fa';
import LogModal from './LogModal';

export default function Header() {
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const { user, logout } = usePrivy();
  const walletAddress = user?.wallet?.address;
  const formattedWallet = walletAddress
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : '';

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border-b border-zinc-200 dark:border-zinc-800">
        <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-amber-600">
            ShitMap
          </Link>

          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-amber-600 text-white rounded-full font-medium"
              onClick={() => setIsLogModalOpen(true)}
            >
              Log a Shit
            </motion.button>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium">{formattedWallet}</span>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={logout}
                className="p-2 text-zinc-600 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-amber-400"
                aria-label="Logout"
              >
                <FaSignOutAlt size={20} />
              </motion.button>
            </div>
          </div>
        </nav>
      </header>
      <LogModal 
        isOpen={isLogModalOpen} 
        onClose={() => setIsLogModalOpen(false)} 
      />
    </>
  );
} 