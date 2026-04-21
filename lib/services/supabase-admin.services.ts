import { supabaseServer } from "@/lib/supabase/server";
import { ApiError } from "../api/errors";

export type ExtensionProduct = 'revit' | 'civil3d' | 'grasshopper';

export interface ExtensionDownloadRow {
    id?: string;
    product: ExtensionProduct;
    host_version: string;
    file_name: string;
    storage_path: string;
    file_version?: string;
    is_active?: boolean;
    download_count?: number;
    created_at?: string;
}

export interface ExtensionDownloadLogRow {
    extension_id: string;
    downloaded_at?: string;
    user_id?: string | null;
    ip_address?: string | null;
    user_agent?: string | null;
}

export async function upsertExtensionDownloads(rows: ExtensionDownloadRow[]) {
    const supabase = supabaseServer();
    
    const { data, error } = await supabase
        .from("extension_downloads")
        .upsert(rows)
        .select("*");

    if (error) {
        throw new ApiError("FAILED_TO_UPSERT", `Failed to upsert extension downloads: ${error.message}`, 500)
    }

    return data;
}