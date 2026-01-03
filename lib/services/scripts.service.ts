import { supabaseServer } from "@/lib/supabase/server";
import { SCRIPT_MINIMAL_FIELDS, SCRIPT_DETAIL_FIELDS, SCRIPT_OWNER_FIELDS, SCRIPT_SLUG_ONLY, SCRIPT_DOWNLOAD_FIELDS, PYTHON_SCRIPTS_FIELDS } from "./scripts.select";
import { PaginationParams, PublicScriptFilters, PublishScriptInput, PublishScriptResult, ScriptUpdate } from "@/lib/types/script";
import { createSignedUrl } from "@/lib/supabase/storage";
import { error } from "console";
import { generateSlug } from "../utils";
import { deleteAllVersions, getAllVersions } from "./versions.service";
import { PaginatedResult, PublicScript, ScriptSlug } from "@/app/lib/interface";

//#region MYREGION

//#endregion

// GET ALL PUBLIC SCRIPTS
export async function getPublicScripts() {
    const supabase = supabaseServer();

    const { data, error } = await supabase
        .from("dynscripts_with_current_version")
        .select(SCRIPT_MINIMAL_FIELDS)
        .eq("is_public", true)
        .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
}

// GET PUBLIC + PRIVATE SCRIPT COUNT
export async function getScriptsCount() {
    const supabase = supabaseServer();

    const { count, error } = await supabase
        .from("dynscripts")
        .select("id", {count: "exact"})
        .order("created_at", { ascending: false });

    if (error || !count) throw error;

    return count;
}

// GET ALL PUBLIC SCRIPTS PAGED AND FILTERED
export async function getPublicScriptsPaged(
    filters: PublicScriptFilters = {},
    pagination: PaginationParams = {}
): Promise<PaginatedResult<PublicScript>> {
    const supabase = supabaseServer();

    const {
        page = 1,
        limit = 10,
    } = pagination;

    const from = (page -1) * limit;
    const to = from + limit - 1;

    let query = supabase
        .from("dynscripts_with_current_version")
        .select(SCRIPT_MINIMAL_FIELDS, { count: "exact"})
        .eq("is_public", true);

    // Search
    if (filters.search) {
        const pattern = `%${filters.search}%`;
        query = query.or(
            `title.ilike.${pattern},description.ilike.${pattern}`
        );
    }

    // FILTER
    if (filters.type) {
        query = query.eq("script_type", filters.type);
    }

    const { data, error, count } = await query
        .returns<PublicScript[]>()
        .order("created_at", {ascending: false })
        .range(from, to);

    if (error) throw error;

    return {
        data: data ?? [],
        page,
        limit,
        total: count ?? 0,
        totalPages: Math.ceil((count ?? 0) / limit),
    };
}

// GET ALL SCRIPTS BY USER - FOR USER DASHBOARD
export async function getAllScriptsByUserId(userId: string) {
    const supabase = supabaseServer();

    const { data, error } = await supabase
        .from("dynscripts_with_current_version")
        .select(SCRIPT_OWNER_FIELDS)
        .eq("owner_id", userId)
        .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
}

// GET PUBLIC SCRIPTS BY USER - FOR FILTERING (OPTIONAL)
export async function getPublicScriptsByUserId(userId: string) {
    const supabase = supabaseServer();

    const { data, error } = await supabase
        .from("dynscripts_with_current_version")
        .select(SCRIPT_MINIMAL_FIELDS)
        .eq("owner_id", userId)
        .eq("is_public", true)
        .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
}

// SCRIPT BY SLUG
export async function getScriptBySlug(slug: string, userId?: string) {
    const supabase = supabaseServer();

    const { data, error } = await supabase
        .from("dynscripts_with_current_version")
        .select(SCRIPT_DETAIL_FIELDS)
        .eq("slug", slug)
        .single();

    if (error || !data) return null;

    // Privacy rule centralized
    if (!data.is_public && data.owner_id !== userId) {
        throw new Error("FORBIDDEN");
    }

    return data;    
}

