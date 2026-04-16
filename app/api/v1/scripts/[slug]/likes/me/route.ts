import { handleApiError, successResponse, unauthorizedResponse } from "@/lib/api/responses";
import { getUserId } from "@/lib/auth/getUserId";
import { slugLikedByUserId } from "@/lib/services/scripts.service";

//GET
export async function GET(
    req: Request,
    ctx: RouteContext<"/api/v1/scripts/[slug]/likes/me">
) {
    const { slug } = await ctx.params;

    const userId = await getUserId(req);
    
    if(!userId) return unauthorizedResponse("Authentication required");
    
    try {
        const res = await slugLikedByUserId(userId, slug);

        return successResponse(res);
    } catch (err: unknown) {
        return handleApiError(err);
    }
}