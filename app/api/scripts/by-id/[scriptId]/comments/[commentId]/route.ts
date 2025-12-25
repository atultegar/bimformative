import { NextResponse } from "next/server";
import { withAuth } from "@/app/lib/auth/withAuth";
import { supabaseServer } from "@/lib/supabase/server";
import { withOwnerCheck } from "@/app/lib/withOwnerCheck";

export const DELETE = withAuth(withOwnerCheck(async ({ req, userId, params}) => {
    const resolvedParams = await params;
    const scriptId = resolvedParams?.scriptId;
    const commentId = resolvedParams?.commentId;
    
    const supabase = supabaseServer();

    // Only comment owner can delete
    const { data: comment } = await supabase
        .from("script_comments")
        .select("user_id")
        .eq("id", commentId)
        .eq("script_id", scriptId)
        .single();

    if (!comment) {
        return NextResponse.json(
            { error: "Comment not found" },
            { status: 404 }
        );
    }

    if (comment.user_id !== userId) {
        return NextResponse.json(
            { error: "Forbidden" },
            { status: 403 }
        );
    }

    await supabase
        .from("script_comments")
        .delete()
        .eq("id", commentId);

    return NextResponse.json({
        message: "Comment deleted"
    });
}));

export const GET = withAuth(async ({ req, userId, params }) => {
    const supabase = supabaseServer();
    const resolvedParams = await params;
    const commentId = resolvedParams?.commentId;

    const { data, error } = await supabase
        .from("script_comments")
        .select(`
            id,
            comment,
            created_at,
            user_id,
            profiles (
                first_name,
                last_name,
                avatar_url
            )
        `)      
        .eq("id", commentId)
        .single();

    if (error) {
        return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, comment: data }, { status: 200 });
});