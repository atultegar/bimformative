import { createSession, deleteSession, getSession } from "@/app/lib/auth/desktopAuthStore";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session");

    if (!sessionId) {
        return NextResponse.json(
            { error: "Missing session id" },
            { status: 400 }
        );
    }

    const session = await getSession(sessionId);

    if (!session) {
        await createSession(sessionId);
        return NextResponse.json({ status: "pending" });
    }

    if (session.status === "pending") {
        return NextResponse.json({ status: "pending" });
    }

    if (session.status === "approved" && session.token) {
        // One-time read
        await deleteSession(sessionId);

        return NextResponse.json({
            status: "ok",
            token: session.token,
        });

    }

    return NextResponse.json({ status: "expired" });
}