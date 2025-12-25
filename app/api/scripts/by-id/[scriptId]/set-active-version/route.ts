import { withAuth } from "@/app/lib/auth/withAuth";
import { withOwnerCheck } from "@/app/lib/withOwnerCheck";
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export const POST = withAuth(
    withOwnerCheck(async ({ req, userId, scriptId, script }) => {
        const { versionId } = await req.json();

        const supabase = supabaseServer();

        const { error } = await supabase
            .from("dynscripts")
            .update({ current_version_number: versionId })
            .eq("id", scriptId);

        if (error) {
            return NextResponse.json(
                { error: "Failed to update active version "},
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    })
);