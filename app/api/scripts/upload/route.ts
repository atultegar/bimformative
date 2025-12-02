import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import crypto, { createHash } from "crypto";
import { PythonNode } from "@/app/lib/interface";
import slugify from "slugify";
import { error } from "console";

function shortHash(input: string) {
    return createHash("sha256").update(input).digest("hex").slice(0, 6);
}

function generateSlug(title: string, ownerId: string) {
    const base = slugify(title, { lower: true, strict: true });
    const hash = shortHash(ownerId + title);
    return `${base}-${hash}`;
}

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;
        const ownerId = formData.get("ownerId") as string;
        const scriptType = formData.get("scriptType") as string;
        const tags = formData.get("tags") as string;

        if(!file) {
            return NextResponse.json({ error: "File is required" }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const fileBuffer = Buffer.from(arrayBuffer);
        const originalName = file.name;

        const supabase = supabaseServer();
        let scriptId = formData.get("scriptId") as string | null;
        // const versionId = crypto.randomUUID();

        const title = originalName.replace(/\.[^/.]+$/, ""); // remove extension
        const slug = generateSlug(title, ownerId);

        const jsonString = new TextDecoder().decode(arrayBuffer);

        let parsedJson;

        try {
            parsedJson = JSON.parse(jsonString);
        } catch (err) {
            return NextResponse.json(
                { error: "Invalid Dynamo JSON content" },
                { status: 400 }
            );
        }        

        // 1. CALL AZURE FUNCTION
        const azureResponse = await fetch(
            process.env.AZURE_FUNCTION_URL!,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(parsedJson),
            }
        );

        const scriptData = await azureResponse.json();

        const nodes = scriptData.Nodes;
        const connectors = scriptData.Connectors;
        const havePythonScripts = scriptData.PythonScripts;
        var pythonNodes: PythonNode[] = [];
        
        if (havePythonScripts && nodes.length > 0){
            nodes.map((item: any, i: number) => {
                if (item.NodeType === "PythonScriptNode"){
                    const pythonNode = {
                        nodeId: i,
                        code: item.Code
                    }
                    pythonNodes.push(item.Code)
                }
            })
        }

        // 2. Find script by ID or slug
        if (!scriptId) {
            const { data: existing, error: existingError } = await supabase
                .from("dynscripts")
                .select("id")
                .eq("slug", slug)
                .maybeSingle();

            if (existing) {
                scriptId = existing.id;
            } else {
                const { data: newScript, error: createError } = await supabase
                    .from("dynscripts")
                    .insert([
                        {
                            // owner_id: ownerId,
                            title: scriptData.Name,
                            slug: slug,
                            description: scriptData.Description,
                            script_type: scriptType,
                            tags: ["Revit", "Dynamo"]
                        },
                    ])
                    .select()
                    .single();

                if (createError) {
                    return NextResponse.json({ error: createError.message }, { status: 500 });
                }

                scriptId = newScript.id;
            }
                    
        }

        // 3. Determine the new version number
        const { data: versionRows } = await supabase
            .from("dynscript_versions")
            .select("version_number")
            .eq("script_id", scriptId)
            .order("version_number", { ascending: false })
            .limit(1);

        const newVersion = (versionRows?.[0]?.version_number ?? 0) + 1;
        
        const filePath = `${slug}/v${newVersion}.dyn`;

        // 4. Upload file to Supabase Storage
        const { error: uploadError } = await supabase.storage
            .from("dynamo-scripts")
            .upload(filePath, fileBuffer, {
                contentType: "application/json",
                cacheControl: "3600",
                upsert: true,
            });

        if (uploadError) {
            return NextResponse.json({ error: uploadError.message }, { status: 500 });
        }

        const fileUrl = supabase.storage
            .from("dynamo-scripts")
            .getPublicUrl(filePath).data.publicUrl;       
        

        // 5. Insert version entry
        const { data: versionData, error: versionError } = await supabase
            .from("dynscript_versions")
            .insert([
                {
                    script_id: scriptId,
                    version_number: newVersion,
                    changelog: "",
                    dyn_file_url: fileUrl,
                    json_content: scriptData.Nodes,
                    script_view: scriptData.Connectors,
                    dynamo_version: scriptData.DynamoVersion,
                    is_player_ready: scriptData.DynamoPlayerReady,
                    external_packages: scriptData.ExternalPackages
                },
            ]);
        
        if (versionError) {
            return NextResponse.json({ error: versionError.message }, { status: 500 });
        }

        // Save python scripts separately
        if (pythonNodes?.length) {
            const formatted = pythonNodes.map((p: PythonNode, i: number) => ({
                script_version_id: 1,
                node_id: p.nodeId,
                order_index: i,
                python_code: p.code                
            }));

            await supabase.from("dynscript_python_nodes").insert(formatted);
        }

        return NextResponse.json({ success: true, script: scriptData.Name, version: newVersion, downloadUrl: fileUrl }, { status: 200 });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}