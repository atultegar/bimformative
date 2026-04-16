import { supabaseServer } from "@/lib/supabase/server";
import { VERSION_SHEET_FIELDS } from "./versions.select";
import { createSignedUrl, extractStoragePath, extractStoragePaths } from "../supabase/storage";
import { SCRIPT_OWNER_FIELDS } from "./scripts.select";
import { ApiError } from "../api/errors";

// GET ALL VERSIONS
export async function getAllVersions(scriptId: string) {
    const supabase = supabaseServer();

    const { data: versionData, error: versionErr } = await supabase
        .from("dynscript_versions")
        .select(VERSION_SHEET_FIELDS, { count: "exact"})
        .eq("script_id", scriptId)
        .order("created_at", { ascending: false });

    if (versionErr) throw new ApiError("VERSION_NOT_FOUND", "Version not found", 404);

    return versionData;
}

// GET ALL VERSIONS BY SLUG
export async function getAllVersionsBySlug(slug: string) {
    const supabase = supabaseServer();

    if (!slug) {
        throw new ApiError("INVALID_SLUG", "Invalid slug", 401);
    }

    const { data: script, error } = await supabase
        .from("dynscripts")
        .select("id")
        .eq("slug", slug)
        .single();

    if (error || !script) throw new ApiError("SCRIPT_NOT_FOUND", "Script not found", 404);

    return await getAllVersions(script.id);
}

// GET VERSION BY ID
export async function getVersionById(versionId: string) {
    const supabase = supabaseServer();

    const { data: version, error: versionError } = await supabase
        .from("dynscript_versions")
        .select("*")
        .eq("id", versionId)
        .single();

    if (versionError) throw new ApiError("VERSION_NOT_FOUND", "Version not found", 404);

    return version;
}

// GET VERSION BY SLUG AND VERSION NUMBER
export async function getVersionBySlugAndNumber(slug: string, versionNo: number) {
    const supabase = supabaseServer();

    const {data, error} = await supabase
        .from("dynscripts")
        .select("id, slug")
        .eq("slug", slug)
        .single();
    
    if (error || !data) throw new ApiError("SCRIPT_NOT_FOUND", "Script not found", 404);

    const {data: versionData, error: versionErr } = await supabase
        .from("dynscript_versions")
        .select("*")
        .eq("script_id", data.id)
        .eq("version_number", versionNo)
        .single();

    if (versionErr || !versionData) throw new ApiError("VERSION_NOT_FOUND", "Version not found", 404);

    return versionData;
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

    if (error || !data) throw new ApiError("VERSION_NOT_FOUND", "Version not found", 404);

    // 2. Create signed download url
    const signedUrl = await createSignedUrl(data.dyn_file_url);

    if (!signedUrl) throw new ApiError("SIGNED_URL_FAILED", "Signed url failed", 500);

    // 3. Log download (userId may be null for public users)
    await supabase.from("script_downloads").insert({
        script_id: data.script_id,
        script_version_id: data.id,
        user_id: userId,
    });

    // 4. Fetch file as stream
    const fileRes = await fetch(signedUrl);

    if (!fileRes.ok || !fileRes.body) throw new ApiError("FILE_FETCH_FAILED", "File fetch failed", 500);

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

    // 1. Get version
    const { data: version, error: versionErr } = await supabase
        .from("dynscript_versions")
        .select(VERSION_SHEET_FIELDS)
        .eq("id", versionId)
        .single();

    if (versionErr || !version) {
        throw new ApiError("VERSION_NOT_FOUND", "Version not found", 404);
    } 

    // 2. Get script
    const { data: script, error: scriptErr } = await supabase
        .from("dynscripts_with_current_version")
        .select(SCRIPT_OWNER_FIELDS)
        .eq("id", version.script_id)
        .single();
        
    if (scriptErr ||!script) {
        throw new ApiError("SCRIPT_NOT_FOUND", "Script not found", 404);
    }

    // 3. Authorization
    if (userId !== script.owner_id) {
        throw new ApiError("FORBIDDEN", "You are not allowed to modify this script", 403);
    }

    // 4. Already current
    if (version.is_current || version.version_number === script.current_version_number) {
        throw new ApiError("VERSION_ALREADY_CURRENT", "Version is already current", 409);
    }

    // 5. Clear previous current version
    const { error: clearErr } = await supabase
        .from("dynscript_versions")
        .update({ is_current: false })
        .eq("script_id", version.script_id)
        .eq("is_current", true);

    if (clearErr) {
        throw new ApiError("FAILED_TO_CLEAR_PREVIOUS", "Failed to clear previous version", 500);
    }

    // 6. Set new current
    const {error: versionUpdateErr } = await supabase
        .from("dynscript_versions")
        .update({ is_current: true })
        .eq("id", versionId);

    if (versionUpdateErr) {
        throw new ApiError("FAILED_TO_SET_CURRENT", "Failed to update version", 500);
    }

    // 7. Update script
    const { error: scriptUpdateErr } = await supabase
        .from("dynscripts")
        .update({
            current_version_number: version.version_number,
            updated_at: new Date().toISOString()
        })
        .eq("id", version.script_id);

    if (scriptUpdateErr) {
        throw new ApiError("FAILED_TO_UPDATE_SCRIPT", "Failed to update script", 500);
    }

    return {
        message: "Current version updated successfully",
        versionId: version.id,
        versionNumber: version.version_number,
    };
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

    if (versionErr || !version) throw new ApiError("VERSION_NOT_FOUND", "Version not found", 404);

    // 2. Get script
    const { data: script, error: scriptErr } = await supabase
        .from("dynscripts")
        .select("id, owner_id")
        .eq("id", version.script_id)
        .single();


    if (scriptErr || !script) throw new ApiError("SCRIPT_NOT_FOUND", "Script not found", 404);

    // 3. Check ownership
    if (userId !== script.owner_id) throw new ApiError("FORBIDDEN", "You are not allowed to delete this version", 403);

    // 4. Get all versions of the script
    const { data: versions, error: versionsErr } = await supabase
        .from("dynscript_versions")
        .select(VERSION_SHEET_FIELDS)
        .eq("script_id", version.script_id)
        .order("version_number", { ascending: true });

    if (versionsErr || !versions) throw new ApiError("VERSIONS_NOT_FOUND", "Versions not found", 404);

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

        if (updateErr) throw new ApiError("FAILED_TO_RESET", "Failed to reset", 500);

        const { error: setcurrentErr } = await supabase
            .from("dynscript_versions")
            .update({ is_current: true})
            .eq("id", newCurrentVersionId);

        const { error: updateScriptErr } = await supabase
            .from("dynscripts")
            .update({ current_version_number: newCurrentVersionNumber})
            .eq("id", script.id);

        if (setcurrentErr || updateScriptErr) throw new ApiError("FAILED_TO_SET", "Failed to set", 500);
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

        if (deleteFileErr) throw new ApiError("FAILED_TO_DELETE", "Failed to delete", 500);
    }

    // DELETE DB version row
    const { error: deleteErr } = await supabase
        .from("dynscript_versions")
        .delete()
        .eq("id", version.id);

    if (deleteErr) throw new ApiError("FAILED_TO_DELETE", "Failed to delete", 500);

    return true;
}

