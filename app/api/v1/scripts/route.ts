export const runtime = "nodejs";

import { ApiError } from "@/lib/api/errors";
import { handleApiError, successResponse, unauthorizedResponse } from "@/lib/api/responses";
import { getUserId } from "@/lib/auth/getUserId";
import { getAllScriptsByUserId, publishScript } from "@/lib/services/scripts.service";
import { fileByStoragePath } from "@/lib/supabase/storage";

// GET : All scripts owned by user
export async function GET(req: Request, ctx: RouteContext<"/api/v1/scripts">) {
    const userId = await getUserId(req);

    if(!userId) return unauthorizedResponse("Authentication required");

    try {
        const result = await getAllScriptsByUserId(userId);

        return successResponse(result, 200)
    } catch (err: unknown) {
        return handleApiError(err);
    }    
}

// POST : PUBLISH NEW SCRIPT
export async function POST(req: Request, ctx: RouteContext<"/api/v1/scripts">) { 
    const userId = await getUserId(req);

    if(!userId) return unauthorizedResponse("Authentication required");

    try {        
        // ---- CONTENT TYPE ----
        const contentType = req.headers.get("content-type") ?? "";
        if (!contentType.includes("application/json")) {            
            throw new ApiError("INVALID_CONTENT_TYPE", "Invalid content type", 400);
        }

        const {
            storagePath,
            title,
            description,
            scriptType,
            tags = [],
            demoLink,
            isPublic,
            parsedJson
        } = await req.json();        
        
        // ---- FILE ----
        const file = await fileByStoragePath(storagePath);

        // ---- PUBLISH ----
        const result = await publishScript({
            userId,
            file,
            parsedJson,
            title,
            description,
            scriptType,
            tags,
            demoLink,
            isPublic
        });

        return successResponse(result, 201);
    } catch (err: unknown) {        
        return handleApiError(err);
    }
}