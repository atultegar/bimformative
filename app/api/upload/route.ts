import { client } from "@/app/lib/sanity";
import { NextRequest, NextResponse } from "next/server";


const FUNCTION_URL = process.env.AZURE_FUNCTION_URL;

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get("file") as File;

    if (!file) {
      return NextResponse.json({success: false, message: "No file uploaded"}, {status: 400});
    }

    const arrayBuffer = await file.arrayBuffer();

    const jsonString = new TextDecoder().decode(arrayBuffer);

    let parsedJson;

    try {
      parsedJson = JSON.parse(jsonString);
    } catch (error) {
      return NextResponse.json({ success: false, message: "Invalid JSON file"}, {status: 400});
    }

    if (!FUNCTION_URL) {
      return NextResponse.json({ success: false, message: "Azure Function URL is not defined"}, {status: 500});
    }

    const response = await fetch(FUNCTION_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsedJson),
    });
    
    if(!response.ok) {
      return NextResponse.json({ success: false, message: "Azure Function call failed"}, {status: response.status });
    }

    const output = await response.json();
    // const fileAsset = await client.assets.upload('file', Buffer.from(arrayBuffer), {filename: file.name});
    
    return NextResponse.json({success: true, data: output})
  } catch(error) {
        console.error("Upload failed:", error);
        return NextResponse.json({success: false, message: "File uplaod failed", error: error}, {status: 500});
  }
}