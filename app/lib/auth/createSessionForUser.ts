import { clerkClient } from "@clerk/nextjs/server";

export async function createSessionForUser(userId: string) {
    const client = await clerkClient();

    const session = await client.sessions.createSession({
        userId,
    });

    return session;
}