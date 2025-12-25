import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { withAuth } from "@/app/lib/auth/withAuth";
import { createSignedUrl, extractStoragePath } from "@/lib/supabase/storage";

export const GET = withAuth(async({ req, userId, params}) => {
    const resolvedParams = await params;
    const versionId = resolvedParams?.versionId;
    const supabase = supabaseServer();

    // Fetch version details
    const { data: version, error: versionError } = await supabase
        .from("dynscript_versions")
        .select("id, script_id, dyn_file_url, version_number")
        .eq("id", versionId)
        .single();

    if (versionError || !version) {
        return NextResponse.json (
            { error: "Version not found" },
            { status: 404 }
        );
    }

    // Log download with userId
    await supabase.from("script_downloads").insert({
        script_id: version.script_id,
        script_version_id: version.id,
        user_id: userId,
    });

    const url = await createSignedUrl(version.dyn_file_url);

    if (!url) {
        return NextResponse.json({ error: "Unable to create signed URL" }, { status: 500 });
    }

    const fileRes = await fetch(url);

    if (!fileRes.ok) {
        return NextResponse.json({ error: "Failed to fetch file" }, { status: 500 });
    }

    const filename = `v${version.version_number}.dyn`;

    return new NextResponse(fileRes.body, {
        headers: {
            "Content-Type": "application/octet-stream",
            "Content-Disposition": `attachment; filename="${filename}"`,
        },
    });
});