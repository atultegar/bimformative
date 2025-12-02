import { NextResponse } from "next/server";
import { withAuth } from "@/app/lib/auth/withAuth";

export const POST = withAuth(async ({ req }) => {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    

    if (!file) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const text = new TextDecoder().decode(arrayBuffer);

    // Validate JSON
    let parsedJson;
    try {
      parsedJson = JSON.parse(text);
    } catch (e) {
      return NextResponse.json({ error: "Invalid Dynamo JSON content" }, { status: 400 });
    }

    // Call Azure function (your existing analyzer)
    if (!process.env.AZURE_FUNCTION_URL) {
      return NextResponse.json({ error: "Azure function URL not configured" }, { status: 500 });
    }

    const azureResp = await fetch(process.env.AZURE_FUNCTION_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsedJson),
    });

    if (!azureResp.ok) {
      const txt = await azureResp.text();
      return NextResponse.json({ error: `Analyzer error: ${txt}` }, { status: 500 });
    }

    const scriptData = await azureResp.json();

    // return parsedJson and analyzer output (Nodes, Connectors, etc)
    return NextResponse.json({
      success: true,
      parsedJson,
      scriptData,
    }, { status: 200 });

  } catch (err: any) {
    console.error("Analyze route error:", err);
    return NextResponse.json({ error: err.message || "Analyze failed" }, { status: 500 });
  }
});
