import { compareScriptVersions } from "@/lib/services/compare.service";
import { ApiError } from "@/lib/api/errors";
import { handleApiError, successResponse } from "@/lib/api/responses";

export async function POST(req: Request, ctx: RouteContext<"/api/public/v1/scripts/[slug]/compare">) {
    const { slug } = await ctx.params;

    try {
        const body = await req.json();

        if(!body.left || !body.right) {
            // return NextResponse.json(
            //     { error: "LEFT_AND_RIGHT_REQUIRED"},
            //     { status: 400 }
            // );
            throw new ApiError("LEFT_AND_RIGHT_REQUIRED", "Left and right scripts required", 400);
        }

        const result = await compareScriptVersions(slug, body);

        return successResponse(result, 200)
    } catch (err:unknown) {
        return handleApiError(err);
    }
}