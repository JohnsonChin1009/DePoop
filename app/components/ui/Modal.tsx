'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { IoClose } from 'react-icons/io5';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
};

export default function Modal({ isOpen, onClose, children, title }: ModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50"
          >
            <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{title}</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-full transition-colors"
                >
                  <IoClose size={20} />
                </button>
              </div>
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 