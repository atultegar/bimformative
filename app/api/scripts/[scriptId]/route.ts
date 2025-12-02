import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/app/lib/auth/withAuth";
import { supabaseServer } from "@/lib/supabase/server";
import { withOwnerCheck } from "@/app/lib/withOwnerCheck";

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