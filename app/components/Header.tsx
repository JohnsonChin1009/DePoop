'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePrivy } from '@privy-io/react-auth';
import { motion } from 'framer-motion';
import { FaSignOutAlt, FaPoop, FaHome, FaHistory, FaUser } from 'react-icons/fa';
import LogModal from './LogModal';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

export default function Header() {
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const { user, logout } = usePrivy();
  const pathname = usePathname();
  
  const walletAddress = user?.wallet?.address;
  const formattedWallet = walletAddress
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : '';

  return (
    <>
      {/* Top Header - Always visible */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border-b border-zinc-200 dark:border-zinc-800 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-center md:justify-between">
          <Link href="/" className="text-2xl font-bold text-amber-600 flex flex-row items-center ">
            <Image src="/depoop-logo-big.png" alt="DePoop" width={48} height={48} />DePoop
          </Link>

          {/* Desktop Navigation - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-amber-600 text-white rounded-full font-medium text-sm"
              onClick={() => setIsLogModalOpen(true)}
            >
              Log a Shit
            </motion.button>

            <div className="flex items-center gap-2">
              <Link href="/profile" className="flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium">{formattedWallet}</span>
              </Link>
              
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
        </div>
      </header>

      {/* Mobile Bottom Navigation - Only visible on mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 z-10">
        <div className="grid grid-cols-5 h-16">
          <Link href="/dashboard" className="flex flex-col items-center justify-center">
            <div className={`p-2 ${pathname === '/dashboard' ? 'text-amber-600' : 'text-zinc-600 dark:text-zinc-400'}`}>
              <FaHome size={20} />
            </div>
            <span className="text-xs">Home</span>
          </Link>
          
          <Link href="/history" className="flex flex-col items-center justify-center">
            <div className={`p-2 ${pathname === '/history' ? 'text-amber-600' : 'text-zinc-600 dark:text-zinc-400'}`}>
              <FaHistory size={20} />
            </div>
            <span className="text-xs">History</span>
          </Link>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center justify-center"
            onClick={() => setIsLogModalOpen(true)}
          >
            <div className="p-3 bg-amber-600 rounded-full -mt-8 shadow-lg">
              <FaPoop size={24} className="text-white" />
            </div>
            <span className="text-xs mt-1">Log</span>
          </motion.button>
          
          <Link href="/profile" className="flex flex-col items-center justify-center">
            <div className={`p-2 ${pathname === '/profile' ? 'text-amber-600' : 'text-zinc-600 dark:text-zinc-400'}`}>
              <FaUser size={20} />
            </div>
            <span className="text-xs">Profile</span>
          </Link>
          
          <button onClick={logout} className="flex flex-col items-center justify-center">
            <div className="p-2 text-zinc-600 dark:text-zinc-400">
              <FaSignOutAlt size={20} />
            </div>
            <span className="text-xs">Logout</span>
          </button>
        </div>
      </nav>

      {/* Add padding to the bottom of the page on mobile to account for the navigation */}
      <div className="md:hidden h-16"></div>

      <LogModal 
        isOpen={isLogModalOpen} 
        onClose={() => setIsLogModalOpen(false)} 
      />
    </>
  );
} 