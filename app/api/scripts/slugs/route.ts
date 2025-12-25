import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic"; // ensures latest data on build

export async function GET() {
    const supabase = supabaseServer();

    const { data, error } = await supabase
        .from("dynscripts")
        .select("id, slug")
        .order("created_at", { ascending: false });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, {status: 200 });
}