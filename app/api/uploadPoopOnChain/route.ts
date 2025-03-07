import { ethers } from "ethers";
import { NextRequest, NextResponse} from "next/server";

export async function POST(req: NextRequest) {
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

    try {
        const data = await req.json();

        if (!data.signer) {
            return NextResponse.json(
                { message: "Invalid Signer" },
                { status: 500 },
            );
        };

        if (!data.latitude || !data.longitude || !data.timestamp || !data.sessionDuration) {
            return NextResponse.json(
                { message: "Invalid or Missing Data" },
                { status: 500 },
        )};

        const contract = new ethers.Contract(contractAddress, contractAbi, data.provider);

        const tx = await contract.logPoopEvent(data.latitude, data.longitude, data.timestamp, data.sessionDuration);

        await tx.wait();

        if (!tx.hash) {
            return NextResponse.json(
                { message: "Transaction Failed to Pass Through" },
                { status: 500 },
            )
        }
    } catch (error: unknown) {
        return NextResponse.json(
            { message: "Transaction Failed", error },
            { status: 500 },
        );
    }
}