// SCRIPT BY ID
export async function getScriptById(id: string, userId?: string) {
    const supabase = supabaseServer();

    const { data, error } = await supabase
        .from("dynscripts_with_current_version")
        .select(SCRIPT_DETAIL_FIELDS)
        .eq("id", id)
        .single();

    if (error || !data) return null;

    // Privacy rule centralized
    if (!data.is_public && data.owner_id !== userId) {
        throw new Error("FORBIDDEN");
    }

    return data;    
}

// CHECK FOR OWNERSHIP
export async function checkScriptOwnership(scriptId: string, userId: string) {
    const supabase = supabaseServer();

    const { data, error } = await supabase
        .from("dynscripts")
        .select("id, owner_id")
        .eq("id", scriptId)
        .single();

    if (error || !data) throw new Error("SCRIPT_NOT_FOUND");

    if (data.owner_id !== userId) return false;

    return true;
}

// SCRIPT SLUGS
export async function getScriptSlugs(): Promise<ScriptSlug[]> {
    const supabase = supabaseServer();

    const { data, error } = await supabase
        .from("dynscripts_with_current_version")
        .select(SCRIPT_SLUG_ONLY)
        .order("created_at", { ascending: false });

    if (error || !data) throw new Error("SCRIPTS_NOT_FOUND");

    return data;
}

// SCRIPT DOWNLOAD
export async function scriptDownload(    
    slug: string,
    userId: string
){
    const supabase = supabaseServer();

    // 1. Fetch script + current version
    const { data: script, error } = await supabase
        .from("dynscripts_with_current_version")
        .select(SCRIPT_DOWNLOAD_FIELDS)
        .eq("slug", slug)
        .single();

    if (error || !script || !script.dyn_file_url) {
        throw new Error("FILE_NOT_FOUND");
    }

    // 2. Create signed download url
    const signedUrl = await createSignedUrl(script.dyn_file_url);

    if (!signedUrl) throw new Error("SIGNED_URL_FAILED");

    // 3. Log download (userId may be null for public users)
    await supabase.from("script_downloads").insert({
        script_id: script.id,
        script_version_id: script.version_id,
        user_id: userId,
    });

    // 4. Fetch file as stream
    const fileRes = await fetch(signedUrl);

    if (!fileRes.ok || !fileRes.body) throw new Error("FILE_FETCH_FAILED");

    // 5. Generate filename
    const safeTitle = script.title.replace(/\s+/g, "_");
    const filename = `${safeTitle}_v${script.current_version_number}.dyn`;

    return {
        stream: fileRes.body,
        filename,
    };
}

// SCRIPT DOWNLOAD URL ONLY
export async function scriptDownloadUrlOnly(userId: string, slug: string) {
    const supabase = supabaseServer();

    // 1. Fetch script with current version
    const { data: script, error } = await supabase
        .from("dynscripts_with_current_version")
        .select(SCRIPT_DOWNLOAD_FIELDS)
        .eq("slug", slug)
        .single();

    if (error || !script || !script.dyn_file_url) {
        throw new Error("FILE_NOT_FOUND");
    }

    // 2. Create signed download url
    const signedUrl = await createSignedUrl(script.dyn_file_url);

    if (!signedUrl) throw new Error("SIGNED_URL_FAILED");

    // 3. Log download (userId may be null for public users)
    await supabase.from("script_downloads").insert({
        script_id: script.id,
        script_version_id: script.version_id,
        user_id: userId,
    });

    // 4. Generate filename
    const safeTitle = script.title.replace(/\s+/g, "_");
    const filename = `${safeTitle}_v${script.current_version_number}.dyn`;

    return {
        signedUrl, 
        filename
    };
}

// ALL SCRIPTS LIKED BY USERID
export async function scriptsLikedByUserId(userId: string) {
    const supabase = supabaseServer();

    const { data: scripts, error } = await supabase
        .from("script_likes")
        .select("*")
        .eq("user_id", userId);

    if (error || !scripts) throw new Error("SCRIPTS_NOT_FOUND");

    return scripts;
}

// SCRIPT LIKED BY USERID
export async function scriptLikedByUserId(userId: string, scriptId: string) {
    const supabase = supabaseServer();

    const { data, error } = await supabase
        .from("script_likes")
        .select("*")
        .eq("user_id", userId)
        .eq("script_id", scriptId)
        .single();

    if (error || !data) {
        return false;
    }

    return true;
}

