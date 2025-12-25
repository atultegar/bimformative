import { supabaseServer } from "@/lib/supabase/server";
import { PROFILE_MINIMAL_FIELDS } from "./profile.select";

export async function getProfileById(profileId: string) {
    const supabase = supabaseServer()
    const { data, error } = await supabase
        .from("profiles")
        .select(PROFILE_MINIMAL_FIELDS)        
        .eq("id", profileId)
        .single();

    if (error || !data) throw new Error("PROFILE NOT FOUND");

    return data;
}