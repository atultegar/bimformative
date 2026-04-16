import { approveSession } from "@/app/lib/auth/desktopAuthStore";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { sessionId } = await req.json();

    if (!sessionId) {
        return NextResponse.json(
            { error: "Missing sessionId" },
            { status: 400 }
        );
    }

    const { userId, getToken } = await auth();

    if (!userId) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    // Clerk JWT for desktop app
    const token = await getToken({ template: "desktop" });

    if (!token) {
        return NextResponse.json(
            { error: "TOKEN_GENERATION_FAILED" },
            { status: 500 }
        );
    }

    await approveSession(sessionId, token);

    return NextResponse.json({ status: "approved" })
}