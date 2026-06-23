import { ApiError } from "@/lib/shared/errors/ApiError";
import { supabaseServer } from "../../client";

export class GhScriptRepository {
    async getBySlug(slug: string) {
        const supabase = supabaseServer();

        const { data, error } = await supabase
            .from("ghscripts")
            .select("*")
            .eq("slug", slug)
            .maybeSingle();

        if (error) {
            throw new ApiError(
                "GH_SCRIPT_FETCH_FAILED",
                error.message
            );
        }

        return data;
    }

    async create(data: any) {
        const supabase = supabaseServer();

        const { data: result, error } = await supabase
            .from("ghscripts")
            .insert([data])
            .select()
            .single();

        if (error) {
            throw new ApiError(
                "GH_SCRIPT_CREATE_FAILED",
                error.message
            );
        }

        return result;
    }

    async update(
        scriptId: string,
        payload: any
    ) {
        const supabase = supabaseServer();

        const { error } = await supabase
            .from("ghscripts")
            .update(payload)
            .eq("id", scriptId);

        if (error) {
            throw new ApiError(
                "GH_SCRIPT_UPDATE_FAILED",
                error.message
            );
        }
    }
}