import { supabaseServer } from "../supabase/server";
import { ApiError } from "../api/errors";

export async function postLike(scriptId: string, userId: string) {
    const supabase = supabaseServer();

    const {data: existing, error } = await supabase
        .from("script_likes")
        .select("id")
        .eq("script_id", scriptId)
        .eq("user_id", userId)
        .single();

    if (!existing) {
        // insert line
        await supabase.from("script_likes").insert({
            script_id: scriptId,
            user_id: userId,
        });
    }

    // Get updated likes count
    const { count } = await supabase
        .from("script_likes")
        .select("id", { count: "exact", head: true })
        .eq("script_id", scriptId);

    return {liked: true, likes: count ?? 0};
}

export async function deleteLike(scriptId: string, userId: string) {
    const supabase = supabaseServer();

    await supabase
        .from("script_likes")
        .delete()
        .eq("script_id", scriptId)
        .eq("user_id", userId);

    // 4. Get updated likes count
    const { count } = await supabase
        .from("script_likes")
        .select("*", { count: "exact", head: true })
        .eq("script_id", scriptId);

    return {liked: false, likes: count ?? 0};    
}

export async function postLikeBySlug(slug: string, userId: string) {
    const supabase = supabaseServer();

    const { data, error } = await supabase
        .from("dynscripts")
        .select("id, slug")
        .eq("slug", slug)
        .single();

    if (error || !data) return new ApiError("SCRIPT_NOT_FOUND", "Script not found", 404);

    const res = await postLike(data.id, userId);

    return res;
}

export async function deleteLikeBySlug(slug: string, userId: string) {
    const supabase = supabaseServer();

    const { data, error } = await supabase
        .from("dynscripts")
        .select("id, slug")
        .eq("slug", slug)
        .single();

    if (error || !data) return new ApiError("SCRIPT_NOT_FOUND", "Script not found", 404);

    const res = await deleteLike(data.id, userId);

    return res;
}

// SCRIPT LIKES COUNT
export async function scriptLikesCount(slug: string) {
    const supabase = supabaseServer();

    const { data, error } = await supabase
        .from("dynscripts")
        .select("id, slug")
        .eq("slug", slug)
        .single();

    if (error || !data) return new ApiError("SCRIPT_NOT_FOUND", "Script not found", 404);
    
    const { count, error: likeErr } = await supabase
        .from("script_likes")
        .select("id", {count: "exact"})
        .eq("script_id", data.id)
        .order("created_at", { ascending: false });
        
    if (error || !count) throw error;

    return count;
}