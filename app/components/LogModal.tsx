'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaSpinner } from 'react-icons/fa';
import Modal from './ui/Modal';
import { useLogs } from '../contexts/LogContext';
import { useWallets } from '@privy-io/react-auth';
import { label } from 'framer-motion/client';
import { ethers } from 'ethers';

interface Proof {
  pi_a: string[];
  pi_b: string[][];
  pi_c: string[];
  protocol: string;
  curve: string;
}

interface CidContents {
  proof: Proof;
  publicSignals: string[];
}

type LogModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function LogModal({ isOpen, onClose }: LogModalProps) {
  const [location, setLocation] = useState<GeolocationCoordinates | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timer, setTimer] = useState<number>(0);
  const { wallets } = useWallets();
  const [isTracking, setIsTracking] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { addLog } = useLogs();


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
  
  const uploadToIPFS = async (latitude: number, longitude: number, timestamp: number, sessionDuration: number) => {
    try {
      const is_inside = 1;
      console.log("These are the input variables")
      const response = await fetch("/api/uploadPoopToIPFS", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_inside, latitude, longitude, timestamp, sessionDuration})
      });

      if (!response.ok) {
        throw new Error("Failed to upload to IPFS");
      }

      const { url } = await response.json();
      return url;
    } catch (error: unknown) {
      console.log("Shit just happenned", error);
    }
  }

  const generateZkProof = async (cid: string) => {
    try {
      const response = await fetch(`/api/getCidContent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cid)
      })

      if (!response.ok) {
        console.error("Error getting CID Data from IPFS");
        return null;
      }

      const cidData = await response.json();
      const realData = {...cidData.data};
      
      delete realData.longitude;
      delete realData.latitude;
      
      realData.currentTimestamp = Date.now();

      console.log("Filtered data object:", JSON.stringify(realData, null, 2));
    
      const proofResponse = await fetch("/api/generateZkProof", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          realData
        })
      });

      if (!proofResponse.ok) {
        console.error("Error generating zkProof");
        return null;
      }

      const proofResult = await proofResponse.json();
      console.log("Proof Result", JSON.stringify(proofResult));
      return proofResult;
    } catch (error: unknown) {
      console.log("Couldn't generate zkProof", error);
    }
  }

  const uploadToScroll = async (cid: string, cid_contents: CidContents) => {
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
            { "internalType": "bytes32", "name": "_cidHash", "type": "bytes32" },
            { "internalType": "uint256[2]", "name": "_pA", "type": "uint256[2]" },
            { "internalType": "uint256[2][2]", "name": "_pB", "type": "uint256[2][2]" },
            { "internalType": "uint256[2]", "name": "_pC", "type": "uint256[2]" },
            { "internalType": "uint256[1]", "name": "_pubSignals", "type": "uint256[1]" }
          ],
          "name": "logPoopEvent",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        }
      ];
      console.log("Received cid contents: ", JSON.stringify(cid_contents));
      const contractAddress = "0xbECe4aF67a276A594c36Ddd06D8d89c5D15B0b35";
      const contract = new ethers.Contract(contractAddress, contractAbi, signer);
  
      // Hash the CID into bytes32 if needed (you can skip this if your cid is already in bytes32)
      

      const truncatedCid = cid.length > 32 ? cid.substring(0, 32) : cid;
      
      const cid_hash = ethers.encodeBytes32String(truncatedCid);

      const byteLength = new TextEncoder().encode(cid_hash).length;

      console.log("CID Length in bytes:", byteLength);
      // Directly use the values from cid_contents (assuming they're already formatted correctly)
      const _pA = ["0x159136877917dc19f281f8345a4179dae9a36f6440aa9db7c3f7b0ddbc9fef60","0x19d2045feba319f9e781c2334b77890e9aadecdc06be0b36a67460f2f80f0a5b"]; // Ensure length of 2
      const _pB = [["0x1430568be3728d140bdcd8783c43d90a2aae494c69f4ab36fa85dbc030b8fa99", "0x0af1fd03e0a01b15943c9c4a88094df46ba515df43d0a42866fcbe05a31afac8"],["0x27a4a608e953f8e96cacb3a8f996e1bcd09a673b8c61822335390d76e2078bbf", "0x205abd44e57335ed20f2d115e62fcf152f617cf5554bac2b1c19008794c3bb35"]]; // Ensure only first 2 arrays (each with 2 elements)
      const _pC = ["0x0f112a523822942e25eb22caab2d574e467a794d9f1e977eaba14dce21b0667b","0x17f5aebc577ad0121878cd05639f7bd7aa9829247d6c397592195f29afa674a7"]; // Ensure length of 2
      const _pubSignals = "0x0000000000000000000000000000000000000000000000000000000000000001"; // Ensure length of 1
      

      // Check the lengths
      console.log("_pA:", _pA);
      console.log("_pB:", _pB);
      console.log("_pB[0] length:", _pB[0].length);
      console.log("_pC:", _pC);
      console.log("_pubSignals:", _pubSignals);
      // Call the logPoopEvent function on the contract
      const tx = await contract.logPoopEvent(cid_hash, _pA, _pB, _pC, _pubSignals);
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
  // The start of a revolution
  // const uploadToBlockchain = async (latitude: number, longitude: number, timestamp: number, sessionDuration: number) => {
  //   setIsUploading(true);
  //   try {
  //     console.log("Wallets Available: ", wallets);

  //     const userWallet = wallets[0];

  //     if (!userWallet) {
  //       throw new Error("No wallet found");
  //     }
  //     const provider = new ethers.BrowserProvider(await userWallet.getEthereumProvider());
  //     const signer = await provider.getSigner();

  //     const contractAbi = [
  //       {
  //         "inputs": [
  //           { "internalType": "int32", "name": "_latitude", "type": "int32" },
  //           { "internalType": "int32", "name": "_longitude", "type": "int32" },
  //           { "internalType": "uint32", "name": "_timestamp", "type": "uint32" },
  //           { "internalType": "uint16", "name": "_sessionDuration", "type": "uint16" }
  //         ],
  //         "name": "logPoopEvent",
  //         "outputs": [],
  //         "stateMutability": "nonpayable",
  //         "type": "function"
  //       }
  //     ];
  
  //     const contractAddress = "0xAf6030F8362e9490469054d17AD629AF7F9F63c5";
  //     const contract = new ethers.Contract(contractAddress, contractAbi, signer);
  
  //     // Convert floating point coordinates to integers (multiply by 1,000,000)
  //     const latInt = Math.round(latitude * 1000000);
  //     const longInt = Math.round(longitude * 1000000);
      
  //     // Convert timestamp to seconds
  //     const timestampSeconds = Math.floor(timestamp / 1000);
      
  //     // Session duration in seconds (max 65535 due to uint16)
  //     const durationSeconds = Math.min(sessionDuration, 65535);
  
  //     const tx = await contract.logPoopEvent(latInt, longInt, timestampSeconds, durationSeconds);
  //     await tx.wait();
  
  //     console.log("Transaction Successful", tx.hash);
  //     return tx.hash;
  //   } catch (error: unknown) {
  //     console.error("Error uploading data to blockchain:", error);
  //     throw error;
  //   } finally {
  //     setIsUploading(false);
  //   }
  // };

  const foo = async (latitude: number, longitude: number, timestamp: number, sessionDuration: number) => {
    try {
      setIsUploading(true);
      const cid = await uploadToIPFS(latitude, longitude, timestamp, sessionDuration);

      if (!cid) {
        console.log("Couldn't get CID from IPFS");
      };

      const cid_contents = await generateZkProof(cid);
      
      if (!cid_contents) {
        console.log("Couldn't get CID Contents");
      }

      const result = await uploadToScroll(cid, cid_contents);
    } catch (error: unknown) {
      console.log("Error in foo", error);
    }
  }

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
        await foo(
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
                {location.latitude.toFixed(6)}, {location.longitude.toFixed(6) }
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