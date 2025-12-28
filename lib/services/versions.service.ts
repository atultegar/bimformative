import { supabaseServer } from "@/lib/supabase/server";
import { VERSION_SHEET_FIELDS } from "./versions.select";
import { createSignedUrl, extractStoragePath, extractStoragePaths } from "../supabase/storage";
import { SCRIPT_OWNER_FIELDS } from "./scripts.select";

// GET ALL VERSIONS
export async function getAllVersions(scriptId: string) {
    const supabase = supabaseServer();

    const { data: versionData, error: versionErr } = await supabase
        .from("dynscript_versions")
        .select(VERSION_SHEET_FIELDS, { count: "exact"})
        .eq("script_id", scriptId);

    if (versionErr) throw new Error("VERSIONS NOT FOUND");

    return versionData;
}

export async function getVersionById(versionId: string) {
    const supabase = supabaseServer();

    const { data: version, error: versionError } = await supabase
        .from("dynscript_versions")
        .select("*")
        .eq("id", versionId)
        .single();

    if (versionError) throw new Error("VERSION NOT FOUND");

    return version;
}

// SCRIPT VERSION DOWNLOAD
export async function downloadVersion(versionId: string, userId: string) {
    const supabase = await supabaseServer();

    // 1. Fetch version details
    const { data, error } = await supabase
        .from("dynscript_versions")
        .select(VERSION_SHEET_FIELDS)
        .eq("id", versionId)
        .single();

    if (error || !data) throw new Error("VERSION_NOT_FOUND");

    // 2. Create signed download url
    const signedUrl = await createSignedUrl(data.dyn_file_url);

    if (!signedUrl) throw new Error("SIGNED_URL_FAILED");

    // 3. Log download (userId may be null for public users)
    await supabase.from("script_downloads").insert({
        script_id: data.script_id,
        script_version_id: data.id,
        user_id: userId,
    });

    // 4. Fetch file as stream
    const fileRes = await fetch(signedUrl);

    if (!fileRes.ok || !fileRes.body) throw new Error("FILE_FETCH_FAILED");

    // 5. Generate filename
    const filename = `v${data.version_number}.dyn`;

    return {
        stream: fileRes.body,
        filename,
    };
}

// SET CURRENT VERSION
export async function setCurrentVersion(versionId: string, userId: string) {
    const supabase = supabaseServer();

    // 1. Get version data
    const { data: version, error: versionErr } = await supabase
        .from("dynscript_versions")
        .select(VERSION_SHEET_FIELDS)
        .eq("id", versionId)
        .single();

    if (versionErr || !version) throw new Error("VERSION_NOT_FOUND");

    // 2. Fetch related script
    const { data: script, error: scriptErr } = await supabase
        .from("dynscripts")
        .select(SCRIPT_OWNER_FIELDS)
        .eq("id", version.script_id)
        .single();

    if (scriptErr ||!script) throw new Error("SCRIPT_NOT_FOUND");

    // 3. Prevent setting if userId === ownerId
    if (userId !== script.owner_id) throw new Error("FORBIDDEN");

    // 4. Prevent setting if already current
    if (version.is_current || version.version_number === script.current_version_number) {
        throw new Error("VERSION_IS_CURRENT_ALREADY");
    }

    // 5. Unmark existing current version
    const { error: clearErr } = await supabase
        .from("dynscript_versions")
        .update({ is_current: false })
        .eq("script_id", version.script_id)
        .eq("is_current", true);

    if (clearErr) throw new Error("FAILED_TO_CLEAR_PREVIOUS");

    // 6. Set new version as current
    const {error: versionUpdateErr } = await supabase
        .from("dynscript_versions")
        .update({ is_current: true })
        .eq("id", versionId);

    const { error: scriptUpdateErr } = await supabase
        .from("dynscripts")
        .update({
            current_version_number: version.version_number,
            updated_at: new Date().toISOString()
        })
        .eq("id", version.script_id);

    if (versionUpdateErr || scriptUpdateErr) throw new Error("UNABLE_TO_UPDATE");

    return true;
}

