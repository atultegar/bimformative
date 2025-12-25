import { withAuth } from "@/app/lib/auth/withAuth";
import { supabaseServer } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const GET = withAuth(async ({ req, userId, params }) => {
    const supabase = supabaseServer();
    const resolvedParams = await params;
    const profileId = resolvedParams?.profileId;

    const { data, error } = await supabase
        .from("profiles")
        .select("*")        
        .eq("id", profileId)
        .single();

    if (error) {
        return NextResponse.json({ error: error.message}, { status: 500});
    }
    
    return NextResponse.json({ success: true, profile: data }, { status: 200 });
});