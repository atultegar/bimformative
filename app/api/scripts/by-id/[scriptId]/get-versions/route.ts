import { NextResponse } from "next/server";
import { withAuth } from "@/app/lib/auth/withAuth";
import { supabaseServer } from "@/lib/supabase/server";

export const GET = withAuth(async ({ req, userId, params }) => {
    const supabase = supabaseServer();
    const resolvedParams = await params;
    const scriptId = resolvedParams?.scriptId;

    const { data, error, count } = await supabase
        .from("dynscript_versions")
        .select(`
            id,
            script_id,
            version_number,
            changelog,
            dyn_file_url,
            updated_at,
            is_current
        `, { count: "exact"})        
        .eq("script_id", scriptId)

    if (error) {
        return NextResponse.json({ error: error.message}, { status: 500});
    }
    
    return NextResponse.json({ success: true, count: count, versions: data }, { status: 200 });

})