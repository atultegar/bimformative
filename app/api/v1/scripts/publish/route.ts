import { ApiError } from "@/lib/api/errors";
import { handleApiError, successResponse, unauthorizedResponse } from "@/lib/api/responses";
import { getUserId } from "@/lib/auth/getUserId";
import { publishScript } from "@/lib/services/scripts.service";


export const runtime = "nodejs";
export async function POST(req: Request, ctx: RouteContext<"/api/v1/scripts/publish">) { 
    const userId = await getUserId(req);
        
    if(!userId) return unauthorizedResponse("Authentication required");

    try {
        const contentType = req.headers.get("content-type") ?? "";
        if (!contentType.includes("multipart/form-data")) {
            throw new ApiError("INVALID_CONTENT_TYPE", "Invalid content type", 400);            
        }

        const formData = await req.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            throw new ApiError("FILE_REQUIRED", "File required", 400);        
        }

        const title = formData.get("title")?.toString() ?? "";
        const description = formData.get("description")?.toString() ?? "";
        const scriptType = formData.get("scriptType")?.toString() ?? "";
        const tagsRaw = formData.get("tags")?.toString() ?? "";
        const tags = tagsRaw.split(",").map(t => t.trim()).filter(Boolean);
        const demoLink = formData.get("demoLink")?.toString() ?? "";
        const isPublic = formData.get("isPublic") === "true";

        // parsed JSON
        const parsedJsonStr = formData.get("parsedJson")?.toString();
        const parsedJson = parsedJsonStr ? JSON.parse(parsedJsonStr) : null;

        // Call service
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