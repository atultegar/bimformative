import { NextApiRequest, NextApiResponse } from "next";
import { createTicket } from "@/app/lib/auth/desktopTickets";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { verifyClerkJwt } from "@/app/lib/auth/verifyClerkJwt";

const DEV_MODE = process.env.NODE_ENV === "development";
const DEV_FAKE_USER_ID = process.env.DEV_FAKE_USER_ID ?? null;

export async function POST(req: Request) {
   let userId: string | null = null;    
       
    // DEV MODE
    if (DEV_MODE && DEV_FAKE_USER_ID) {
        userId = DEV_FAKE_USER_ID;
    } else {
        const authResult = await auth();
        userId = authResult.userId;
    }

    // DESKTOP JWT
    if (!userId) {
        userId = await verifyClerkJwt(req);
    }    

    if (!userId) {
        return NextResponse.json(
            { error: "UNAUTHORIZED" },
            { status: 401 } 
        );
    }

    const ticket = await createTicket(userId, 30);
    return NextResponse.json({ ticket });
}