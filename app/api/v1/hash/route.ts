import { NextRequest, NextResponse } from "next/server";
import { generateHash, generateSHA256 } from "@/lib/diff/hash";
import { analyzeScript } from "@/lib/diff/analyzeScript";
import { ApiError } from "@/lib/api/errors";
import { handleApiError, successResponse } from "@/lib/api/responses";

export async function POST(req: NextRequest) {
    try {
        const {scriptContent} = await req.json();

        if (!scriptContent) {
            throw new ApiError("SCRIPT_CONTENT_REQUIRED", "Script content is required", 400)
        }

        const semantic = analyzeScript(scriptContent);
        const hash = await generateHash(semantic);

        return successResponse(hash, 200);
    } catch (err: unknown) {
        return handleApiError(err)
    }
}