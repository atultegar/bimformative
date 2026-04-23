import { supabaseServer } from "@/lib/supabase/server";
import { ApiError } from "../api/errors";

export type RoadmapRecord = {
    id: string;
    slug: string;
    title: string;
    subtitle: string | null;
    status: 'live' | 'in_progress' | 'planned' | 'vision';
    icon: "rocket" | "wrench" | "brain" | "globe";
    points: string[];
    item_order: number;
    is_active: boolean;
};

export async function getRoadmapItems(): Promise<RoadmapRecord[]> {
    const supabase = supabaseServer();

    const { data, error } = await supabase
        .from("roadmap_items")
        .select("*")
        .eq("is_active", true)
        .order("item_order", { ascending: true });

    if (error) {
        throw new ApiError("FAILED_TO_FETCH", `Failed to fetch roadmap: ${error.message}`, 404);
    }

    return (data ?? []) as RoadmapRecord[];
}