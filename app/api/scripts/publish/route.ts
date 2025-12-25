import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import slugify from "slugify";
import { createHash } from "crypto";
import { withAuth } from "@/app/lib/auth/withAuth";

function shortHash(input: string) {
    return createHash("sha256").update(input).digest("hex").slice(0, 6);
}

// Breaks CamelCase / PascalCase into words
function splitCamelCase(str: string) {
    return str
        .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
        .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2"); 
}

function generateSlug(title: string, ownerId?: string) {
    if (!title) title = "script";

    // 1. Normalize camelCase / PascalCase
    const spaced = splitCamelCase(title);

    // 2. Replace _ and multiple spaces
    const normalized = spaced.replace(/[_\s]+/g, " ");

    // 3. Slugify → kebab-case
    const base = slugify(normalized, {
        lower: true, 
        strict: true,
        trim: true
    });

    // 4. Hash for uniqueness
    const hash = shortHash((ownerId || "") + title);
    return `${base}-${hash}`;
}

export const POST = withAuth(async ({ req, userId }) => {
    try {
        const formData = await req.formData();

        const file = formData.get("file") as File;
        const parsedJsonRaw = formData.get("parsedJson") as string | null; // from api/scripts/analyze

        if (!file) {
            NextResponse.json({ error: "File is required" }, { status: 400 });
        }

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
        const scriptType = String(formData.get("scriptType") ?? "").trim();
        const tagsRaw = formData.get("tags") as string | null; 
        const demoLink = String(formData.get("demoLink") ?? "").trim();
        const isPublic = formData.get("isPublic") === "true";
                

        // parse tags if present
        let tags: string[] = [];
        try {
            if (tagsRaw) tags = JSON.parse(tagsRaw);
        } catch (e) {
            tags = [];
        }

        

        const supabase = supabaseServer();

        // 1) Determine scriptId: if provided use it; else find by slug or create new dynscripts row
        const slug = generateSlug(title || file.name.replace(/\.[^/.]+$/, ""), userId ?? "");

        const { data: existingScript, error: existingErr } = await supabase
                .from("dynscripts")
                .select("id")
                .eq("slug", slug)
                .maybeSingle();

        let scriptId: string;

        if (!existingScript){
            // create new script row
            const { data: newScript, error: createErr } = await supabase
                .from("dynscripts")
                .insert([{
                    owner_id: userId,
                    title: title || file?.name.replace(/\.[^/.]+$/, ""),
                    slug,
                    description: description || null,
                    script_type: scriptType || null,
                    tags,
                    current_version_number: null,
                    is_public: isPublic,
                }])
                .select()
                .single();

            if (createErr) {
                return NextResponse.json({ error: createErr.message }, { status: 500 });
            }
            scriptId = newScript.id;
        } else {
            // Script exists - optional metadata refresh
            scriptId = existingScript.id;

            const { error: updateMetaErr } = await supabase
                .from("dynscripts")
                .update({
                    title: title || undefined,
                    description: description || undefined,
                    script_type: scriptType || undefined,
                    tags: tags.length ? tags : undefined,
                    is_public: isPublic || false,
                })
                .eq("id", scriptId);
            if (updateMetaErr) {
                console.warn("Warning: failed to update script metadata:", updateMetaErr);
            }
        }        

        if (!scriptId) {
            return NextResponse.json({ error: "Failed to determine script id" }, { status: 500 });
        }

        // 2) Determine new version number
        const { data: versionRows, error: versionSelectErr } = await supabase
            .from("dynscript_versions")
            .select("version_number")
            .eq("script_id",scriptId)
            .order("version_number", { ascending: false})
            .limit(1);

        if (versionSelectErr) {
            NextResponse.json({ error: versionSelectErr.message }, { status: 500 });
        }

        const newVersion = (versionRows?.[0]?.version_number ?? 0) + 1;

        // 3) uplaod file to Supabase Storage
        // path: {slug}/v{newVersion}.dyn
        const arrayBuffer = await file.arrayBuffer();
        const fileBuffer = Buffer.from(arrayBuffer);
        const filePath = `${slug}/v${newVersion}.dyn`;

        const { error: uploadError } = await supabase.storage
            .from("dynamo-scripts")
            .upload(filePath, fileBuffer, {
                contentType: file.type || "application/json",
                cacheControl: "3600",
                upsert: true,
            });

        if (uploadError) {
            return NextResponse.json({ error: uploadError.message }, { status: 500 });
        }

        const { data: urlData } = supabase.storage
            .from("dynamo-scripts")
            .getPublicUrl(filePath);

        const fileUrl = urlData?.publicUrl ?? null;

        // 4) Insert version entry into dynscript_versions and return full row (including id)
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

        // 5) Insert python nodes if exist (use parsedJson.Nodes)
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

        // 6) Set the newly published version as the current version
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

    } catch (err: any) {
        console.error("Publish route error:", err);
        return NextResponse.json({ error: err.message || "Publish failed" }, { status: 500 });
    }
});