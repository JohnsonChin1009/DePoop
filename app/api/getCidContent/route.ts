import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const cid = await request.json();

        if (!cid) {
            return NextResponse.json({ status: 400, message: "Missing CID" });
        }

        const response = await fetch(cid);
        
        if(!response) {
            return NextResponse.json({ status: 400, message: "Error fetching CID content from Gateway" });
        }

        const contentType = response.headers.get("content-type");

        let data;
        if (contentType?.includes("application/json")) {
            data = await response.json(); // JSON response
        } else {
            data = await response.text(); // Text or other formats
        }
    
        return NextResponse.json({ status: 200, data });
    } catch (error: unknown) {
        console.error("Error fetching CID content:", error);
        return NextResponse.json({ status: 400, message: "Error fetching CID content" });
    }
}