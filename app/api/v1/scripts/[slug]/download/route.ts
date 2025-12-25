import { NextResponse } from "next/server";
import { scriptDownload } from "@/lib/services/scripts.service";
import { auth } from "@clerk/nextjs/server";

const DEV_MODE = process.env.NODE_ENV === "development";
const DEV_FAKE_USER_ID = process.env.DEV_FAKE_USER_ID ?? null;

export async function GET(
    req: Request,
    {params}: { params: { slug: string} }
) {
    const { slug } = await params;

    let userId: string | null = null;

    if (DEV_MODE && DEV_FAKE_USER_ID) {
        userId = DEV_FAKE_USER_ID;
    } else {
        const authResult = await auth();
        userId = authResult.userId;
    }

    if (!userId) {
        return NextResponse.json(
            {
                error: "UNAUTHORIZED",
                message: "You must be signed in to download this script.",
            },
            { status: 401 } 
        );
    }

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
        const message = err instanceof Error ? err.message: "Download failed";

        const statusMap: Record<string, number> = {
            FILE_NOT_FOUND: 404,
            FORBIDDEN: 403,
            SIGNED_URL_FAILED: 500,
            FILE_FETCH_FAILED: 500,
        };

        return NextResponse.json(
            { error: message },
            { status: statusMap[message] ?? 500 }            
        );
    }
}