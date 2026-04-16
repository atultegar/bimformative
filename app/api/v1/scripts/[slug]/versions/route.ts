import { publishVersion } from "@/lib/services/scripts.service";
import { getAllVersionsBySlug } from "@/lib/services/versions.service";
import { fileByStoragePath } from "@/lib/supabase/storage";
import { getUserId } from "@/lib/auth/getUserId";
import { ApiError } from "@/lib/api/errors";
import { handleApiError, successResponse, unauthorizedResponse } from "@/lib/api/responses";
import { PublishVersionSchema } from "@/lib/validators/script.validator";

// GET : Get Versions List
export async function GET(req: Request, ctx: RouteContext<"/api/v1/scripts/[slug]/versions">) {
    const { slug } = await ctx.params;

    const userId = await getUserId(req);

    if (!userId) return unauthorizedResponse("Authentication required");

    try {
        const versions = await getAllVersionsBySlug(slug);

        return successResponse(versions);
    } catch (err: unknown) {
        return handleApiError(err);
    }
}

// POST : Publish new version
export async function POST(req: Request, ctx: RouteContext<"/api/v1/scripts/[slug]/versions">) {
    const { slug } = await ctx.params;

    const userId = await getUserId(req);

    if (!userId) return unauthorizedResponse("Authentication required");

    try {
        const contentType = req.headers.get("content-type") ?? "";

        if (!contentType.startsWith("application/json")) {
            throw new ApiError(
                "INVALID_CONTENT_TYPE", 
                "Expected application/json", 
                400
            );
        }
        
        // ----- Validate Body -----
        const body  = await req.json();

        const parsed = PublishVersionSchema.safeParse(body);

        if (!parsed.success) {
            throw new ApiError(
                "VALIDATION_ERROR",
                parsed.error.message,
                400
            );
        }

        const { storagePath, parsedJson, changeLog } = parsed.data;
                
        // FILE FETCH
        const file = await fileByStoragePath(storagePath);

        if (!file) {
            throw new ApiError(
                "FILE_NOT_FOUND", 
                "File not found in storage", 
                404);
        }

        
        // Call service
        const result = await publishVersion(slug, userId, file, parsedJson ?? null, changeLog);

        return successResponse(result.versionRow, 201);
        
    } catch (err: unknown) {
        return handleApiError(err);
    }
}