// PYTHON SCRIPTS BY VERSIONID
export async function pythonScriptsByVersionId(versionId: string) {
    const supabase = supabaseServer();

    const { data, error } = await supabase
        .from("dynscript_python_nodes")
        .select(PYTHON_SCRIPTS_FIELDS)
        .eq("script_version_id", versionId)
        .order("order_index", { ascending: true });

    if (error || !data) throw new Error("PYTHON SCRIPTS NOT FOUND");

    return data;
}

// MAKE SCRIPT PUBLIC
export async function updateScriptPublic(scriptId: string, userId: string) {
    const supabase = supabaseServer();

    // Get script data
    const { data, error } = await supabase
        .from("dynscripts")
        .select("owner_id, is_public")
        .eq("id", scriptId)
        .single();

    if (error || !data) return { message: "SCRIPT_NOT_FOUND" };

    if (userId !== data.owner_id) return { message: "UNAUTHORIZED" };

    if (data.is_public) return { message: "SCRIPT_ALREADY_PUBLIC"};

    const { error: updateErr } = await supabase
        .from("dynscripts")
        .update({ is_public: true })
        .eq("id", scriptId);

    if (updateErr) return { message: "UPDATE_ERROR"};

    return {message: "SUCCESS"};
}

// MAKE SCRIPT PRIVATE
export async function updateScriptPrivate(scriptId: string, userId: string) {
    const supabase = supabaseServer();

    // Get script data
    const { data, error } = await supabase
        .from("dynscripts")
        .select("owner_id, is_public")
        .eq("id", scriptId)
        .single();

    if (error || !data) return { message: "SCRIPT_NOT_FOUND" };

    if (userId !== data.owner_id) return { message: "UNAUTHORIZED" };

    if (!data.is_public) return { message: "SCRIPT_ALREADY_PRIVATE"};

    const { error: updateErr } = await supabase
        .from("dynscripts")
        .update({ is_public: false })
        .eq("id", scriptId);

    if (updateErr) return { message: "UPDATE_ERROR"};

    return {message: "SUCCESS"};
}

// UPDATE SCRIPT DATA
export async function patchScript(scriptId: string, userId: string, script: ScriptUpdate) {
    const supabase = supabaseServer();

    const { title, description, script_type, tags, current_version } = script;

    // Check if the script is valid
    const { data: scriptData, error: scriptErr } = await supabase
        .from("dynscripts")
        .select("id, current_version_number, owner_id")
        .eq("id", scriptId)
        .single();

    if (scriptErr || !scriptData) throw new Error("SCRIPT_NOT_FOUND");

    if (scriptData.owner_id !== userId) throw new Error("UNAUTHORIZED");

    // Update the script details
    const { data, error: updateErr } = await supabase
        .from("dynscripts")
        .update({
            title,
            description,
            script_type,
            tags,
            current_version_number: Number(current_version),
            updated_at: new Date().toISOString(),
        })
        .eq("id", scriptId);

    if (updateErr) throw new Error("FAILED_TO_UPDATE");

    // Update current version
    const { error: clearErr } = await supabase
        .from("dynscript_versions")
        .update({ is_current: false })
        .eq("script_id", scriptId)
        .eq("is_current", true);

    if (clearErr) throw new Error("FAILED_TO_CLEAR_PREVIOUS");

    // Set selected version as current in dynscript_versions table
    const { error: versionErr } = await supabase
        .from("dynscript_versions")
        .update({ is_current: true })
        .eq("script_id", scriptId)
        .eq("version_number", Number(current_version));

    if (versionErr) throw new Error("FAILED_TO_UPDATE_VERSION");

    return {
        message: "Script updated successfully",
        script: data
    };    
}

