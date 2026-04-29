import { supabaseServer } from "@/lib/supabase/server";
import { SCRIPT_MINIMAL_FIELDS, SCRIPT_DETAIL_FIELDS, SCRIPT_OWNER_FIELDS, SCRIPT_SLUG_ONLY, SCRIPT_DOWNLOAD_FIELDS, PYTHON_SCRIPTS_FIELDS, SCRIPT_DETAIL_MINIMUM } from "./scripts.select";
import { PaginationParams, PublicScriptFilters, PublishScriptInput, PublishScriptResult, ScriptUpdate, SortParams } from "@/lib/types/script";
import { createSignedUrl } from "@/lib/supabase/storage";
import { error } from "console";
import { generateSlug } from "../utils";
import { deleteAllVersions, getAllVersions } from "./versions.service";
import { OwnerResult, OwnerScript, PaginatedResult, PublicScript, ScriptSlug } from "@/app/lib/interface";
import { analyzeScript } from "../diff/analyzeScript";
import { generateHash } from "../diff/hash";
import { normalizeScriptType } from "@/app/lib/utils";
import { ApiError } from "../api/errors";
import { unauthorizedResponse } from "../api/responses";

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

    if (error) throw new ApiError("SCRIPTS_NOT_FOUND", "Scripts not found", 404);

    return data;
}

// GET PUBLIC + PRIVATE SCRIPT COUNT
export async function getScriptsCount() {
    const supabase = supabaseServer();

    const { count, error } = await supabase
        .from("dynscripts")
        .select("id", {count: "exact"})
        .order("created_at", { ascending: false });

    if (error || !count) throw new ApiError("SCRIPTS_NOT_FOUND", "Scripts not found", 404);

    return count;
}

// GET ALL PUBLIC SCRIPTS PAGED AND FILTERED
export async function getPublicScriptsPaged(
    filters: PublicScriptFilters = {},
    pagination: PaginationParams = {},
    sort: SortParams = {}
): Promise<PaginatedResult<PublicScript>> {
    const supabase = supabaseServer();

    const {
        page = 1,
        limit = 10,
    } = pagination;

    const {
        field = "updated_at",
        order = "desc",
    } = sort;

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

    // Sorting
    query = query.order(field, { ascending: order === "asc" });

    const { data, error, count } = await query
        .returns<PublicScript[]>()
        .range(from, to);

    if (error) throw new ApiError("SCRIPTS_NOT_FOUND", "Scripts not found", 404);

    return {
        scripts: data ?? [],
        page,
        limit,
        total: count ?? 0,
        totalPages: Math.ceil((count ?? 0) / limit),
    };
}

// GET ALL SCRIPTS BY USER - FOR USER DASHBOARD
export async function getAllScriptsByUserId(userId: string | null): Promise<OwnerResult<OwnerScript>> {

    const supabase = supabaseServer();

    const { data, error } = await supabase
        .from("dynscripts_with_current_version")
        .select(SCRIPT_OWNER_FIELDS)
        .eq("owner_id", userId)
        .order("created_at", { ascending: false });

    if (error) throw new ApiError("SCRIPTS_NOT_FOUND", "Scripts not found", 404);
    return {
        scripts: data ?? []
    };
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

    if (error) throw new ApiError("SCRIPTS_NOT_FOUND", "Scripts not found", 404);
    return data;
}

// SCRIPT BY SLUG - DETAILED
export async function getScriptBySlug(slug: string, userId?: string | null) {
    const supabase = supabaseServer();

    const { data, error } = await supabase
        .from("dynscripts_with_current_version")
        .select(SCRIPT_DETAIL_FIELDS)
        .eq("slug", slug)
        .single();

    if (error || !data) return new ApiError("SCRIPT_NOT_FOUND", "Script not found", 404);

    const isOwner = userId && data.owner_id === userId;

    // Privacy rule centralized
    if (!data.is_public && !isOwner) {
        throw new ApiError(
            userId ? "FORBIDDEN" : "UNAUTHORIZED",
            userId ? "You don not have access to this script." : "Please sign in to view this script.",
            userId ? 403 : 401
        );
    }

    return data;    
}


