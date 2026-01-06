import { User } from "@/app/lib/interface";
import { supabaseServer } from "./server";
import { NextResponse } from "next/server";

export async function getUserById(userId: string | null) {
    if (!userId) return null;
    const supabase = supabaseServer();

    const { data: userData, error: userDataErr } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

    if (userDataErr || !userData) {
        return null;
    }

    return userData;
}

export async function getScriptsCountByUserId(userId: string) {
    const supabase = supabaseServer();    

    const {data, error, count} = await supabase
        .from("dynscripts")
        .select(`
            id,
            owner_id
        `, { count: "exact"})
        .eq("owner_id", userId);

    if (error || !data) {
       return 1;
    }

    return count;
}