// UPLOAD SCRIPT
export async function publishScript(
    input: PublishScriptInput
): Promise<PublishScriptResult> {
    const {
        userId,
        file,
        parsedJson = null,
        title = "",
        description = "",
        scriptType= "",
        tags = [],
        isPublic = false,
    } = input;

    if (!file) throw new Error("FILE_IS_REQUIRED");

    const supabase = supabaseServer();

    const baseTitle = title || file.name.replace(/\.[^/.]+$/, "");
    const slug = generateSlug(baseTitle, userId);

    const { data: existingScript, error: existingErr } = await supabase
        .from("dynscripts")
        .select("id")
        .eq("slug", slug)
        .maybeSingle();

    let scriptId: string;

    if (!existingScript){
        // create new script row
        const { data: newScript, error: createErr } = await supabase
            .from("dynscripts")
            .insert([{
                owner_id: userId,
                title: baseTitle,
                slug,
                description: description || null,
                script_type: scriptType || null,
                tags,
                current_version_number: null,
                is_public: isPublic,
            }])
            .select()
            .single();

        if (createErr) throw error;
        scriptId = newScript.id;
    } else {
        // Script exists - optional metadata refresh
        scriptId = existingScript.id;

        const { error: updateMetaErr } = await supabase
            .from("dynscripts")
            .update({
                title: title || undefined,
                description: description || undefined,
                script_type: scriptType || undefined,
                tags: tags.length ? tags : undefined,
                is_public: isPublic || false,
            })
            .eq("id", scriptId);

        if (updateMetaErr) throw error;
    }        

    if (!scriptId) throw error;

    // 2) Determine new version number
    const { data: versionRows, error: versionSelectErr } = await supabase
        .from("dynscript_versions")
        .select("version_number")
        .eq("script_id",scriptId)
        .order("version_number", { ascending: false})
        .limit(1);

    if (versionSelectErr) throw versionSelectErr;

    // Reset is_current = false for all versions
    const { error: updateErr } = await supabase
        .from("dynscript_versions")
        .update({ is_current : false})
        .eq("script_id",scriptId);

    const newVersion = (versionRows?.[0]?.version_number ?? 0) + 1;

    // 3) uplaod file to Supabase Storage
    
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const filePath = `${slug}/v${newVersion}.dyn`;

    const { error: uploadError } = await supabase.storage
        .from("dynamo-scripts")
        .upload(filePath, fileBuffer, {
            contentType: file.type || "application/json",
            cacheControl: "3600",
            upsert: true,
        });

    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage
        .from("dynamo-scripts")
        .getPublicUrl(filePath);

    const fileUrl = urlData?.publicUrl ?? null;

    // 4) Insert version entry into dynscript_versions and return full row (including id)
    const versionInsert = {
        script_id: scriptId,
        version_number: newVersion,
        is_current: true,
        changelog: newVersion === 1 ? "first version" : "",
        dyn_file_url: fileUrl,
        dynamo_version: parsedJson?.DynamoVersion ?? null,
        is_player_ready: parsedJson?.DynamoPlayerReady ?? false,
        external_packages: parsedJson?.ExternalPackages ?? null,
        nodes: parsedJson?.Nodes ?? null,
        connectors: parsedJson?.Connectors ?? null,
    };

    const { data: versionRow, error: versionInsertErr } = await supabase
        .from("dynscript_versions")
        .insert([versionInsert])
        .select()
        .single();

    if (versionInsertErr) throw versionInsertErr;

    // 5) Insert python nodes if exist (use parsedJson.Nodes)
    if (parsedJson?.Nodes?.length) {
        const pythonNodes = parsedJson.Nodes
            .filter((n: any) => n.NodeType === "PythonScriptNode")
            .map((n: any, idx: number) => ({
                script_version_id: versionRow.id,
                node_id: n.Id,
                order_index: idx,
                python_code: n.Code ?? "",
            }));

        if (pythonNodes.length) {
            await supabase.from("dynscript_python_nodes").insert(pythonNodes);
        }
    }

    // 6) Set the newly published version as the current version
    const { error: updateCurrentErr } = await supabase
        .from("dynscripts")
        .update({ current_version_number: newVersion })
        .eq("id", scriptId);

    if (updateCurrentErr) throw updateCurrentErr;

    return {
        scriptId,
        version: newVersion,
        downloadUrl: fileUrl,
        versionRow,
    };    
}

