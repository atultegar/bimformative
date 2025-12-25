import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/app/lib/auth/withAuth";
import { supabaseServer } from "@/lib/supabase/server";
import { withOwnerCheck } from "@/app/lib/withOwnerCheck";
import { extractStoragePath } from "@/lib/supabase/storage";
import { supabase } from "@/lib/supabase/client";

type DynamoScript = {
    title: string;
    description: string;
    script_type: string;
    tags: string[];
    current_version_number: number;
}

export const PUT = withAuth(
    withOwnerCheck(async ({ req, userId, scriptId, script }) => {
        try {
            const formData = await req.formData();
            
            const file = formData.get("file") as File | null;
            const parsedJsonRaw = formData.get("parsedJson") as string | null; //from api/scripts/analyze

            // parsedJson optional: prefer to store full parsed JSON if provided
            let parsedJson: any = null;
            if (parsedJsonRaw) {
                try { 
                    parsedJson = JSON.parse(parsedJsonRaw);
                } catch (e) { 
                    parsedJson = null; 
                }
            }

            const title = String(formData.get("title") ?? "").trim();
            const description = String(formData.get("description") ?? "").trim();
            const tagsRaw = formData.get("tags") as string | null;
            const scriptType = String(formData.get("scriptType") ?? "").trim();
            const demoLink = String(formData.get("demoLink") ?? "").trim();

            const supabase = supabaseServer();

            // parse tags if present
            let tags: string[] = [];
            try {
                if (tagsRaw) tags = JSON.parse(tagsRaw);
            } catch (e) {
                tags = [];
            }

            // 1. Check for existing script
            const { data: scriptRows, error: existingErr } = await supabase
                .from("dynscripts")
                .select("slug")
                .eq("id", scriptId)
                .limit(1)

            if (existingErr) {
                return NextResponse.json({ error: existingErr.message }, { status: 404 });
            }

            const slug = scriptRows?.[0].slug;

            // 2. Update metadata of script
            const { error: updateMetaErr } = await supabase
                .from("dynscripts")
                .update({
                    title: title || undefined,
                    description: description || undefined,
                    script_type: scriptType || undefined,
                    tags: tags.length ? tags : undefined,
                })
                .eq("id", scriptId);
            if (updateMetaErr) {
                console.warn("Warning: failed to update script metadata:", updateMetaErr);
            }

            if (!file) { 
                return NextResponse.json( { message: "Script metadata updated successfully"}, { status: 200})
            }

            // 3. Determine new version number
            const { data: versionRows , error: versionSelectErr } = await supabase
                .from("dynscript_versions")
                .select("version_number")
                .eq("script_id", scriptId)
                .order("version_number", { ascending: false})
                .limit(1);

            if (versionSelectErr) {
                NextResponse.json({ error: versionSelectErr.message }, { status: 500 });
            }

            const newVersion = (versionRows?.[0]?.version_number ?? 0) + 1;

            // 4. uplaod file to Supabase Storage
            // path: {slug}/v{newVersion}.dyn
            const arrayBuffer = await file.arrayBuffer();
            const fileBuffer = Buffer.from(arrayBuffer);
            const filePath = `${slug}/v${newVersion}.dyn`;

            const { error: uploadErr } = await supabase.storage
                .from("dynamo-scripts")
                .upload(filePath, fileBuffer, {
                    contentType: file.type || "application/json",
                    cacheControl: "3600",
                    upsert: true,
                });

            if (uploadErr) {
                return NextResponse.json({ error: uploadErr.message }, { status: 500 });
            }

            const { data: urlData } = supabase.storage
            .from("dynamo-scripts")
            .getPublicUrl(filePath);

            const fileUrl = urlData?.publicUrl ?? null;

            // 5. Insert version entry into dynscript_versions and return full row (including id)
            const versionInsert = {
                script_id: scriptId,
                version_number: newVersion,
                changelog: "",
                dyn_file_url: fileUrl,
                dynamo_version: parsedJson?.DynamoVersion ?? null,
                is_player_ready: parsedJson?.DynamoPlayerReady ?? false,
                external_packages: parsedJson?.ExternalPackages ?? null,
                nodes: parsedJson?.Nodes ?? null,
                connectors: parsedJson?.Connectors ?? null,
            };

            const { data: versionDataArr, error: versionInsertErr } = await supabase
                .from("dynscript_versions")
                .insert([versionInsert])
                .select()
                .single();

            if (versionInsertErr) {
                return NextResponse.json({ error: versionInsertErr.message }, { status: 500 });
            }

            const versionRow = versionDataArr; // single row

            // 6. Insert python nodes if exist (use parsedJson.Nodes)
            if (parsedJson?.Nodes?.length) {
                const pythonNodes = parsedJson.Nodes
                    .filter((n: any) => n.NodeType === "PythonScriptNode")
                    .map((n: any, idx: number) => ({
                        script_version_id: versionRow.id,
                        node_id: n.Id,
                        order_index: idx,
                        python_code: n.Code ?? "",
                    }));

                if (pythonNodes.length > 0) {
                    await supabase.from("dynscript_python_nodes").insert(pythonNodes);
                }
            }

            // 7. Set the newly published version as the current version
            const { error: updateCurrentErr } = await supabase
                .from("dynscripts")
                .update({ current_version_number: newVersion })
                .eq("id", scriptId);

            if (updateCurrentErr) {
                console.warn("Warning: failed to update the current_version_number:", updateCurrentErr);
            }

            return NextResponse.json({
                success: true,
                script: title,
                version: newVersion,
                downloadUrl: fileUrl,
                versionRow,
            }, { status: 200 });
            
        } catch {
            return NextResponse.json({ error: "Some error occured"}, { status: 500 });
        }
    })
);

