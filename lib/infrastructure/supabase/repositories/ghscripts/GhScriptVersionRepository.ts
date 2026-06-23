import { ApiError } from "@/lib/shared/errors/ApiError";
import { supabaseServer } from "../../client";

export class GhScriptVersionRepository {
    async getLatestVersion(
        scriptId: string
    ) {
        const supabase = supabaseServer();

        const { data, error } = await supabase
            .from("ghscript_versions")
            .select("version_number")
            .eq("ghscript_id", scriptId)
            .order("version_number", {
                ascending: false,
            })
            .limit(1);

        if (error) {
            throw new ApiError(
                "GH_VERSION_FETCH_FAILED",
                error.message
            );
        }

        return data?.[0];
    }

    async resetCurrentVersions (
        scriptId: string
    ) {
        const supabase = supabaseServer();

        const { error } = await supabase
            .from("ghscript_versions")
            .update({
                is_current: false,
            })
            .eq("ghscript_id", scriptId);

        if (error) {
            throw new ApiError(
                "GH_VERSION_RESET_FAILED",
                error.message    
            );
        }            
    }

    async create(
        payload: any
    ) {
        const supabase = supabaseServer();

        const { data, error } = await supabase
            .from("ghscript_versions")
            .insert([payload])
            .select()
            .single();

        if (error) {
            throw new ApiError(
                "GH_VERSION_CREATE_FAILED",
                error.message
            );
        }

        return data;
    }
}