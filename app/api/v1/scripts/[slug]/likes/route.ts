import { handleApiError, successResponse, unauthorizedResponse } from "@/lib/api/responses";
import { getUserId } from "@/lib/auth/getUserId";
import { deleteLikeBySlug, postLikeBySlug, scriptLikesCount } from "@/lib/services/likes.service";

// POST 
export async function POST(
    req: Request,
    ctx: RouteContext<"/api/v1/scripts/[slug]/likes">
) {
    const { slug } = await ctx.params;

    const userId = await getUserId(req);
    
    if(!userId) return unauthorizedResponse("Authentication required");

    try {
        const res = await postLikeBySlug(slug, userId);

        return successResponse(res);
    } catch (err: unknown) {        
        return handleApiError(err);
    }
}

// DELETE
export async function DELETE(
    req: Request,
    ctx: RouteContext<"/api/v1/scripts/[slug]/likes">
) {
    const { slug } = await ctx.params;

    const userId = await getUserId(req);

    if(!userId) return unauthorizedResponse("Authentication required");

    try {
        const res = await deleteLikeBySlug(slug, userId);

        return successResponse(res);
    } catch (err: unknown) {
        
        return handleApiError(err);
    }
}

//GET
export async function GET(
    req: Request,
    ctx: RouteContext<"/api/v1/scripts/[slug]/likes">
) {
    const { slug } = await ctx.params;
    try {
        const res = await scriptLikesCount(slug);

        return successResponse(res);
    } catch (err: unknown) {        
        return handleApiError(err);
    }
}