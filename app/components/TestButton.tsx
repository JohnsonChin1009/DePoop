import { ethers } from "ethers";

export default function TestButton() {
    const provider = new ethers.BrowserProvider(window.ethereum); // Connect to MetaMask
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
    const contractAddress = "0xde8d9614aFc5880B6d565372250aEF3bbAe3bB94";

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
