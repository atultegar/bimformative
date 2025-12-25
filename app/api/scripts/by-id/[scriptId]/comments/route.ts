import { withAuth } from "@/app/lib/auth/withAuth";
import { supabaseServer } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: {scriptId: string}}) {
    const resolvedParams = await params;
    const scriptId = resolvedParams?.scriptId;

    const supabase = supabaseServer();

    // Ensure script exists
    const { data: script, error: scriptErr } = await supabase
        .from("dynscripts")
        .select("id")
        .eq("id", scriptId)
        .single();

    if (scriptErr || !script) {
        return NextResponse.json(
            { error: "Script not found" },
            { status: 404 }
        );
    }

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
        .eq("script_id", scriptId)
        .order("created_at", { ascending: false });

    if (error) {
        return NextResponse.json(
            { error: "Failed to fetch comments" },
            { status: 500 }
        );
    }

    return NextResponse.json({ comments: data });
}

export const POST = withAuth(async ({ req, userId, params }) => {
    const resovedParams = await params;
    const scriptId = resovedParams?.scriptId;

    const supabase = supabaseServer();

    const body = await req.json();
    const { comment } = body;

    if (!comment?.trim()) {
        return NextResponse.json(
            { error: "Comment is required" },
            { status: 400 }
        );
    }

    const { data, error } = await supabase
        .from("script_comments")
        .insert({
            script_id: scriptId,
            user_id: userId,
            comment,
        })
        .select()
        .single();

    if (error) {
        return NextResponse.json(
            { error: "Failed to add comment" },
            { status: 500 }
        );
    }

    return NextResponse.json({ comment: data }, { status: 200 });
});