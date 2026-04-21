import { handleApiError, successResponse, unauthorizedResponse } from "@/lib/api/responses";
import { getUserId } from "@/lib/auth/getUserId";
import { extensionDownloadSeed } from "@/lib/data/extension-downloads.seed";
import { upsertExtensionDownloads } from "@/lib/services/supabase-admin.services";

export async function POST(req: Request, ctx: RouteContext<"/api/admin/migrate-extension-data">) {
    const userId = await getUserId(req);

    if (!userId) return unauthorizedResponse("Authentication required");

    try {
        const data = await upsertExtensionDownloads(extensionDownloadSeed);

        return successResponse(data);
    } catch (err: unknown) {
        return handleApiError(err);
    }
}