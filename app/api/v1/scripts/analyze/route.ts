import { analyzeDynamoJson, parseDynamoJsonFromFile } from "@/lib/services/dynalyzer.service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File | null;

        const parsedJson = await parseDynamoJsonFromFile(file!);

        if (!parsedJson) {
            return NextResponse.json(
                { error: "Parsed JSON error" },
                { status: 400 }
            )
        }

        const result = await analyzeDynamoJson(parsedJson);

        return NextResponse.json(
            { success: true, ...result },
            { status: 200 }
        );

    } catch (err: any) {
        const message =
            err.message === "FILE_REQUIRED" ? "File is required" :
            err.message === "INVALID_DYNAMO_JSON" ? "Invalid Dynamo JSON content":
            err.message === "AZURE_FUNCTION_NOT_CONFIGURED" ? "Analyzer not configured":
            err.message?.startsWith("ANALYZER_ERROR") ? err.message:
            "Analyze failed";

        const status = 
            err.message === "FILE_REQUIRED" ? 400 :
            err.message === "INVALID_DYNAMO_JSON" ? 400 :
            err.message === "AZURE_FUNCTION_NOT_CONFIGURED" ? 500:
            err.message?.startsWith("ANALYZER_ERROR") ? 500:
            500;

        return NextResponse.json({ error: message }, { status });
    }
}