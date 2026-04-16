import { NextResponse } from "next/server";
import { scriptDownload } from "@/lib/services/scripts.service";
import { getUserId } from "@/lib/auth/getUserId";
import { handleApiError, unauthorizedResponse } from "@/lib/api/responses";

export async function GET(req: Request, ctx: RouteContext<"/api/v1/scripts/[slug]/download">) {
    const { slug } = await ctx.params;

    const userId = await getUserId(req);
        
    if(!userId) return unauthorizedResponse("Authentication required");

    try {
        const { stream, filename } = await scriptDownload(slug, userId);

        return new NextResponse(stream, {
            headers: {
                "Content-Type": "application/octet-stream",
                "Content-Disposition": `attachment; filename="${filename}"`,
                "Cache-Control": "no-store",
            },
        });
    } catch (err: unknown) {
        return handleApiError(err);
    }
}