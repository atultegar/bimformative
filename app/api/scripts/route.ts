import { NextResponse } from "next/server";
import { withAuth } from "@/app/lib/auth/withAuth";
import { supabaseServer } from "@/lib/supabase/server";

export const GET = withAuth(async ({ req, userId }) => {
    const supabase = supabaseServer();

    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page") ?? 1);
    const limit = Number(searchParams.get("limit") ?? 10);
    const type = searchParams.get("type");
    const search = searchParams.get("search");
    const ownerId = searchParams.get("ownerId");

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // Base query
    let query = supabase
        .from("dynscripts_with_current_version")
        .select(`
            id,
            title,
            slug,
            script_type,
            tags,
            description,
            current_version_number,
            owner_id,
            owner_first_name,
            owner_last_name,
            owner_avatar_url,
            demo_link,
            dyn_file_url,
            downloads_count,
            likes_count,
            is_public
        `, { count: "exact"})
        .order("created_at", { ascending: false })
        .range(from, to);

    // FILTER: OwnerId (used for user dashboards)
    if (ownerId) {
        // Security: users should NOT see other's private scripts
        if (ownerId !== userId) {
            return NextResponse.json(
                { error: "Forbidden - You cannot access other users' scripts."},
                { status: 403 }
            );
        }

        query = query.eq("owner_id", ownerId);
    } else {
        // Public browsing → ONLY public scripts
        query = query.eq("is_public", true);
    }

    // FILTER: Script Type
    if (type) {
        query = query.eq("script_type", type);
    }

    // FILTER: Search
    if (search) {
        const pattern = `%${search}%`;

        query = query.or(
            `title.ilike.${pattern},description.ilike.${pattern}`
        );
    }

    // Get all scripts with their current version
    const { data, error, count } = await query;

    if (error) {
        return NextResponse.json(
            { error: "Failed to fetch scripts.", details: error.message },
            { status: 500 }
        );
    }

    return NextResponse.json({ 
        scripts: data,
        page,
        limit,
        total: count,
        totalPages: Math.ceil((count ?? 0) / limit),
    });
});