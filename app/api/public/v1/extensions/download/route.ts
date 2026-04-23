
import { ApiError } from "@/lib/api/errors";
import { handleApiError } from "@/lib/api/responses";
import { getUserId } from "@/lib/auth/getUserId";
import { createSignedDownloadUrl, getActiveExtensionById, incrementDownloadCount, logDownload } from "@/lib/services/extension-downloads.services";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, ctx:RouteContext<"/api/public/v1/extensions/download">){
    try {
        const userId = await getUserId(req);
        const extensionId = req.nextUrl.searchParams.get("id");

        if (!extensionId) {
            throw new ApiError("MISSING_EXTENSION_ID", "Missing extension Id", 400)
        }

        const extension = await getActiveExtensionById(extensionId);

        const forwardedFor = req.headers.get("x-forwarded-for");
        const ipAddress = forwardedFor?.split(",")[0]?.trim() ?? null;
        const userAgent = req.headers.get("user-agent") ?? null;

        await logDownload({
            extension_id: extension.id,
            downloaded_at: new Date().toISOString(),
            ip_address: ipAddress,
            user_agent: userAgent,
            user_id: userId,
        });

        await incrementDownloadCount(extensionId);

        const signedUrl = await createSignedDownloadUrl(extension.storage_path, 60);

        return NextResponse.redirect(signedUrl);
    } catch (err: unknown) {
        return handleApiError(err);
    }
}