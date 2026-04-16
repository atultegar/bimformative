import { NextResponse } from "next/server";
import { deleteScriptBySlug, getScriptBySlug, getScriptDetailsBySlug, patchScriptBySlug } from "@/lib/services/scripts.service";
import { auth } from "@clerk/nextjs/server";
import { verifyClerkJwt } from "@/app/lib/auth/verifyClerkJwt";
import { ScriptUpdate } from "@/lib/types/script";
import { getUserId } from "@/lib/auth/getUserId";
import { handleApiError, successResponse, unauthorizedResponse } from "@/lib/api/responses";

const DEV_MODE = process.env.NODE_ENV === "development";
const DEV_FAKE_USER_ID = process.env.DEV_FAKE_USER_ID ?? null;

// GET : Get Script by Slug - full details
export async function GET(req: Request, ctx: RouteContext<"/api/v1/scripts/[slug]">) {
    const { slug } = await ctx.params;

    const userId = await getUserId(req);

    if(!userId) return unauthorizedResponse("Authentication required");

    try {
        const script = await getScriptDetailsBySlug(slug, userId);

        return successResponse(script, 200);
    } catch (err: unknown) {
        return handleApiError(err);
    }
}

// PATCH : Update script metadata
export async function PATCH(req: Request, ctx: RouteContext<"/api/v1/scripts/[slug]">) {
    const { slug } = await ctx.params;

    const userId = await getUserId(req);
    
    if(!userId) return unauthorizedResponse("Authentication required");

    try {
        const body = (await req.json()) as ScriptUpdate;
        const result = patchScriptBySlug(slug, userId, body);

        return successResponse(result, 200)
        
    } catch (err: unknown) {
        return handleApiError(err);
    }
}

// DELETE : Delete script
export async function DELETE(req: Request, ctx: RouteContext<"/api/v1/scripts/[slug]">) {
    const { slug } = await ctx.params;

    const userId = await getUserId(req);

    if(!userId) return unauthorizedResponse("Authentication required");

    try {
        await deleteScriptBySlug(slug, userId);

        // return NextResponse.json({
        //     message: "SCRIPT_DELETED_SUCCESSFULLY"
        // })

        return successResponse("Script deleted successfully", 200);
    } catch (err: unknown) {
        return handleApiError(err);
    }
}