// DELETE SCRIPT
export async function deleteScript(scriptId: string, userId: string) {
    const supabase = supabaseServer();

    // Check for existing script
    const { data: scriptData, error: scriptErr } = await supabase
        .from("dynscripts")
        .select("id, current_version_number, owner_id")
        .eq("id", scriptId)
        .single();

    if (scriptErr || !scriptData) throw new Error("SCRIPT_NOT_FOUND");

    if (scriptData.owner_id !== userId) throw new Error("UNAUTHORIZED");

    // Delete all versions including python nodes
    await deleteAllVersions(scriptId);

    const { error: scriptDeleteErr } = await supabase
        .from("dynscripts")
        .delete()
        .eq("id", scriptId);

    if (scriptDeleteErr) throw scriptDeleteErr;   
}

// PUBLISH VERSION
export async function publishVersion(slug: string, userId: string, file: File, parsedJson?: any | null, changelog?: string) {
    if (!file) throw new Error("FILE_IS_REQUIRED");

    const supabase = supabaseServer();

    const { data: existingScript, error: existingErr } = await supabase
        .from("dynscripts")
        .select("id, owner_id")
        .eq("slug", slug)
        .maybeSingle();

    if (existingErr || !existingScript) throw new Error("SCRIPT_NOT_FOUND");

    if (existingScript.owner_id !== userId) throw new Error("UNAUTHORIZED");

    const scriptId = existingScript.id;

    // Determine new version number
    const { data: versionRows, error: versionSelectErr } = await supabase
        .from("dynscript_versions")
        .select("version_number")
        .eq("script_id",scriptId)
        .order("version_number", { ascending: false})
        .limit(1);

    if (versionSelectErr) throw versionSelectErr;

    // Reset is_current = false for all versions
    const { error: updateErr } = await supabase
        .from("dynscript_versions")
        .update({ is_current : false})
        .eq("script_id",scriptId);        

    const newVersion = (versionRows?.[0]?.version_number ?? 0) + 1;

    // 3) Upload file to supabase storage
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const filePath = `${slug}/v${newVersion}.dyn`;

    const { error: uploadError } = await supabase.storage
        .from("dynamo-scripts")
        .upload(filePath, fileBuffer, {
            contentType: file.type || "application/json",
            cacheControl: "3600",
            upsert: true,
        });

    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage
        .from("dynamo-scripts")
        .getPublicUrl(filePath);

    const fileUrl = urlData?.publicUrl ?? null;

    // 4) Insert version entry into dynscript_versions and return full row (including id)
    const versionInsert = {
        script_id: scriptId,
        version_number: newVersion,
        is_current: true,
        changelog: changelog,
        dyn_file_url: fileUrl,
        dynamo_version: parsedJson?.DynamoVersion ?? null,
        is_player_ready: parsedJson?.DynamoPlayerReady ?? false,
        external_packages: parsedJson?.ExternalPackages ?? null,
        nodes: parsedJson?.Nodes ?? null,
        connectors: parsedJson?.Connectors ?? null,
    };

    const { data: versionRow, error: versionInsertErr } = await supabase
        .from("dynscript_versions")
        .insert([versionInsert])
        .select()
        .single();

    if (versionInsertErr) throw versionInsertErr;

    // 5) Insert python nodes if exist (use parsedJson.Nodes)
    if (parsedJson?.Nodes?.length) {
        const pythonNodes = parsedJson.Nodes
            .filter((n: any) => n.NodeType === "PythonScriptNode")
            .map((n: any, idx: number) => ({
                script_version_id: versionRow.id,
                node_id: n.Id,
                order_index: idx,
                python_code: n.Code ?? "",
            }));

        if (pythonNodes.length) {
            await supabase.from("dynscript_python_nodes").insert(pythonNodes);
        }
    }

    // 6) Set the newly published version as the current version
    const { error: updateCurrentErr } = await supabase
        .from("dynscripts")
        .update({ current_version_number: newVersion })
        .eq("id", scriptId);

    if (updateCurrentErr) throw updateCurrentErr;

    return {
        scriptId,
        version: newVersion,
        downloadUrl: fileUrl,
        versionRow,
    };
}