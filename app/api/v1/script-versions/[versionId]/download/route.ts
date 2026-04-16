import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { downloadVersion } from "@/lib/services/versions.service";
import { getUserId } from "@/lib/auth/getUserId";
import { handleApiError, unauthorizedResponse } from "@/lib/api/responses";

const DEV_MODE = process.env.NODE_ENV === "development";
const DEV_FAKE_USER_ID = process.env.DEV_FAKE_USER_ID ?? null;

export async function GET(req: Request, ctx: RouteContext<"/api/v1/script-versions/[versionId]/download">) {
    const { versionId } = await ctx.params;

   const userId = await getUserId(req);
   
    if(!userId) return unauthorizedResponse("Authentication required");
    
    try {
        const { stream, filename } = await downloadVersion(versionId, userId);        

        return new NextResponse(stream, {
            headers: {
                "Content-Type": "application/octet-stream",
                "Content-Disposition": `attachment; filename="${filename}"`,
                "Cache-Control": "no-store",
            },
        });
    } catch (err: unknown) {
        handleApiError(err);
    }
}