"use server";

import { supabaseServer } from "@/lib/supabase/server";
import { UploadScript, PythonNode } from "@/app/lib/interface";

export async function uploadScript({
    userId,
    title,
    slug,
    description,
    script_type,
    tags,
    changelog,
    dynFile,
    jsonContent,
    scriptView,
    dynamoVersion,
    isPlayerReady,
    externalPackages,
    pythonNodes
    
}: UploadScript): Promise<{ script: any; version: any }> {

    const supabase = supabaseServer();

    // 1. Upload the .dyn file to storage
    const filePath = `scripts/${slug}/${Date.now()}.dyn`;

    const { error: fileError } = await supabase.storage
        .from("dynamo-scripts")
        .upload(filePath, dynFile);

    if (fileError) throw new Error(fileError.message);

    // 2. Insert into scripts table
    const { data: script, error: scriptError } = await supabase
        .from("dynscripts")
        .insert({
            owner_id: userId,
            title,
            slug,
            description,
            script_type: script_type,
            tags: tags            
        })
        .select()
        .single();

    if (scriptError) throw new Error(scriptError.message);

    // 3. Insert version 1
    const { data: version, error: versionError } = await supabase
        .from("dynscript_versions")
        .insert({
            script_id: script.id,
            version_number: 1,
            changelog: changelog,
            dyn_file_url: filePath,
            json_content: jsonContent,
            script_view: scriptView,
            dynamo_version: dynamoVersion,
            is_player_ready: isPlayerReady,
            external_packages: externalPackages
        })
        .select()
        .single();

    if (versionError) throw new Error(versionError.message);

    // 4. Insert python nodes
    if (pythonNodes?.length) {
        const formatted = pythonNodes.map((p, i) => ({
            script_version_id: version.id,
            node_id: p.nodeId,
            order_index: i,
            python_code: p.code
        }));

        await supabase.from("dynscript_python_nodes").insert(formatted);
    }

    return { script, version };
}