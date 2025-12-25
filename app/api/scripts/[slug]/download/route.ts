import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { createSignedUrl } from "@/lib/supabase/storage";
import { withAuth } from "@/app/lib/auth/withAuth";

export const GET = withAuth(async ({ req, userId, params }) => {
    const supabase = supabaseServer();
    const resolvedParams = await params;
    const slug = resolvedParams?.slug;

    const { data: scriptData, error: scriptError } = await supabase
        .from("dynscripts_with_current_version")
        .select("id, title, slug, version_id, dyn_file_url, current_version_number")
        .eq("slug", slug)
        .single();

    if (scriptError || !scriptData?.dyn_file_url) {
        return NextResponse.json(
            { error: "File not found" },
            { status: 404 }
        );
    }

    const dyn_file_url = scriptData.dyn_file_url;

    const signedUrl = await createSignedUrl(dyn_file_url);

    if (!signedUrl) {
        return NextResponse.json(
            { error: "unable to get signed url" },
            { status: 500 }
        )
    }

    // Log download with userId
    await supabase.from("script_downloads").insert({
        script_id: scriptData.id,
        script_version_id: scriptData.version_id,
        user_id: userId,
    });

    const fileRes = await fetch(signedUrl);

    if (!fileRes.ok) {
        return NextResponse.json({ error: "Failed to fetch file" }, { status: 500 });
    }

    const filename = `${scriptData.title.replace(/\s+/g, "_")}_v${scriptData.current_version_number}.dyn`;
    
    return new NextResponse( fileRes.body, {
        headers: {
            "Content-Type": "application/octet-stream",
            "Content-Disposition": `attachment; filename="${filename}"`,
        },
    });
});