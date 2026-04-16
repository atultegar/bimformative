import { analyzeScript } from "@/lib/diff/analyzeScript";
import { generateHash } from "@/lib/diff/hash";
import { supabaseServer } from "@/lib/supabase/server";
import { createSignedUrl } from "@/lib/supabase/storage";
import { NextResponse } from "next/server";

export async function GET() {
    try {        
        const supabase = supabaseServer();

        // Fetch rows that don't have hash yet
        const { data: versions, error } = await supabase
            .from("dynscript_versions")
            .select("id, dyn_file_url, hash");

        if (error) {
            return NextResponse.json(
                { error: error.message},
                { status: 500 }
            );
        }

        if (!versions || versions.length === 0) {
            return NextResponse.json({
                message: "No records to migrate"
            });
        }

        let updatedCount = 0;
        const failed: any[] = [];

        for (const version of versions) {
            try {
                if (!version.dyn_file_url) continue;

                const fileUrl = await createSignedUrl(version.dyn_file_url);

                if (fileUrl === null) {
                    throw new Error("Signed URL error");
                }

                // Fetch JSON file
                const fileResponse = await fetch(fileUrl);

                if (!fileResponse.ok) {
                    throw new Error("Failed to fetch file");
                }

                const fileContent = await fileResponse.text();

                // Aanalyze semantic structure
                const semantic = analyzeScript(fileContent);

                // Generate hash from semantic model
                const hash = await generateHash(semantic);
                console.log(hash);

                // update DB row
                const { error: updateError } = await supabase
                    .from("dynscript_versions")
                    .update({ hash })
                    .eq("id", version.id);

                if (updateError) {
                    throw updateError;
                }

                updatedCount++;
            } catch (innerError: any){
                failed.push({
                    id: version.id,
                    error: innerError.message
                });
            }
        }

        return NextResponse.json({
            message: "Migration completed",
            totalProcessed: versions.length,
            updated: updatedCount,
            failed
        });
        
    } catch (err: any) {
        return NextResponse.json(
            { error: "Migration failed", details: err.message },
            { status: 500 }
        );
    }
}