// SCRIPT MINIMUM DETAILS BY SLUG
export async function getScriptDetailsBySlug(slug: string, userId?: string | null) {
    const supabase = supabaseServer();

    const { data, error } = await supabase
        .from("dynscripts_with_current_version")
        .select(SCRIPT_DETAIL_MINIMUM)
        .eq("slug", slug)
        .single();

    if (error || !data) return new ApiError("SCRIPT_NOT_FOUND", "Script not found", 404);

    // Privacy rule centralized
    if (!data.is_public && data.owner_id !== userId) {
        throw unauthorizedResponse("FORBIDDEN");
    }

    return data;            
}

// SCRIPT CURRENT VERSION HASH by SLUG
export async function getScriptCurrentHash(slug: string){
    if (!slug) {
        throw new ApiError("INVALID_SLUG", "Invalid slug", 400);
    }

    const supabase = supabaseServer();

    const { data: script, error: scriptErr } = await supabase
        .from("dynscripts_with_current_version")
        .select("id, slug, version_id, current_version_number")
        .eq("slug", slug)
        .single();

    if (scriptErr || !script) {
        throw new ApiError("SCRIPT_NOT_FOUND", "Script not found", 404);
    }

    const { data: version, error: versionErr } = await supabase
        .from("dynscript_versions")
        .select("hash")
        .eq("id", script.version_id)
        .single();

    if (versionErr || !version) {
        throw new ApiError("VERSION_NOT_FOUND", "Version not found", 404);
    } 

    return {
        id: script.id,
        slug: script.slug,
        current_version_number: script.current_version_number,
        version_id: script.version_id,
        hash: version.hash,
    };
}



// SCRIPT BY ID
export async function getScriptById(id: string, userId?: string) {
    const supabase = supabaseServer();

    const { data, error } = await supabase
        .from("dynscripts_with_current_version")
        .select(SCRIPT_DETAIL_FIELDS)
        .eq("id", id)
        .single();

    if (error || !data) throw new ApiError("SCRIPT_NOT_FOUND", "Script not found", 404);

    // Privacy rule centralized
    if (!data.is_public && data.owner_id !== userId) {
        throw unauthorizedResponse("FORBIDDEN");
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

    if (error || !data) throw new ApiError("SCRIPT_NOT_FOUND", "Script not found", 404);

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

    if (error || !data) throw new ApiError("SCRIPTS_NOT_FOUND", "Scripts not found", 404);

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
        throw new ApiError("FILE_NOT_FOUND", "File not found", 404);
    }

    // 2. Create signed download url
    const signedUrl = await createSignedUrl(script.dyn_file_url);

    if (!signedUrl) throw new ApiError("SIGNED_URL_FAILED", "Signed Url not found", 404);

    // 3. Log download (userId may be null for public users)
    await supabase.from("script_downloads").insert({
        script_id: script.id,
        script_version_id: script.version_id,
        user_id: userId,
    });

    // 4. Fetch file as stream
    const fileRes = await fetch(signedUrl);

    if (!fileRes.ok || !fileRes.body) throw new ApiError("FILE_FETCH_FAILED", "File fetch failed", 404);

    // 5. Generate filename
    const safeTitle = script.title.replace(/\s+/g, "_");
    const filename = `${safeTitle}.dyn`;

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
        throw new ApiError("FILE_NOT_FOUND", "File not found", 404);
    }

    // 2. Create signed download url
    const signedUrl = await createSignedUrl(script.dyn_file_url);

    if (!signedUrl) throw new ApiError("SIGNED_URL_FAILED", "Signed Url not found", 404);

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
export async function scriptsLikedByUserId(userId: string | null) {
    if (!userId) return [];
    const supabase = supabaseServer();

    const { data: scripts, error } = await supabase
        .from("script_likes")
        .select("*")
        .eq("user_id", userId);

    if (error || !scripts) throw new ApiError("SCRIPTS_NOT_FOUND", "Scripts not found", 404);

    return scripts;
}

