import { NextResponse } from "next/server";
import { withAuth } from "@/app/lib/auth/withAuth";
import { supabaseServer } from "@/lib/supabase/server";

export const GET = withAuth(async ({ req, userId, params }) => {
    const supabase = supabaseServer();
    const resolvedParams = await params;
    const scriptId = resolvedParams?.scriptId;
    
    // Ensure script exists
    const {error: scriptErr } = await supabase
        .from("dynscripts")
        .select("*")
        .eq("id", scriptId)
        .single();

    if (scriptErr) {
        return NextResponse.json({ error: "Script not found" }, { status: 404 });
    }

    const { data: likeData, error, count } = await supabase
        .from("script_likes")
        .select("*", { count: "exact" })
        .eq("script_id", scriptId);    
    
    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    let liked:boolean = false;
    
    if (likeData.length > 0) {
        likeData.forEach(l => {
            if (l.user_id === userId) {
                liked = true;
            }            
        });
    }

    return NextResponse.json(        
        { liked, likes: count ?? 0 }
    );
});

export const POST = withAuth(async ({ req, userId, params }) => {
    const supabase = supabaseServer();

    const resolvedParams = await params;
    const scriptId = resolvedParams?.scriptId;

    // Ensure script exists
    const {error: scriptErr } = await supabase
        .from("dynscripts")
        .select("*")
        .eq("id", scriptId)
        .single();

    if (scriptErr) {
        return NextResponse.json({ error: "Script not found" }, { status: 404 });
    }

    // Check for existing like
    const { data: existing } = await supabase
        .from("script_likes")
        .select("id")
        .eq("script_id", scriptId)
        .eq("user_id", userId)
        .single();

    if (existing) {
        return NextResponse.json({ 
            liked: true,
            message: "Already liked"
        });
    }

    // Insert like
    await supabase.from("script_likes").insert({
        script_id: scriptId,
        user_id: userId,        
    });

    return NextResponse.json({ 
        liked: true
    });
});

export const DELETE = withAuth(async ({ req, userId, params }) => {
    const resolvedParams = await params;
    const scriptId = resolvedParams?.scriptId;

    const supabase = supabaseServer();

    await supabase
        .from("script_likes")
        .delete()
        .eq("script_id", scriptId)
        .eq("user_id", userId);

    return NextResponse.json({
        liked: false
    });
});