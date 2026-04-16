import { getLatestVersionBySlug, getVersionById, getVersionBySlugAndNumber } from "./versions.service";
import { analyzeDynamoJson } from "./dynalyzer.service";
import { ApiError } from "../api/errors";

type CompareRequest = {
    left: {
        type: "versionId" | "hash" | "latest" | "local" | "versionNo";
        value?: string | number;
        payload?: any; //for local JSON
    };
    right: {
        type: "versionId" | "hash" | "latest" | "local" | "versionNo";
        value?: string | number;
        payload?: any;
    }
}

export async function compareScriptVersions(
    slug: string,
    input: CompareRequest
) {
    const left = await resolveVersion(slug, input.left);
    const right = await resolveVersion(slug, input.right);
    
    return {
        left,
        right
    };
}

async function resolveVersion(
    slug: string, 
    ref: any
) {
    switch (ref.type) {

        case "latest":
            return await getLatestVersionBySlug(slug); //all fields (version: id, script_id, version_number, changelog, dyn_file_url, nodes, connectors, created_at, updated_at, dynamo_version, is_player_ready, external_packages, demo_link, is_current, hash)

        case "versionId":
            return await getVersionById(ref.value); //all fields (version: id, script_id, version_number, changelog, dyn_file_url, nodes, connectors, created_at, updated_at, dynamo_version, is_player_ready, external_packages, demo_link, is_current, hash)

        case "local":
            const parsed = JSON.parse(ref.payload);
            const result = await analyzeDynamoJson(parsed); //analyze output (scriptData: DynamoVersion, DynamoPlayerReady, PythonScripts, ExternalPackages, Nodes, Connectors)

            return {
                "id": "",
                "script_id": "",
                "version_number": 0,
                "changelog": "local",
                "dyn_file_url": "",
                "nodes": result.scriptData.Nodes,
                "connectors": result.scriptData.Connectors,
                "created_at": new Date().toISOString(),
                "updated_at": new Date().toISOString(),
                "dynamo_version": result.scriptData.DynamoVersion,
                "is_player_ready": result.scriptData.DynamoPlayerReady,
                "external_packages": result.scriptData.ExternalPackages,
                "demo_link": "",
                "is_current": false,
                "hash": ref.value
            }

        case "versionNo":
            return await getVersionBySlugAndNumber(slug, ref.value);
            
        default:
            throw new ApiError("INVALID_REFERENCE_TYPE", "Invalid reference type", 500);
    }
}