// SCRIPT LIKED BY USERID
export async function scriptLikedByUserId(userId: string | null, scriptId: string) {
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

// SCRIPT LIKED BY USERID (SLUG)
export async function slugLikedByUserId(userId: string | null, slug: string) {
    const supabase = supabaseServer();

    const { data, error } = await supabase
        .from("dynscripts")
        .select("id, slug")
        .eq("slug", slug)
        .single();

    if (error || !data) {
        return false;
    }

    const res = await scriptLikedByUserId(userId, data.id);

    return res;
}


// PYTHON SCRIPTS BY VERSIONID
export async function pythonScriptsByVersionId(versionId: string) {
    const supabase = supabaseServer();

    const { data, error } = await supabase
        .from("dynscript_python_nodes")
        .select(PYTHON_SCRIPTS_FIELDS)
        .eq("script_version_id", versionId)
        .order("order_index", { ascending: true });

    if (error) throw new ApiError("PYTHON SCRIPTS NOT FOUND", "Python scripts not found", 404);

    return data ?? [];
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

    if (error || !data) {
        throw new ApiError("SCRIPT_NOT_FOUND", "Script not found", 404);
    }

    if (userId !== data.owner_id) {
        return unauthorizedResponse("Forbidden, you don't own this script");
    }

    if (data.is_public) return true;

    const { error: updateErr } = await supabase
        .from("dynscripts")
        .update({ is_public: true })
        .eq("id", scriptId);

    if (updateErr) throw new ApiError("UPDATE_ERROR", "Update error", 400);

    return true;
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

    if (error || !data) throw new ApiError("SCRIPT_NOT_FOUND", "Script not found", 404);

    if (userId !== data.owner_id) return unauthorizedResponse("Forbidden, you don't own this script");

    if (!data.is_public) return true;

    const { error: updateErr } = await supabase
        .from("dynscripts")
        .update({ is_public: false })
        .eq("id", scriptId);

    if (updateErr) throw new ApiError("UPDATE_ERROR", "Update error", 400);

    return true;
}

// SET SCRIPT VISIBILITY
export async function setScriptVisibility(
    scriptId: string,
    userId: string,
    isPublic: boolean
) {
    const supabase = supabaseServer();

    // 1. Fetch script
    const { data: script, error } = await supabase
        .from("dynscripts")
        .select("id, owner_id, is_public")
        .eq("id", scriptId)
        .single();

    if (error || !script) {
        throw new ApiError("SCRIPT_NOT_FOUND", "Script not found", 404);
    }

    // 2. Authorization
    if (userId !== script.owner_id) {
        throw new ApiError("FORBIDDEN", "You do not own this script", 403);
    }

    // 3. No-op check
    if (script.is_public === isPublic) {
        throw new ApiError(
            isPublic ? "SCRIPT_ALREADY_PUBLIC" : "SCRIPT_ALREADY_PRIVATE",
            isPublic
                ? "Script is already public"
                : "Script is already private",
            409
        );
    }

    // 4. Update
    const { error: updateErr } = await supabase
        .from("dynscripts")
        .update({
            is_public: isPublic,
            updated_at: new Date().toISOString(),
        })
        .eq("id", scriptId);

    if (updateErr) {
        throw new ApiError("UPDATE_FAILED", "Failed to update script visbility", 500);
    }

    return {
        message: isPublic
            ? "Script is now public"
            : "Script is now private",
        isPublic,
    };
}

// UPDATE SCRIPT DATA
export async function patchScript(scriptId: string, userId: string, script: ScriptUpdate) {
    const supabase = supabaseServer();

    const { title, description, script_type, tags, current_version, is_public } = script;

    const normalizedScriptType = normalizeScriptType(script_type);
    
    // Check if the script is valid
    const { data: scriptData, error: scriptErr } = await supabase
        .from("dynscripts")
        .select("id, current_version_number, owner_id")
        .eq("id", scriptId)
        .single();

    if (scriptErr || !scriptData) throw new ApiError("SCRIPT_NOT_FOUND", "Script not found", 404);

    if (scriptData.owner_id !== userId) throw new ApiError("FORBIDDEN", "You do not own this script", 403);

    // Update the script details
    const { data, error: updateErr } = await supabase
        .from("dynscripts")
        .update({
            title,
            description,
            script_type: normalizedScriptType,
            tags,
            current_version_number: Number(current_version),
            is_public,
            updated_at: new Date().toISOString(),
        })
        .eq("id", scriptId);

    if (updateErr) throw new ApiError("UPDATE_FAILED", "Failed to update script metadata", 500);

    // Update current version
    const { error: clearErr } = await supabase
        .from("dynscript_versions")
        .update({ is_current: false })
        .eq("script_id", scriptId)
        .eq("is_current", true);

    if (clearErr) throw new ApiError("FAILED_TO_CLEAR_PREVIOUS", "Failed to clear previous versions", 500);

    // Set selected version as current in dynscript_versions table
    const { error: versionErr } = await supabase
        .from("dynscript_versions")
        .update({ is_current: true })
        .eq("script_id", scriptId)
        .eq("version_number", Number(current_version));

    if (versionErr) throw new ApiError("FAILED_TO_UPDATE_VERSION", "Failed to update version", 500);

    return {
        script: data
    };    
}

// UPDATE SCRIPT DATA BY SLUG
export async function patchScriptBySlug(slug: string, userId: string, scriptData: ScriptUpdate) {
    const supabase = supabaseServer();

    if (!slug) {
        throw new ApiError("INVALID_SLUG", "Invalid slug", 403);
    }

    const { data: script, error } = await supabase
        .from("dynscripts")
        .select("id")
        .eq("slug", slug)
        .single();

    if (error || !script) throw new ApiError("SCRIPT_NOT_FOUND", "Script not found", 404);

    return await patchScript(script.id, userId, scriptData )    
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
        demoLink = "",
        isPublic = false,
    } = input;

    if (!file) throw new ApiError("FILE_IS_REQUIRED", "File is required", 400);

    const supabase = supabaseServer();

    const baseTitle = title || file.name.replace(/\.[^/.]+$/, "");
    const slug = generateSlug(baseTitle, userId);

    const fileContent = await file.text();
    
    // Aanalyze semantic structure
    const semantic = analyzeScript(fileContent);

    // Generate hash from semantic model
    const hash = await generateHash(semantic);

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

        if (createErr) throw new ApiError("UPLOAD_DATA_FAILED", "Failed to upload script data", 500);
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

        if (updateMetaErr) {
            throw new ApiError("UPDATE_METADATA_ERROR", "Failed to update script metadata", 500);
        };
    }        

   
    if (!scriptId) throw new ApiError("UPLOAD_FAILED", "Failed to upload script", 500);

    // 2) Determine new version number
    const { data: versionRows, error: versionSelectErr } = await supabase
        .from("dynscript_versions")
        .select("version_number")
        .eq("script_id",scriptId)
        .order("version_number", { ascending: false})
        .limit(1);

    
    if (versionSelectErr) throw new ApiError("SCRIPT_VERSION_FAILED", "Failed to get new version", 500);

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

    if (uploadError) {
        throw new ApiError("FILE_UPLOAD_FAILED", "Failed to upload script file", 500);
    }

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
        external_packages: parsedJson?.ExternalPackages
            ? JSON.parse(JSON.stringify(parsedJson.ExternalPackages))
            : null,
        nodes: parsedJson?.Nodes 
            ? JSON.parse(JSON.stringify(parsedJson.Nodes))
            : null,
        connectors: parsedJson?.Connectors 
            ? JSON.parse(JSON.stringify(parsedJson.Connectors))
            : null,
        demo_link: demoLink ?? "",
        hash: hash
    };

    const { data: versionRow, error: versionInsertErr } = await supabase
        .from("dynscript_versions")
        .insert([versionInsert])
        .select()
        .single();

    if (versionInsertErr) {
        throw new ApiError("VERSION_FAILED", "Failed to create new version", 500);
    }

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

    if (updateCurrentErr) {
        throw new ApiError("VERSION_FAILED", "Failed to update current version", 500);
    }

    return {
        scriptId,
        slug,
        version: newVersion,
        downloadUrl: fileUrl,
        versionRow,
    };    
}

