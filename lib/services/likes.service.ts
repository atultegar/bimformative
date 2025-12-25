import { error } from "console";
import { supabaseServer } from "../supabase/server";
import { supabase } from "../supabase/client";
import { scriptLikedByUserId } from "./scripts.service";

export async function postLike(scriptId: string, userId: string) {
    const supabase = supabaseServer();

    // insert line
    await supabase.from("script_likes").insert({
        script_id: scriptId,
        user_id: userId,
    });

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