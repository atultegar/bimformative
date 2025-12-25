import { supabaseServer } from "@/lib/supabase/server";
import { SCRIPT_MINIMAL_FIELDS, SCRIPT_DETAIL_FIELDS, SCRIPT_OWNER_FIELDS, SCRIPT_SLUG_ONLY, SCRIPT_DOWNLOAD_FIELDS, PYTHON_SCRIPTS_FIELDS } from "./scripts.select";
import { PaginationParams, PublicScriptFilters, ScriptUpdate } from "@/lib/types/script";
import { createSignedUrl } from "@/lib/supabase/storage";
import { error } from "console";


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
) {
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

// SCRIPT SLUGS
export async function getScriptSlugs() {
    const supabase = supabaseServer();

    const { data, error } = await supabase
        .from("dynscripts_with_current_version")
        .select(SCRIPT_SLUG_ONLY)
        .order("created_at", { ascending: false });

    if (error || !data) return null;

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
export async function patchScript(scriptId: string, script: ScriptUpdate) {
    const supabase = supabaseServer();

    const { title, description, script_type, tags, current_version } = script;

    // Check if the script is valid
    const { data: scriptData, error: scriptErr } = await supabase
        .from("dynscripts")
        .select("id, current_version_number")
        .eq("id", scriptId)
        .single();

    if (scriptErr || !scriptData) throw new Error("SCRIPT_NOT_FOUND");

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