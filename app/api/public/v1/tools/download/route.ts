import { ApiError } from "@/lib/api/errors";
import { handleApiError } from "@/lib/api/responses";
import { createSignedDownloadUrl, getActiveToolReleaseById, incrementToolDownloadCount } from "@/lib/services/tool-downloads.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, ctx:RouteContext<"/api/public/v1/tools/download">){
    try {
        const releaseId = req.nextUrl.searchParams.get("id");

        if (!releaseId) {
            throw new ApiError("MISSING_RELEASE_ID", "Missing release Id", 400)
        }

        const release = await getActiveToolReleaseById(releaseId);

        await incrementToolDownloadCount(releaseId);

        const signedUrl = await createSignedDownloadUrl(release.storage_path, 60);

        return NextResponse.redirect(signedUrl);
    } catch (err: unknown) {
        return handleApiError(err);
    }
}