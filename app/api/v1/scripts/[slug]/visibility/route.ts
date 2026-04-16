import { ApiError } from "@/lib/api/errors";
import { handleApiError, successResponse, unauthorizedResponse } from "@/lib/api/responses";
import { getUserId } from "@/lib/auth/getUserId";
import { getScriptBySlug, setScriptVisibility } from "@/lib/services/scripts.service";

// PATCH : Update script visibility
export async function PATCH(
    req: Request,
    ctx: RouteContext<"/api/v1/scripts/[slug]/visibility">
) {
    const { slug } = await ctx.params;

    const userId = await getUserId(req);
    if (!userId) return unauthorizedResponse("Authentication required");

    try {
        const body = await req.json();
        const { isPublic } = body;

        if (typeof isPublic !== "boolean") {
            throw new ApiError("INVALID_PAYLOAD", "isPublic must be boolean", 400);
        }

        
        // Get script first
        const script = await getScriptBySlug(slug, userId);
        if (!script?.id) {
            throw new ApiError("SCRIPT_NOT_FOUND", "Script not found", 404);
        }

        const result = await setScriptVisibility(
            script.id,
            userId,
            isPublic
        );

        return successResponse(result, 200);
    } catch (err: unknown) {
        return handleApiError(err);
    }
}