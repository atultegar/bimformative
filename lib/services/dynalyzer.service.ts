export type AnalyzeResult = {
    parsedJson: any;
    scriptData: any;
};

// PARSE DYNAMO FILE
export async function parseDynamoJsonFromFile(file: File) {
    if (!file) throw new Error("FILE_REQUIRED");

    const buffer = await file.arrayBuffer();
    const text = new TextDecoder().decode(buffer);

    try {
        return JSON.parse(text);
    } catch {
        throw new Error("INVALID_DYNAMO_FILE");
    }
}

// ANALYZE DYNAMO JSON - USING DYNALYZER (Azure Function)
export async function analyzeDynamoJson(parsedJson: any): Promise<AnalyzeResult> {
    const url = process.env.AZURE_FUNCTION_URL;

    if (!url) throw new Error("AZURE_FUNCTION_NOT_CONFIGURED");

    const resp = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsedJson),
    });

    if (!resp.ok) {
        const text = await resp.text();
        throw new Error(`DYNALYZER_ERROR: ${text}`);
    }

    const scriptData = await resp.json();

    return {
        parsedJson,
        scriptData,
    };
}