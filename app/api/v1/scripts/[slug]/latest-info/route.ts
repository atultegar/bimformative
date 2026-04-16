import { handleApiError, successResponse } from "@/lib/api/responses";
import { getScriptCurrentHash } from "@/lib/services/scripts.service";


// GET : Get Script current hash by Slug
export async function GET(req: Request, ctx: RouteContext<"/api/v1/scripts/[slug]/latest-info">) {
    const { slug } = await ctx.params;

    try {
        const result = await getScriptCurrentHash(slug);

        return successResponse(result, 200);
    } catch (err: unknown) {
        return handleApiError(err);
    }
}