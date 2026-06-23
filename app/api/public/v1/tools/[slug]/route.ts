import { handleApiError, successResponse } from "@/lib/api/responses";
import { getToolBySlug } from "@/lib/services/tools.service";

export async function GET(req: Request, ctx: RouteContext<"/api/public/v1/tools/[slug]">) {
    const { slug } = await ctx.params;

    try {
        const tool = await getToolBySlug(slug);

        return successResponse(tool, 200);
    } catch (err: unknown) {
        return handleApiError(err);
    }
}