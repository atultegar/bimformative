import { getPublicScriptsPaged } from "@/lib/services/scripts.service";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page") ?? 1);
    const limit = Number(searchParams.get("limit") ?? 10);
    const search = searchParams.get("search") ?? undefined;
    const type = searchParams.get("type") ?? undefined;

    const result = await getPublicScriptsPaged(
        { search, type },
        { page, limit }
    );

    return NextResponse.json(result);
}