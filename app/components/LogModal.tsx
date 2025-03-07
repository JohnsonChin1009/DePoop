'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaSpinner } from 'react-icons/fa';
import Modal from './ui/Modal';
import { useLogs } from '../contexts/LogContext';
import { useWallets } from '@privy-io/react-auth';
import { ethers } from 'ethers';

type LogModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function LogModal({ isOpen, onClose }: LogModalProps) {
  const [location, setLocation] = useState<GeolocationCoordinates | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timer, setTimer] = useState<number>(0);
  const [isTracking, setIsTracking] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { addLog } = useLogs();
  const { wallets } = useWallets();

  // Get location when modal opens
  useEffect(() => {
    if (isOpen) {
      getLocation();
    }
  }, [isOpen]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTracking) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTracking]);

  const getLocation = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      setLocation(position.coords);
      setIsLoading(false);
    } catch (error: unknown) {
      setError('Location is required to log your shit. Please enable location services and try again.');
      setIsLoading(false);
      console.log(error);
    }
  };

  const startTracking = () => {
    if (!location) {
      setError('Location is required to start tracking.');
      return;
    }
    
    setIsTracking(true);
    setTimer(0);
    setError(null);
  };

  const uploadToBlockchain = async (latitude: number, longitude: number, timestamp: number, sessionDuration: number) => {
    setIsUploading(true);
    try {
      console.log("Wallets Available: ", wallets);

      const userWallet = wallets[0];

      if (!userWallet) {
        throw new Error("No wallet found");
      }
      const provider = new ethers.BrowserProvider(await userWallet.getEthereumProvider());
      const signer = await provider.getSigner();

      const contractAbi = [
        {
          "inputs": [
            { "internalType": "int32", "name": "_latitude", "type": "int32" },
            { "internalType": "int32", "name": "_longitude", "type": "int32" },
            { "internalType": "uint32", "name": "_timestamp", "type": "uint32" },
            { "internalType": "uint16", "name": "_sessionDuration", "type": "uint16" }
          ],
          "name": "logPoopEvent",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        }
      ];
  
      const contractAddress = "0xAf6030F8362e9490469054d17AD629AF7F9F63c5";
      const contract = new ethers.Contract(contractAddress, contractAbi, signer);
  
      // Convert floating point coordinates to integers (multiply by 1,000,000)
      const latInt = Math.round(latitude * 1000000);
      const longInt = Math.round(longitude * 1000000);
      
      // Convert timestamp to seconds
      const timestampSeconds = Math.floor(timestamp / 1000);
      
      // Session duration in seconds (max 65535 due to uint16)
      const durationSeconds = Math.min(sessionDuration, 65535);
  
      const tx = await contract.logPoopEvent(latInt, longInt, timestampSeconds, durationSeconds);
      await tx.wait();
  
      console.log("Transaction Successful", tx.hash);
      return tx.hash;
    } catch (error: unknown) {
      console.error("Error uploading data to blockchain:", error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!location) {
      setError('Location is required to log your shit.');
      return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
      const now = new Date();
      
      // Create the log data
      const logData = {
        timestamp: now,
        location: {
          latitude: location.latitude,
          longitude: location.longitude
        }
      };

      // Try to upload to blockchain
      try {
        await uploadToBlockchain(
          location.latitude,
          location.longitude,
          now.getTime(),
          timer
        );
      } catch (blockchainError) {
        console.error("Blockchain upload failed, continuing with local log:", blockchainError);
      }

      // Add the log using our context
      await addLog(logData);
      
      // Reset state
      setLocation(null);
      setIsTracking(false);
      setTimer(0);
      
      onClose();
    } catch (error: unknown) {
      setError('Failed to log your shit. Please try again.');
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Log Your Shit">
      <div className="space-y-6">
        {error && (
          <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        
        <div className="flex flex-col items-center justify-center p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
          {isLoading ? (
            <div className="flex flex-col items-center">
              <FaSpinner className="animate-spin text-amber-600 text-3xl mb-2" />
              <p>Getting your location...</p>
            </div>
          ) : location ? (
            <>
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
                <FaMapMarkerAlt className="text-green-600 dark:text-green-400 text-2xl" />
              </div>
              <p className="text-center mb-2">Location acquired!</p>
              <p className="text-xs text-zinc-500 text-center mb-4">
                {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
              </p>
              
              {isTracking ? (
                <div className="w-full">
                  <div className="text-center mb-4">
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">Time elapsed</p>
                    <p className="text-3xl font-mono">{formatTime(timer)}</p>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmit}
                    disabled={isLoading || isUploading}
                    className="w-full p-3 bg-amber-600 text-white rounded-lg font-medium"
                  >
                    {isLoading || isUploading ? 
                      (isUploading ? 'Uploading to Blockchain...' : 'Logging...') : 
                      'Finish & Log'}
                  </motion.button>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={startTracking}
                  className="w-full p-3 bg-amber-600 text-white rounded-lg font-medium"
                >
                  Start Tracking
                </motion.button>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
                <FaMapMarkerAlt className="text-red-600 dark:text-red-400 text-2xl" />
              </div>
              <p className="text-center mb-4">Location is required</p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={getLocation}
                className="px-4 py-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg"
              >
                Try Again
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
} 