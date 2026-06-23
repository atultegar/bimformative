import { ApiError } from "../api/errors";
import { supabaseServer } from "../supabase/server";
import { GHSCRIPT_MINIMAL_FIELDS } from "./ghscripts.select";


// GET ALL PUBLIC SCRIPTS
export async function getPublicScripts() {
    const supabase = supabaseServer();

    const { data, error } = await supabase
        .from("ghscripts_with_current_version")
        .select(GHSCRIPT_MINIMAL_FIELDS)
        .eq("visibility", "public")
        .order("created_at", { ascending: false });

    if (error) throw new ApiError("SCRIPTS_NOT_FOUND", "Scripts not found", 404);

    return data;
}

// GET PUBLIC + PRIVATE SCRIPT COUNT
export async function getScriptsCount() {
    const supabase = supabaseServer();

    const { count, error } = await supabase
        .from("ghscripts")
        .select("id", {count: "exact"})
        .order("created_at", { ascending: false });

    if (error || !count) throw new ApiError("SCRIPTS_NOT_FOUND", "Scripts not found", 404);

    return count;
}