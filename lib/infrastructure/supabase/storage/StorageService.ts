import { supabaseServer } from "../client";
import { ApiError } from "@/lib/shared/errors/ApiError";

export class StorageService {
    async uplaodFile(
        bucket: string,
        path: string,
        file: File
    ) {
        const supabase = supabaseServer();

        const buffer = Buffer.from(
            await file.arrayBuffer()
        );

        const { error } = await supabase.storage
            .from(bucket)
            .upload(path, buffer, {
                contentType: file.type,
                upsert: true,
            });

        if (error) {
            throw new ApiError(
                "FILE_UPLOAD_FAILED",
                error.message,
                500
            );
        }

        const { data } = supabase.storage
            .from(bucket)
            .getPublicUrl(path);

        return data.publicUrl;
    }
}