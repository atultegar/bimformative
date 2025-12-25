import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { withAuth } from "@/app/lib/auth/withAuth";
import { withOwnerCheck } from "@/app/lib/withOwnerCheck";

export const POST = withAuth(
    withOwnerCheck(async ({ req, userId, scriptId, script }) => {
        try {
            const formData = await req.formData();

            const title = String(formData.get("title") ?? "").trim();
            const description = String(formData.get("description") ?? "").trim();
            const tagsRaw = formData.get("tags") as string | null;
            const scriptType = String(formData.get("scriptType") ?? "").trim();

            let tags: string[] = [];
            try {
                if (tagsRaw) tags = JSON.parse(tagsRaw);
            } catch {
                tags = [];
            }

            const supabase = supabaseServer();

            // Perform update
            const { error: updateErr } = await supabase
                .from("dynscripts")
                .update({
                    title: title || undefined,
                    description: description || undefined,
                    script_type: scriptType || undefined,
                    tags: tags.length ? tags : undefined,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", scriptId);

            if (updateErr) {
                return NextResponse.json(
                    { error: updateErr.message },
                    { status: 500 }
                );
            }

            return NextResponse.json({ success: true })

        } catch {
            return NextResponse.json(
                { error: "Some error occured."},
                { status: 500 }
            )
        }        
    })
);