// DELETE SCRIPT BY ID
export async function deleteScript(scriptId: string, userId: string) {
    const supabase = supabaseServer();

    // Check for existing script
    const { data: scriptData, error: scriptErr } = await supabase
        .from("dynscripts")
        .select("id, current_version_number, owner_id")
        .eq("id", scriptId)
        .single();

    if (scriptErr || !scriptData) throw new ApiError("SCRIPT_NOT_FOUND", "Script not found", 404);

    if (scriptData.owner_id !== userId) throw new ApiError("FORBIDDEN", "You do not own this script", 403);

    // Delete all versions including python nodes
    await deleteAllVersions(scriptId);

    const { error: scriptDeleteErr } = await supabase
        .from("dynscripts")
        .delete()
        .eq("id", scriptId);

    if (scriptDeleteErr) throw new ApiError("SCRIPT_DELETE_ERROR", "Script delete error", 500);
}

// DELETE SCRIPT BY SLUG
export async function deleteScriptBySlug(slug: string, userId: string) {
    const supabase = supabaseServer();

    // Check for existing script
    const { data: scriptData, error: scriptErr } = await supabase
        .from("dynscripts")
        .select("id, slug, current_version_number, owner_id")
        .eq("slug", slug)
        .single();

    if (scriptErr || !scriptData) throw new ApiError("SCRIPT_NOT_FOUND", "Script not found", 404);

    if (scriptData.owner_id !== userId) throw new ApiError("FORBIDDEN", "You do not own this script", 403);

    // Delete all versions including python nodes
    await deleteAllVersions(scriptData.id);

    const { error: scriptDeleteErr } = await supabase
        .from("dynscripts")
        .delete()
        .eq("id", scriptData.id);

    if (scriptDeleteErr) throw new ApiError("SCRIPT_DELETE_ERROR", "Script delete error", 500);
}

