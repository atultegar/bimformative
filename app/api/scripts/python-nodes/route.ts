import { NextResponse } from "next/server";
import { withAuth } from "@/app/lib/auth/withAuth";
import { supabaseServer } from "@/lib/supabase/server";

export const POST = withAuth(async ({ req, userId }) => {
    try {
        const supabase = supabaseServer();

        const body = await req.json();
        const versionId = body?.versionId;

        if (!versionId) {
            return NextResponse.json(
                { error: "versionId is required"},
                { status: 400 }
            );
        }

        // Query all python nodes for the script version
        const { data, error } = await supabase
            .from("dynscript_python_nodes")
            .select("*")
            .eq("script_version_id", versionId)
            .order("order_index", { ascending: true });

        if (error) {
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            );            
        }

        return NextResponse.json(
            { success: true, pythonNodes: data },
            { status: 200 }
        );        
    } catch (err) {
        return NextResponse.json(
            { error: "Invalid request"},
            { status: 400 }
        );
    }
});