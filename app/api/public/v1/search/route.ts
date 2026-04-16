import { handleApiError, successResponse } from "@/lib/api/responses";
import { searchResources } from "@/lib/services/sanity.service";
import { getPublicScriptsPaged } from "@/lib/services/scripts.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl;

    const query = searchParams.get("query") ?? "";
    const page = Number(searchParams.get("page") ?? 1);
    const limit = Number(searchParams.get("limit") ?? 10);
      
    try {
        const [sanityResult, scriptsResult] = await Promise.all([
            searchResources({ search: query, page, limit }),
            getPublicScriptsPaged({ search: query }, { page, limit }),
        ]);

        return successResponse({
            query,
            sanity: {
                data: sanityResult.results,
                total: sanityResult.total,
                page: sanityResult.page,
                limit: sanityResult.limit,
                totalPages: sanityResult.totalPages,
            },
            scripts: scriptsResult,
        });
    } catch (err: unknown) {
        return handleApiError(err);
    }
}