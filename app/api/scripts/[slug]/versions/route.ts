import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export const GET = async (req: Request, ctx: { params: { slug: string } }) => {
    const supabase = supabaseServer();
    const awaitCtx = await ctx.params;
    const slug = awaitCtx.slug;

    const { data: scriptData, error: scriptError } = await supabase
        .from("dynscripts")
        .select("id, title, slug")
        .eq("slug", slug)
        .single();

    if (scriptError || !scriptData) {
        return NextResponse.json(
            { error: "Script not found" },
            { status: 404 }
        );
    }

    const scriptId = scriptData.id;

    const { data: versionsData, error: versionErr, count} = await supabase    
        .from("dynscript_versions")
        .select(`
            id,
            script_id,
            version_number,
            changelog,
            dyn_file_url,
            updated_at,
            is_current
        `, { count: "exact"})
        .eq("script_id", scriptId)

    if (versionErr) {
        return NextResponse.json({ error: versionErr.message}, { status: 500});
    }
    
    return NextResponse.json({ success: true, count: count, versions: versionsData }, { status: 200 });
}