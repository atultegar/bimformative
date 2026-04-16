import { ApiError } from "@/lib/api/errors";
import { handleApiError, successResponse, unauthorizedResponse } from "@/lib/api/responses";
import { getUserId } from "@/lib/auth/getUserId";
import { getVersionById, getVersionBySlugAndNumber, setCurrentVersion } from "@/lib/services/versions.service";

// POST : Set Current Version
export async function POST(
    req: Request, 
    ctx: RouteContext<"/api/v1/scripts/[slug]/versions/[versionId]/set-current">
) {
    const { slug, versionId } = await ctx.params;

    const userId = await getUserId(req);
    if (!userId) return unauthorizedResponse();

    try {
        let version;
        
        // Better numeric detection
        const isNumeric = /^\d+$/.test(versionId);        

        if (isNumeric) {
            // Fetch by version number
            version = await getVersionBySlugAndNumber(slug, Number(versionId));
        } else {
            // Fetch by UUID
            version = await getVersionById(versionId);
        }

        if (!version?.id) {
            throw new ApiError("VERSION_NOT_FOUND", "Version not found", 404);
        }

        const result = await setCurrentVersion(version.id, userId);

        return successResponse(result, 200);
        
    } catch (err: any) {        
        return handleApiError(err);
    }
}