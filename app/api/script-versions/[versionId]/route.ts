import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { withAuth } from "@/app/lib/auth/withAuth";
import { createSignedUrl, extractStoragePath } from "@/lib/supabase/storage";
import { withOwnerCheck } from "@/app/lib/withOwnerCheck";
import { error } from "console";
import { ascending } from "d3";

export const GET = withAuth(async({ req, userId, params}) => {
    const resolvedParams = await params;
    const versionId = resolvedParams?.versionId;
    const supabase = supabaseServer();

    // Fetch version details
    const { data: version, error: versionError } = await supabase
        .from("dynscript_versions")
        .select("*")
        .eq("id", versionId)
        .single();

    if (versionError || !version) {
        return NextResponse.json (
            { error: "Version not found" },
            { status: 404 }
        );
    }

    return NextResponse.json({ version: version});
});

export const DELETE = withAuth(
    withOwnerCheck(async({ req, userId, params}) => {
    try {
        const resolvedParams = await params;
        const versionId = resolvedParams.versionId;

        const supabase = supabaseServer();

        // 1. Validate version exists
        const { data: existing, error: findErr } = await supabase
            .from("dynscript_versions")
            .select("id, script_id, version_number, is_current, dyn_file_url")
            .eq("id", versionId)
            .single();

        if (findErr || !existing) {
            return NextResponse.json(
                { error: "Script version not found"},
                { status: 404 }
            );
        }

        // 2. Get all versions for this script
        const { data: versions, error: versionError } = await supabase
                .from("dynscript_versions")
                .select("id, script_id, version_number, is_current")
                .eq("script_id", existing.script_id)
                .order("version_number", { ascending: true });

        if (versionError || !versions) {
            return NextResponse.json(
                { error: "Failed fetching script versions"},
                { status: 500 }
            );
        }

        // 3. If only 1 version exists → don't delete
        if (versions.length === 1) {
            return NextResponse.json(
                { error: "Cannot delete the only existing version" },
                { status: 400 }
            )
        }
        
        // 4. Determine NEW CURRENT version (only if needed)
        let newCurrentVersionId: string | null = null;

        if (existing.is_current) {
            const otherVersions = versions.filter(v => v.id !== existing.id);

            const highest = otherVersions[otherVersions.length - 1];
            const lowest = otherVersions[0];

            if(existing.version_number === highest.version_number) {
                newCurrentVersionId = lowest.id;
            } else {
                newCurrentVersionId = highest.id;
            }
        }

        //5. If current version is deleted → update new current
        if (newCurrentVersionId) {
            const { error: updateErr } = await supabase
                .from("dynscript_versions")
                .update({ is_current: false })
                .eq("script_id", existing.script_id);

            if (updateErr) {
                return NextResponse.json(
                    { error: "Failed to reset existing current version" },
                    { status: 500 }
                );
            }

            const { error: setCurrentErr } = await supabase
                .from("dynscript_versions")
                .update({ is_current: true })
                .eq("id", newCurrentVersionId);

            if (setCurrentErr) {
                return NextResponse.json(
                    { error: "Failed to assign new current version" },
                    { status: 500 }
                );
            }
        }

        //6. Delete the version
        
        
        // Extract file path for deletion
        const deleteFiles: string[] =  [];
        const relativeFileUrl = extractStoragePath(existing.dyn_file_url, "dynamo-scripts");

        if (relativeFileUrl) {
            deleteFiles.push(relativeFileUrl);
        }

        // Delete storage file FIRST (safer)
        if (deleteFiles.length > 0) {
            const { error: deleteFileErr } = await supabase.storage
                .from("dynamo-scripts")
                .remove(deleteFiles);

            if (deleteFileErr) {
                console.warn(
                    "⚠️ Warning: Failed to delete storage file:",
                    deleteFileErr.message
                );
            }
        }

        // Delete DB version row
        const { error: deleteErr } = await supabase
            .from("dynscript_versions")
            .delete()
            .eq("id", versionId);

        if (deleteErr) {
            return NextResponse.json(
                { error: deleteErr.message },
                { status: 500}
            );
        }

        return NextResponse.json({ 
            success: true,
            message: newCurrentVersionId
                ? `Version deleted. New current version set: ${newCurrentVersionId}`
                : "Version deleted successfully",
        });
        
    } catch (error) {
        return NextResponse.json(
            { error: "Unexpected server error"},
            { status: 500 }
        );
    }
})
);