// DELETE ALL VERSIONS
export async function deleteAllVersions(scriptId: string) {
    const supabase = supabaseServer();

    const { data: versions, error: versionsErr } = await supabase
        .from("dynscript_versions")
        .select("id, dyn_file_url")
        .eq("script_id", scriptId);

    if (versionsErr) throw new ApiError("VERSIONS_NOT_FOUND", versionsErr.message, 404);

    if (!versions || versions.length === 0) return;

    const versionIds = versions.map(v => v.id);
    const fileUrls = versions.map(v => v.dyn_file_url);

    const storagePaths = extractStoragePaths(fileUrls, "dynamo-scripts");
    
    // Delete Python nodes in one query
    const { error: pythonDeleteErr } = await supabase
        .from("dynscript_python_nodes")
        .delete()
        .in("script_version_id", versionIds);

    if (pythonDeleteErr) throw new ApiError("PYTHON_DELETE_ERROR", pythonDeleteErr.message, 500);

    // Delete versions in one query
    const { error: versionsDeleteErr } = await supabase
        .from("dynscript_versions")
        .delete()
        .eq("script_id", scriptId);

    if (versionsDeleteErr) throw new ApiError("VERSIONS_DELETE_ERROR", versionsDeleteErr.message, 500);

    // Delete files from storage
    if (storagePaths.length > 0) {
        const { error: filesDeleteErr } = await supabase
            .storage
            .from("dynamo-scripts")
            .remove(storagePaths);

        if (filesDeleteErr) throw new ApiError("FILES_DELETE_ERROR", filesDeleteErr.message, 500);
    }    
}

// GET LATEST VERSION BY SLUG
export async function getLatestVersionBySlug(slug: string) {
    const supabase = supabaseServer();

    const {data, error} = await supabase
        .from("dynscripts_with_current_version")
        .select("id, version_id")
        .eq("slug", slug)
        .single();
    
    if (error || !data) throw new ApiError("SCRIPT_NOT_FOUND", "Script not found", 404);

    return await getVersionById(data.version_id);    
}

export async function getNodesByVersionId(versionId: string) {
    const supabase = supabaseServer();

    const { data: version, error: versionError } = await supabase
        .from("dynscript_versions")
        .select("id, nodes")
        .eq("id", versionId)
        .single();

    if (versionError) throw new ApiError("VERSION_NOT_FOUND", versionError.message, 404);

    return version.nodes;
}

export async function getNodesByLatestVersion(slug: string) {
    const supabase = supabaseServer();

    const {data, error} = await supabase
        .from("dynscripts_with_current_version")
        .select("id, version_id")
        .eq("slug", slug)
        .single();
    
    if (error || !data) throw new ApiError("SCRIPT_NOT_FOUND", "Script not found", 404);

    return await getNodesByVersionId(data.version_id);
}