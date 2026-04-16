import { clerkClient } from "@clerk/nextjs/server";

export async function createSignInTokenForUser(userId: string) {
    const client = await clerkClient();

    const token = await client.signInTokens.createSignInToken({
        userId,
        expiresInSeconds: 60,
    });

    return token.token;
}