// PUBLISH VERSION
export async function publishVersion(slug: string, userId: string, file: File, parsedJson?: any | null, changelog?: string) {
    if (!file) throw new ApiError("FILE_IS_REQUIRED", "File is required", 400);

    const supabase = supabaseServer();

    const { data: existingScript, error: existingErr } = await supabase
        .from("dynscripts")
        .select("id, owner_id")
        .eq("slug", slug)
        .maybeSingle();

    if (existingErr || !existingScript) throw new ApiError("SCRIPT_NOT_FOUND", "Script not found", 404);

    if (existingScript.owner_id !== userId) throw new ApiError("UNAUTHORIZED", "You don't own this script", 403);

    const scriptId = existingScript.id;

    // Hash Check
    const fileContent = await file.text();
    const semantic = analyzeScript(fileContent);
    const newHash = await generateHash(semantic);

    const { data: existingHash, error: hashErr } = await supabase
        .from("dynscript_versions")
        .select("id")
        .eq("script_id", scriptId)
        .eq("hash", newHash);

    if (existingHash) {
        throw new ApiError("DUPLICATE_VERSION", "Version already exists", 409);
    }

    // Determine new version number
    const { data: versionRows, error: versionSelectErr } = await supabase
        .from("dynscript_versions")
        .select("version_number")
        .eq("script_id",scriptId)
        .order("version_number", { ascending: false})
        .limit(1);

    if (versionSelectErr) throw new ApiError("SCRIPT_VERSION_FAILED", "Failed to get new version", 500);

    // Reset is_current = false for all versions
    const { error: updateErr } = await supabase
        .from("dynscript_versions")
        .update({ is_current : false})
        .eq("script_id",scriptId);        

    const latestVersion = versionRows?.[0]?.version_number ?? 0;
    const newVersion = latestVersion + 1;

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

    if (uploadError) throw new ApiError("UPLOAD_ERROR", uploadError.message, 500);

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
        hash: newHash
    };

    const { data: versionRow, error: versionInsertErr } = await supabase
        .from("dynscript_versions")
        .insert([versionInsert])
        .select()
        .single();

    if (versionInsertErr) throw new ApiError("VERSION_INSERT_ERROR", versionInsertErr.message, 500);

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

    if (updateCurrentErr) throw new ApiError("UPDATE_CURRENT_ERROR", updateCurrentErr.message, 500);

    return {
        scriptId,
        version: newVersion,
        downloadUrl: fileUrl,
        versionRow,
    };
}