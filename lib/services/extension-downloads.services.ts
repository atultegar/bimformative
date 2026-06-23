import { supabaseServer } from "@/lib/supabase/server";
import { ApiError } from "../api/errors";
import { ExtensionDownloadRow } from "./supabase-admin.services";


export type ExtensionDownloadRecord  = {
    id: string;
    product: 'revit' | 'civil3d' | 'grasshopper';
    host_version: string;
    file_name: string;
    storage_path: string;
    file_version: string;
    is_active: boolean;
    download_count: number;
    created_at: string;
}
export async function getActiveExtensionDownloads() {
    const supabase = supabaseServer();

    const { data, error } = await supabase
        .from("extension_downloads")
        .select("*")
        .eq("is_active", true)
        .order("product", { ascending: true})
        .order("host_version", { ascending: true });

    if (error) {
        throw new ApiError("FAILED_TO_FETCH", `Failed to fetch extension downloads: ${error.message}`, 500);
    }

    return (data ?? []) as ExtensionDownloadRecord[];
}

export async function getActiveExtensionById(id: string) {
    const supabase = supabaseServer();

    const { data, error } = await supabase
        .from("extension_downloads")
        .select("*")
        .eq("id", id)
        .eq("is_active", true)
        .single();

    if (error || !data) {
        throw new ApiError("EXTENSION_NOT_FOUND", "Extension not found or inactive");
    }

    return data as ExtensionDownloadRecord;
}

export async function logDownload(row: {
    extension_id: string;
    downloaded_at?: string;
    user_id?: string | null;
    ip_address?: string | null;
    user_agent?: string | null;
}) {
    const supabase = supabaseServer();

    const { error } = await supabase
        .from("extension_download_logs")
        .insert(row);

    if (error) {
        throw new ApiError("FAILED_TO_LOG", `Failed to log extension download: ${error.message}`, 500);
    }
}

export async function incrementDownloadCount(extensionId: string) {
    const supabase = supabaseServer();

    const { data, error } = await supabase.rpc(
        "increment_extension_download_count",
        {
            row_id: extensionId,
        }
    );

    if (error) {
        throw new ApiError("FAILED_TO_INCREMENT", `Failed to increment download count: ${error.message}`, 500)
    }
}

export async function createSignedDownloadUrl(storagePath: string, expiresInSeconds = 60) {
    const supabase = supabaseServer();

    const { data, error } = await supabase.storage
        .from("extensions")
        .createSignedUrl(storagePath, expiresInSeconds);

    if (error || !data) {
        throw new ApiError("FAILED_TO_CREATE_SIGNEDURL", `Failed to create signed URL: ${error?.message ?? "Unknown error"}`);
    }

    return data.signedUrl;
}
