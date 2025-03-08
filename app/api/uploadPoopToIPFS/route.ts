import { NextResponse, type NextRequest } from "next/server";
import { pinata } from "@/utils/config";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json(); // Parse incoming JSON

    const fileData = JSON.stringify(data); // Convert the data to JSON format

    // Generate a unique filename using UUID and a `.json` extension
    const uniqueFilename = `poopSession.json`;

    // Create a File object with the unique filename
    const file = new File([fileData], uniqueFilename, { type: "application/json", lastModified: Date.now() });

    // Upload the file to Pinata
    const uploadData = await pinata.upload.file(file);
    const url = await pinata.gateways.convert(uploadData.IpfsHash);
    
    console.log("URL received", url);
    return NextResponse.json({  url }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}