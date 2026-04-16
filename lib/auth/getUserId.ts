import { verifyClerkJwt } from "@/app/lib/auth/verifyClerkJwt";
import { auth } from "@clerk/nextjs/server";

const DEV_MODE = process.env.NODE_ENV === "development";
const DEV_FAKE_USER_ID = process.env.DEV_FAKE_USER_ID ?? null;

export async function getUserId(req: Request): Promise<string | null> {
    if (DEV_MODE && DEV_FAKE_USER_ID) return DEV_FAKE_USER_ID;

    const jwtUser = await verifyClerkJwt(req);
    if (jwtUser) return jwtUser;

    const authResult = await auth();
    return authResult.userId;
}