export const GET = withAuth(async ({ req, userId, params }) => {
    const supabase = supabaseServer();
    const resolvedParams = await params;
    const scriptId = resolvedParams?.scriptId;

    const { data, error } = await supabase
        .from("dynscripts_with_current_version")
        .select("id, owner_id, title, slug, description, script_type, tags, updated_at, current_version_number")        
        .eq("id", scriptId)
        .single();

    if (error) {
        return NextResponse.json({ error: error.message}, { status: 500});
    }
    
    return NextResponse.json({ success: true, script: data }, { status: 200 });
});

export const DELETE = withAuth(
    withOwnerCheck(async({ req, userId, params }) => {
        try {
            const resolvedParams = await params;
            const scriptId = resolvedParams.scriptId;

            const supabase = supabaseServer();

            // 1. Validate script exists
            const { data: existing, error: findErr } = await supabase
                .from("dynscripts")
                .select("id, current_version_number, owner_id, slug")
                .eq("id", scriptId)
                .single();

            if (findErr || !existing) {
                return NextResponse.json(
                    { error: "Script not found" },
                    { status: 404 }                
                );
            }

            // 2. Get all versions for this script
            const { data: versions, error: versionError } = await supabase
                .from("dynscript_versions")
                .select("id, script_id, version_number, dyn_file_url")
                .eq("script_id", scriptId)
                .order("version_number", { ascending: true });

            if (versionError || !versions) {
                return NextResponse.json(
                    { error: "Failed fetching script versions"},
                    { status: 500 }
                );
            }

            // 3. Delete storage files first
            const deleteFiles: string[] = [];
            versions.map(v => {
                const relativeFileUrl = extractStoragePath(v.dyn_file_url, "dynamo-scripts");

                if(relativeFileUrl){
                    deleteFiles.push(relativeFileUrl);
                }                
            })

            if (deleteFiles.length > 0) {
                const { error: deleteVerErr } = await supabase.storage
                    .from("dynamo-scripts")
                    .remove(deleteFiles);

                if (deleteVerErr) {
                    console.warn(
                        "⚠️ Warning: Failed to delete storage file:",
                        deleteVerErr.message
                    );
                }
            }


            // 4. Delete Script - It will also delete all version rows from dynscript_versions table
            if (existing) {
                const { error: deleteErr } = await supabase
                    .from("dynscripts")
                    .delete()
                    .eq("id", scriptId);

                if (deleteErr) {
                    return NextResponse.json(
                        { error: deleteErr.message },
                        { status: 500}
                    )
                }
            }            

            return NextResponse.json(
                { success: true, message: "Script and all its versions deleted successfully." }
            )
        } catch (err) {
            return NextResponse.json(
                { error: "Unexpected server error" },
                { status: 500 }
            );
        }
    })
);

export const PATCH = withAuth(
    withOwnerCheck(async({ req, userId, params }) => {
        try {
            const resolvedParams = await params;
            const scriptId = resolvedParams.scriptId;

            const updates: DynamoScript = await req.json();

            const {title, description, script_type, tags, current_version_number } = updates;

            // check if the new version is valid
            const { data: script, error: scriptError } = await supabase
                .from("dynscripts")
                .select("current_version_number")
                .eq("id", scriptId)
                .single();

            if (scriptError || !script) {
                return NextResponse.json(
                    { error: "Script not found"},
                    { status: 404 }
                );
            }

            // Update the script details
            const { error: updateError } = await supabase
                .from("dynscripts")
                .update({
                    title,
                    description,
                    script_type,
                    tags,
                    current_version_number
                })
                .eq("id", scriptId);

            if (updateError) {
                return NextResponse.json(
                    { error: "Failed to update script" },
                    { status: 500 }
                );
            }

            // Set the selected version as current in dynscript_versions table
            const { error: versionError } = await supabase
                .from("dynscript_versions")
                .update({ is_current: true })
                .eq("script_id", scriptId)
                .eq("version_number", current_version_number);

            if (versionError) {
                return NextResponse.json(
                    { error: "Failed to update version" },
                    { status: 500 }
                );
            }

            return NextResponse.json(
                { message: "Script updated successfully", script: "data" },
                { status: 200 }
            )
        } catch (error) {
            return NextResponse.json(
                { error: "Internal server error"},
                { status: 500 }
            );
        }
    })
);