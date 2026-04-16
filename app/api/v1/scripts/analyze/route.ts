import { ApiError } from "@/lib/api/errors";
import { handleApiError, successResponse } from "@/lib/api/responses";
import { analyzeDynamoJson, parseDynamoJsonFromFile } from "@/lib/services/dynalyzer.service";
import { uploadFileTemp } from "@/lib/supabase/storage";
import { NextResponse } from "next/server";


export const runtime = "nodejs";
export async function POST(req: Request, ctx: RouteContext<"/api/v1/scripts/analyze">) {      
    try {
        const formData = await req.formData();
        
        const file = formData.get("file");

        if(!(file instanceof File)) {
            console.error("Invalid file received:", file);
            throw new ApiError("FILE_REQUIRED", "File required", 400);
        }

        const uploadResult = await uploadFileTemp(file);
        const parsedJson = await parseDynamoJsonFromFile(file!);

        if (!parsedJson) {
            throw new ApiError("PARSED_JSON_ERROR", "Parsed JSON error", 400);            
        }

        const analyzeResult = await analyzeDynamoJson(parsedJson);
        
        return successResponse({
            uploadId: uploadResult.uploadId,
            storagePath: uploadResult.storagePath,
            scriptData: analyzeResult.scriptData,
        });

    } catch (err: unknown) {
        return handleApiError(err);
    }
}