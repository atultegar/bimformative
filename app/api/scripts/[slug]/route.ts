import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { withAuth } from "@/app/lib/auth/withAuth";

export const GET = withAuth( async ({ req, userId, params }) => {
    const resolvedParams = await params;
    const slug = resolvedParams?.slug;
    const supabase = supabaseServer();

    const { data, error } = await supabase
        .from("dynscripts_with_current_version")
        .select("*")
        .eq("slug", slug)
        .single();

    if (error || !data) {
        return NextResponse.json({ error: "Script not found" }, { status: 404 });
    }

    // Visibility guard
    if (!data.is_public) {
        // Not logged in OR not the owner
        if (!userId || data.owner_id !== userId) {
            return NextResponse.json(
                { error: "This script is private"},
                { status: 403 }
            );
        }
    }

    return NextResponse.json({ script: data });
});