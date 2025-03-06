'use client';

import { useTheme } from 'next-themes';
import { FaSun, FaMoon } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className="fixed top-4 right-4 p-2 rounded-full bg-amber-100 dark:bg-zinc-800 
                text-amber-600 dark:text-amber-400 hover:bg-amber-200 
                dark:hover:bg-zinc-700 transition-colors"
      aria-label="Toggle theme"
    >
      {resolvedTheme === 'dark' ? <FaSun size={20} /> : <FaMoon size={20} />}
    </motion.button>
  );
} 