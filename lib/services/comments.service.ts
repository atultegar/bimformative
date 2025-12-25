import { supabaseServer } from "../supabase/server";
import { SCRIPT_COMMENTS_FIELDS } from "./comments.select";

export async function getCommentsByScriptId(scriptId: string) {
    const supabase = supabaseServer();

    const { data, error } = await supabase
        .from("script_comments")
        .select(SCRIPT_COMMENTS_FIELDS)
        .eq("script_id", scriptId);

    if (error || !data) throw new Error("COMMENTS NOT FOUND");

    return data;
}

export async function getCommentById(commentId: string) {
    const supabase = supabaseServer();

    const { data, error } = await supabase
        .from("script_comments")
        .select(SCRIPT_COMMENTS_FIELDS)      
        .eq("id", commentId)
        .single();

    if (error || !data) throw new Error("COMMENT NOT FOUND");

    return data;
}

export async function postCommentByScriptId(scriptId: string, userId: string, comment: string ) {
    const supabase = supabaseServer();

    const { data, error } = await supabase
        .from("script_comments")
        .insert({
            script_id: scriptId,
            user_id: userId,
            comment: comment,
        })
        .select()
        .single();

    if (error || !data ) throw new Error("FAILED TO ADD COMMENT");

    return data;
}

export async function deleteComment(commentId: string, userId: string) {
    const supabase = supabaseServer();

    const { data: comment } = await supabase
        .from("script_comments")
        .select("user_id")
        .eq("id", commentId)
        .single();

    if (!comment) throw new Error("COMMENT NOT FOUND");

    if (comment.user_id !== userId) throw new Error("FORBIDDEN");

    const { error } = await supabase
        .from("script_comments")
        .delete()
        .eq("id", commentId)
        .eq("user_id", userId)

    if (error) throw new Error("UNABLE TO DELETE COMMENT");

    return "COMMENT DELETED SUCCESSFULLY";
}