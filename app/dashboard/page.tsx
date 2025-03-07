'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Header from '../components/Header';
import SessionOverview from '../components/SessionOverview';
import Leaderboard from '../components/Leaderboard';
// import { ethers } from 'ethers';
import ShitMap from '../components/ShitMap';

export default function Dashboard() {
  const { ready, authenticated} = usePrivy();
//   const { wallets } = useWallets();
  const router = useRouter();

  useEffect(() => {
    if (ready && !authenticated) {
      router.push('/');
    }
  }, [ready, authenticated, router]);

  if (!ready || !authenticated) {
    return null;
  }

//   const handleUploadOnChain = async (longitude: number, latitude: number, timestamp: number, sessionDuration: number) => {
//     try {
//       console.log("Wallets Available: ", wallets);

//       const userWallet = wallets[0];

//       if (!userWallet) {
//         throw new Error("No wallet found");
//       }
//       const provider = new ethers.BrowserProvider(await userWallet.getEthereumProvider());
//       const signer = await provider.getSigner();

//       const contractAbi = [
//         {
//           "inputs": [
//             { "internalType": "int32", "name": "_latitude", "type": "int32" },
//             { "internalType": "int32", "name": "_longitude", "type": "int32" },
//             { "internalType": "uint32", "name": "_timestamp", "type": "uint32" },
//             { "internalType": "uint16", "name": "_sessionDuration", "type": "uint16" }
//           ],
//           "name": "logPoopEvent",
//           "outputs": [],
//           "stateMutability": "nonpayable",
//           "type": "function"
//         }
//       ];
  
//       const contractAddress = "0xAf6030F8362e9490469054d17AD629AF7F9F63c5";
//       const contract = new ethers.Contract(contractAddress, contractAbi, signer);
  
//       const tx = await contract.logPoopEvent(latitude, longitude, timestamp, sessionDuration);
//       await tx.wait();
  
//       console.log("Transaction Successful", tx.hash);
//     } catch (error: unknown) {
//       console.error("Error uploading data:", error);
//     }
//   };
  

  return (
    <>
      <main className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
        <Header />
        <main className="container mx-auto px-4 pt-24 pb-12">
          <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
          
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <div>
            <h2 className="text-2xl font-bold mb-4">Your Stats</h2>
            <SessionOverview />
            {/* <button onClick={handleUploadOnChain} className="px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer">
              Upload Data on Chain
            </button> */}
            </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
            <Leaderboard />
            </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Your Shit Map</h2>
          <ShitMap />
        </div>
        </main>
      </main>
    </>
  );
}
