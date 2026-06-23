import { ApiError } from "@/lib/api/errors";
import { handleApiError, successResponse, unauthorizedResponse } from "@/lib/api/responses";
import { getUserId } from "@/lib/auth/getUserId";
import { createTool } from "@/lib/services/tools.service";

export async function POST(req: Request) {
    const userId = await getUserId(req);

    if (!userId) {
        return unauthorizedResponse();
    }

    try {
        const contentType = req.headers.get("content-type") ?? "";

        if (!contentType.includes("application/json")) {
            throw new ApiError(
                "INVALID_CONTENT_TYPE",
                "Content type must be application/json",
                400
            );
        }

        const body = await req.json();

        const {
            name,
            slug,
            shortDescription,
            description,
            logoUrl,
            githubUrl,
            websiteUrl,
            documentationUrl
        } = body;

        if (!name) {
            throw new ApiError(
                "NAME_REQUIRED",
                "Tool name is required",
                400
            );
        }

        if (!slug) {
            throw new ApiError(
                "SLUG_REQUIRED",
                "Tool slug is required",
                400
            );
        }

        const tool = await createTool({
            name,
            slug,
            shortDescription,
            description,
            logoUrl,
            githubUrl,
            websiteUrl,
            documentationUrl
        });

        return successResponse(tool, 201);
    }
    catch (err){
        return handleApiError(err);
    }    
}

