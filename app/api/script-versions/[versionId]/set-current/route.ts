import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { withAuth } from "@/app/lib/auth/withAuth";
import { withOwnerCheck } from "@/app/lib/withOwnerCheck";

export const POST = withAuth(withOwnerCheck(async ({ req, userId, params}) => {
    try {
        const resolvedParams = await params;
        const versionId = resolvedParams.versionId;

        const supabase = supabaseServer();

        // 1. Ensure version exists
        const { data: version, error: versionErr } = await supabase
            .from("dynscript_versions")
            .select("id, script_id, version_number, is_current")
            .eq("id", versionId)
            .single();

        if (versionErr || !version) {
            return NextResponse.json(
                { error: "Script version not found" },
                { status: 404 }
            );
        }

        // 2. Fetch related script
        const { data: script, error: scriptErr } = await supabase
            .from("dynscripts")
            .select("id, current_version_number")
            .eq("id", version.script_id)
            .single();

        if (scriptErr || !script) {
            return NextResponse.json(
                { error: "Script not found" },
                { status: 404 }
            );
        }


        // 3. Prevent setting if already current
        if (version.is_current || version.version_number === script.current_version_number) {
            return NextResponse.json(
                { error: "Version is already set to current" },
                { status: 500 }
            );
        }

        // 4. Unmark existing current version
        const { error: clearErr } = await supabase
            .from("dynscript_versions")
            .update({ is_current: false })
            .eq("script_id", version.script_id)
            .eq("is_current", true);

        if (clearErr) {
            return NextResponse.json(
                { error: "Failed to clear previous current version" },
                { status: 500 }
            );
        }

        // 5. Set new version as current
        const { error: versionUpdateErr } = await supabase
            .from("dynscript_versions")
            .update({is_current: true})
            .eq("id", versionId);

        const { error: scriptUpdateErr } = await supabase
            .from("dynscripts")
            .update({
                current_version_number: version.version_number,
                updated_at: new Date().toISOString()
            })
            .eq("id", version.script_id);

        if (versionUpdateErr || scriptUpdateErr) {
            return NextResponse.json(
                { error: "Unable to update current version"}
            );
        }

        return NextResponse.json(
            { message: "Current version updated successfully" },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: "Some error"}
        );
    }    
}))