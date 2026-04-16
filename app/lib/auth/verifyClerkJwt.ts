import { verifyToken } from "@clerk/backend";

export async function verifyClerkJwt(req: Request) {
    const authHeader = req.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
        return null;
    }

    const token = authHeader.replace("Bearer ", "");

    try {
        const payload = await verifyToken(token, {
            secretKey: process.env.CLERK_SECRET_KEY!,
        });

        return payload.sub; // Clerk userId
    } catch {
        return null;
    }
}