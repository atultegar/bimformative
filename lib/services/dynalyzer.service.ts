import { ApiError } from "../api/errors";

export type AnalyzeResult = {
    parsedJson: any;
    scriptData: any;
};

// PARSE DYNAMO FILE
export async function parseDynamoJsonFromFile(file: File) {
    if (!file) throw new ApiError("FILE_REQUIRED", "File required", 401);

    const buffer = await file.arrayBuffer();
    const text = new TextDecoder().decode(buffer);

    try {
        return JSON.parse(text);
    } catch {
        throw new ApiError("INVALID_DYNAMO_FILE", "Invalid Dynamo file", 401);
    }
}

// ANALYZE DYNAMO JSON - USING DYNALYZER (Azure Function)
export async function analyzeDynamoJson(parsedJson: any): Promise<AnalyzeResult> {
    const url = process.env.AZURE_FUNCTION_URL;

    if (!url) throw new ApiError("AZURE_FUNCTION_NOT_CONFIGURED", "Azure Function not configured", 500);

    const parsed = JSON.stringify(parsedJson);

    const resp = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsedJson),
    });

    if (!resp.ok) {
        const text = await resp.text();
        throw new ApiError("DYNALYZER_ERROR", text, 500);
    }

    const scriptData = await resp.json();

    return {
        parsedJson,
        scriptData,
    };
}