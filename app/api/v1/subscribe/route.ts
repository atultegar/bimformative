import { subscribeToKit } from "@/lib/services/kit.service";
import { KitError } from "@/lib/types/kit";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const result = await subscribeToKit(body.email);

        return NextResponse.json(result, { status: 200 });
    } catch (err) {
        if (err instanceof KitError) {
            const statusMap: Record<string, number> = {
                INVALID_EMAIL: 400,
                KIT_NOT_CONFIGURED: 500,
                SUBSCRIBE_FAILED: 500,
            };

            return NextResponse.json(
                { error: err.message },
                { status: statusMap[err.message] ?? 500 }
            );
        }

        return NextResponse.json(
            { error: "There was a problem, please try again" },
            { status: 500 }
        );
    }
}