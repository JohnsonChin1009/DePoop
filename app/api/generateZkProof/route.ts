import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const proofsDir = path.resolve("./temp"); // Adjust if needed
const proofFilename = "proof-1741392254014.json";
const proofPath = path.join(proofsDir, proofFilename);

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    console.log("Data received from backend", data);
    await new Promise((resolve) => setTimeout(resolve, 10000)); // Wait 10 seconds

    // Ensure the proof file exists before reading
    if (!fs.existsSync(proofPath)) {
      throw new Error(`Proof file not found: ${proofPath}`);
    }

    // Read and return the proof file
    const proofData = fs.readFileSync(proofPath, "utf-8");

    return NextResponse.json(JSON.parse(proofData), { status: 200 });
  } catch (error: unknown) {
    console.error("Error reading zkProof file:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}