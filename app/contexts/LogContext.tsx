'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';

export type ShitLog = {
  id: number;
  timestamp: Date;
  location?: {
    latitude: number;
    longitude: number;
  };
  status: 'pending' | 'confirmed';
};

type LogContextType = {
  logs: ShitLog[];
  addLog: (log: Omit<ShitLog, 'id' | 'status'>) => Promise<void>;
  stats: {
    totalShits: number;
    tokensEarned: number;
    lastSession?: Date;
  };
  isLoading: boolean;
};

const LogContext = createContext<LogContextType | null>(null);

export function LogProvider({ children }: { children: React.ReactNode }) {
  const { user } = usePrivy();
  const [logs, setLogs] = useState<ShitLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate fetching initial data
  useEffect(() => {
    if (user) {
      setIsLoading(true);
      // TODO: Replace with actual blockchain data fetch
      setTimeout(() => {
        setLogs([
          {
            id: 42,
            timestamp: new Date('2025-03-08T08:30:00'),
            location: { latitude: 3.043626, longitude: 101.584689 },
            status: 'confirmed'
          },
          {
            id: 41,
            timestamp: new Date('2025-03-07T15:45:00'),
            status: 'confirmed'
          },
        ]);
        setIsLoading(false);
      }, 1000);
    }
  }, [user]);

  const addLog = async (newLog: Omit<ShitLog, 'id' | 'status'>) => {
    // Add pending log immediately for optimistic UI
    const pendingLog: ShitLog = {
      ...newLog,
      id: Date.now(), // Temporary ID
      status: 'pending'
    };
    
    setLogs(prev => [pendingLog, ...prev]);

    try {
      // TODO: Replace with actual blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update log status to confirmed
      setLogs(prev => prev.map(log => 
        log.id === pendingLog.id 
          ? { ...log, status: 'confirmed' as const }
          : log
      ));
    } catch (error) {
      // Remove failed log
      setLogs(prev => prev.filter(log => log.id !== pendingLog.id));
      throw error;
    }
  };

  const stats = {
    totalShits: logs.filter(log => log.status === 'confirmed').length,
    tokensEarned: logs.filter(log => log.status === 'confirmed').length * 3, // 3 tokens per shit
    lastSession: logs.find(log => log.status === 'confirmed')?.timestamp
  };

  return (
    <LogContext.Provider value={{ logs, addLog, stats, isLoading }}>
      {children}
    </LogContext.Provider>
  );
}

export function useLogs() {
  const context = useContext(LogContext);
  if (!context) {
    throw new Error('useLogs must be used within a LogProvider');
  }
  return context;
} 