import { handleApiError, successResponse, unauthorizedResponse } from "@/lib/api/responses";
import { getUserId } from "@/lib/auth/getUserId";
import { deleteVersion, getVersionById, getVersionBySlugAndNumber } from "@/lib/services/versions.service";

// GET : Get Version
export async function GET(req: Request, ctx: RouteContext<"/api/v1/scripts/[slug]/versions/[versionId]">) {
    const { slug, versionId } = await ctx.params;
    
    try {
        let version;

        // Detect numeric version
        const asNumber = Number(versionId);
        const isNumeric = !isNaN(asNumber) && Number.isInteger(asNumber) && asNumber.toString() === versionId;

        if (isNumeric) {
            // Fetch by version number
            version = await getVersionBySlugAndNumber(slug, asNumber);
        } else {
            // Fetch by UUID
            version = await getVersionById(versionId);
        }
        
        return successResponse(version, 200);
    } catch (err: unknown) {
        return handleApiError(err);
    }
}

// DELETE : Delete Version
export async function DELETE(req:Request, ctx: RouteContext<"/api/v1/scripts/[slug]/versions/[versionId]">) {
    const { slug, versionId } = await ctx.params;

    const userId = await getUserId(req);
    
    if(!userId) return unauthorizedResponse("Authentication required");

    try {
        let version;

        // Detect numeric version
        const asNumber = Number(versionId);
        const isNumeric = !isNaN(asNumber) && Number.isInteger(asNumber) && asNumber.toString() === versionId;

        if (isNumeric) {
            // Fetch by version number
            version = await getVersionBySlugAndNumber(slug, asNumber);
        } else {
            // Fetch by UUID
            version = await getVersionById(versionId);
        }

        const res = await deleteVersion(version.id, userId);

        return successResponse(res, 200);
    } catch (err: unknown) {
        return handleApiError(err);
    }
}