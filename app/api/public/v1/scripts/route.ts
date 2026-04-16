import { handleApiError, successResponse } from "@/lib/api/responses";
import { getPublicScriptsPaged } from "@/lib/services/scripts.service";
import { PublicScriptSortField, SortOrder } from "@/lib/types/script";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);

    try {
        //Pagination
        const page = Number(searchParams.get("page") ?? 1);
        const limit = Number(searchParams.get("limit") ?? 10);

        // Filters
        const search = searchParams.get("search") ?? undefined;
        const type = searchParams.get("type") ?? undefined;

        // Sorting
        const sortField = searchParams.get("sort") as PublicScriptSortField | null;
        const sortOrder = searchParams.get("order") as SortOrder | null;

        const result = await getPublicScriptsPaged(
            { search, type },
            { page, limit },
            {
                field: sortField ?? "updated_at",
                order: sortOrder ?? "desc",
            }
        );
        return successResponse(result, 200)
    } catch (err: unknown) {
        return handleApiError(err) 
    }
}