// DELETE VERSION
export async function deleteVersion(versionId: string, userId: string) {
    const supabase = supabaseServer();

    // 1. Fetch version details
    const { data: version, error: versionErr } = await supabase
        .from("dynscript_versions")
        .select(VERSION_SHEET_FIELDS)
        .eq("id", versionId)
        .single();

    if (versionErr || !version) throw new Error("VERSION_NOT_FOUND");

    // 2. Get script
    const { data: script, error: scriptErr } = await supabase
        .from("dynscripts")
        .select(SCRIPT_OWNER_FIELDS)
        .eq("id", version.script_id)
        .single();

    if (scriptErr || !script) throw new Error("SCRIPT_NOT_FOUND");

    // 3. Check ownership
    if (userId !== script.owner_id) throw new Error("UNAUTHORIZED");

    // 4. Get all versions of the script
    const { data: versions, error: versionsErr } = await supabase
        .from("dynscript_versions")
        .select(VERSION_SHEET_FIELDS)
        .eq("script_id", version.script_id)
        .order("version_number", { ascending: true });

    if (versionsErr || !versions) throw new Error("VERSIONS_NOT_FOUND");

    // 5. If only 1 version exists → don't delete
    if (versions.length === 1) return false;

    // 6. Determine new current version (only if needed)
    let newCurrentVersionId: string | null = null;
    let newCurrentVersionNumber: number = 1;

    if (version.is_current) {
        const otherVersions = versions.filter(v => v.id !== version.id);

        const highest = otherVersions[otherVersions.length - 1];
        const lowest = otherVersions[0];

        if(version.version_number === highest.version_number) {
            newCurrentVersionId = lowest.id;
            newCurrentVersionNumber = lowest.version_number;
        } else {
            newCurrentVersionId = highest.id;
            newCurrentVersionNumber = highest.version_number;
        }        
    }

    // 7. If current version is deleted → update new current
    if(newCurrentVersionId) {
        const { error: updateErr } = await supabase
            .from("dynscript_versions")
            .update({ is_current: false })
            .eq("script_id", version.script_id);

        if (updateErr) throw new Error("FAILED_TO_RESET");

        const { error: setcurrentErr } = await supabase
            .from("dynscript_versions")
            .update({ is_current: true})
            .eq("id", newCurrentVersionId);

        const { error: updateScriptErr } = await supabase
            .from("dynscripts")
            .update({ current_version_number: newCurrentVersionNumber})
            .eq("id", script.id);

        if (setcurrentErr || updateScriptErr) throw new Error("FAILED_TO_SET");
    }

    // 8. Delete the version
    // Extract file path for deletion
    const deletFiles: string[] = [];
    const relativeFileUrl = extractStoragePath(version.dyn_file_url, "dynamo-scripts");

    if (relativeFileUrl) {
        deletFiles.push(relativeFileUrl);
    }

    // Delete storage file first
    if (deletFiles.length > 0) {
        const { error: deleteFileErr } = await supabase.storage
            .from("dynamo-scripts")
            .remove(deletFiles);

        if (deleteFileErr) throw new Error("FAILED_TO_DELETE");
    }

    // DELETE DB version row
    const { error: deleteErr } = await supabase
        .from("dynscript_versions")
        .delete()
        .eq("id", version.id);

    if (deleteErr) throw new Error("FAILED_TO_DELETE");

    return true;
}

// DELETE ALL VERSIONS
export async function deleteAllVersions(scriptId: string) {
    const supabase = supabaseServer();

    const { data: versions, error: versionsErr } = await supabase
        .from("dynscript_versions")
        .select("id, dyn_file_url")
        .eq("script_id", scriptId);

    if (versionsErr) throw versionsErr;
    if (!versions || versions.length === 0) return;

    const versionIds = versions.map(v => v.id);
    const fileUrls = versions.map(v => v.dyn_file_url);

    const storagePaths = extractStoragePaths(fileUrls, "dynamo-scripts");
    
    // Delete Python nodes in one query
    const { error: pythonDeleteErr } = await supabase
        .from("dynscript_python_nodes")
        .delete()
        .in("script_version_id", versionIds);

    if (pythonDeleteErr) throw pythonDeleteErr;

    // Delete versions in one query
    const { error: versionsDeleteErr } = await supabase
        .from("dynscript_versions")
        .delete()
        .eq("script_id", scriptId);

    if (versionsDeleteErr) throw versionsDeleteErr;

    // Delete files from storage
    if (storagePaths.length > 0) {
        const { error: filesDeleteErr } = await supabase
            .storage
            .from("dynamo-scripts")
            .remove(storagePaths);

        if (filesDeleteErr) throw filesDeleteErr;
    }    
}