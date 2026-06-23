import { ApiError } from "@/lib/api/errors";
import { handleApiError, successResponse } from "@/lib/api/responses";

// POST : PUBLISH NEW SCRIPT
export async function POST(req: Request, ctx: RouteContext<"/api/public/v1/test-message">) {
    try {        
        // ---- CONTENT TYPE ----
        const contentType = req.headers.get("content-type") ?? "";
        if (!contentType.includes("application/json")) {            
            throw new ApiError("INVALID_CONTENT_TYPE", "Invalid content type", 400);
        }

        const {
            name,
            description,
            ghData
        } = await req.json();        
        
        
        // ---- PUBLISH ----
        const result = { name, description, ghData};

        return successResponse(result, 201);
    } catch (err: unknown) {        
        return handleApiError(err);
    } 
}