import { ApiError } from "../api/errors";
import { supabaseServer } from "../supabase/server";

export type ToolReleaseRecord = {
    id: string;
    variant_id: string;
    version: string;
    release_notes: string;
    download_url?: string;
    min_host_version: string;
    max_host_version: string;
    is_latest: boolean;
    is_active: boolean;
    storage_path: string;
    download_count: number;
    published_at: string;
}

export async function getActiveToolReleaseById(releaseId: string) {
    const supabase = supabaseServer();

    const { data, error } = await supabase
        .from("tool_releases")
        .select("*")
        .eq("id", releaseId)
        .eq("is_active", true)
        .single();

    if (error || !data) {
        throw new ApiError(
            "TOOL_RELEASE_NOT_FOUND",
            "Tool release not found",
            404
        );
    }

    return data as ToolReleaseRecord;
}

export async function incrementToolDownloadCount(releaseId: string) {
    const supabase = supabaseServer();

    const { error } = await supabase.rpc(
        "increment_tool_download_count",
        {
            row_id: releaseId,
        }
    );

    if (error) {
        throw new ApiError(
            "FAILED_TO_INCREMENT_DOWNLOAD_COUNT",
            error.message,
            500
        );
    }
}

export async function createSignedDownloadUrl(
    storagePath: string, 
    expiresInSeconds = 60
) {
    const supabase = supabaseServer();

    const { data, error } = await supabase.storage
        .from("tools")
        .createSignedUrl(storagePath, expiresInSeconds);

    if (error || !data) {
        throw new ApiError(
            "FAILED_TO_CREATE_SIGNEDURL", 
            error?.message ?? "Unknown error",
            500
        );
    }

    return data.signedUrl;
}