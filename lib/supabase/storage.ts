import { randomUUID } from "crypto";
import { supabaseServer } from "./server";
import { ApiError } from "../api/errors";

const supabase = supabaseServer();

export function extractStoragePath(publicUrl: string, bucketName: string) {
    try {
        const parts = publicUrl.split(`/storage/v1/object/public/${bucketName}/`);
        if(parts.length !== 2) return null;

        return parts[1];
    } catch (err) {
        return null;
    }
}

export function extractStoragePaths(
    publicUrls: (string | null | undefined)[], 
    bucketName: string
): string[] {
    return publicUrls
        .filter(Boolean)
        .map((publicUrl) => {
            const marker = `/storage/v1/object/public/${bucketName}/`;
            const idx = publicUrl!.indexOf(marker);
            return idx !== -1
            ? publicUrl!.slice(idx + marker.length)
            : null;
        })
        .filter(Boolean) as string[]
}

export async function createSignedUrl(publicUrl: string){
    // publicUrl: https://lkkvozprbvysnqhcstbp.supabase.co/storage/v1/object/public/dynamo-scripts/adaptive-point-elevation-update-d53d9e/v1.dyn
    
    try {
        const parts = publicUrl.split("/storage/v1/object/public/");

        if (parts.length !== 2) {
            console.error("publicUrl is not correct");
            return null;
        }

        const bucketName = parts[1].split("/")[0];
        const relativePath = parts[1].split(`${bucketName}/`)[1];

        const { data: signed, error: urlError } = await supabase.storage
            .from("dynamo-scripts")
            .createSignedUrl(relativePath, 60);

        if (urlError) {
            console.error("Failed to get signed URL");
            return null;
        }

        return signed.signedUrl;

    } catch (error) {
        return null;
    }
}

export async function uploadFileTemp(file: File){
    const uploadId = `upl_${randomUUID()}`;
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    const storagePath = `temp/${uploadId}.dyn`;

    const { error: uploadError } = await supabase.storage
        .from("dynamo-scripts")
        .upload(storagePath, fileBuffer, {
            contentType: file.type || "application/json",
            cacheControl: "3600",
            upsert: true,
        });

    if (uploadError) throw new ApiError("UPLOAD_ERROR", uploadError.message, 500);
    
    return {
        uploadId,
        storagePath,
    };
}

// Get file by storagePath
export async function fileByStoragePath(
    storagePath: string
): Promise<File> {
    const { data: signed, error: urlError } = await supabase.storage
            .from("dynamo-scripts")
            .createSignedUrl(storagePath, 60);

    if (urlError) throw urlError;

    if (!signed?.signedUrl) throw new Error("SIGNED_URL_FAILED");    
    
    const res = await fetch(signed.signedUrl);

    if (!res.ok) throw new Error(`FILE_FETCH_FAILED (${res.status})`);

    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // derive filename from storage path
    const fileName = 
    storagePath.split("/").pop() ?? "script.dyn";

    return new File([buffer], fileName, {
        type: res.headers.get("content-type") ?? "application/octet-stream",
        lastModified: Date.now(),
    });
}