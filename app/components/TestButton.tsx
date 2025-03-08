import { ethers } from "ethers";

export default function TestButton() {
    const provider = new ethers.BrowserProvider(window.ethereum); // Connect to MetaMask
    const contractAbi = [
        {
            "inputs": [
              {"internalType": "bytes32", "name": "_cidHash", "type": "bytes32"},
              {"internalType": "uint256[2]", "name": "_pA", "type": "uint256[2]"},
              {"internalType": "uint256[2][2]", "name": "_pB", "type": "uint256[2][2]"},
              {"internalType": "uint256[2]","name": "_pC","type": "uint256[2]"},
              {"internalType": "uint256[1]","name": "_pubSignals","type": "uint256[1]"}
            ],
            "name": "logPoopEvent",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          }
    ];
    const contractAddress = "0xbECe4aF67a276A594c36Ddd06D8d89c5D15B0b35g";

    async function uploadData() {
        try {
            const signer = await provider.getSigner(); // Get user's wallet
            const contract = new ethers.Contract(contractAddress, contractAbi, signer);
            
            const latitude = 123456; // Example lat
            const longitude = 654321; // Example lon
            const timestamp = Math.floor(Date.now() / 1000); // Current timestamp
            const sessionDuration = 120; // Example duration in seconds

            const tx = await contract.logPoopEvent(latitude, longitude, timestamp, sessionDuration);
            await tx.wait(); // Wait for transaction to confirm
            
            console.log("Poop event logged successfully!");
        } catch (error) {
            console.error("Transaction failed:", error);
        }
    }

    const handleOnClick = () => {
        uploadData();
    };

    return (
        <main>
            <button onClick={handleOnClick}>
                Log Poop Event
            </button>
        </main>
    );
}
