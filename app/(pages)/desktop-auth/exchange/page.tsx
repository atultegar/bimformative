import { validateTicket } from "@/app/lib/auth/desktopTickets";
import { useSearchParams } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { createSessionForUser } from "@/app/lib/auth/createSessionForUser";
import { createSignInTokenForUser } from "@/app/lib/auth/createSignInToken";

type SearchParams = Promise<{
    ticket?: string;
    redirect?: string;    
}>;

export default async function ExchangePage({ 
    searchParams, 
}: {
    searchParams: SearchParams;
}) {

    const { ticket, redirect: redirectTarget = "/" } = await searchParams;
    const safeRedirect = redirectTarget.startsWith("/") ? redirectTarget : "/";

    if (!ticket) {
        redirect("/sign-in");
    }

    const userId = validateTicket(ticket);

    if (!userId) {
        redirect(`/sign-in?redirect_url=${encodeURIComponent(
            `/desktop-auth/exchange?ticket=${encodeURIComponent(ticket)}&redirect=${encodeURIComponent(safeRedirect)}`
            )}`
        ); 
    }

    // Create Clerk session cookie here
    const signInToken = await createSignInTokenForUser(userId);

    redirect(
        `/desktop-auth/complete?token=${encodeURIComponent(
            signInToken
        )}&redirect=${encodeURIComponent(safeRedirect)}`
    );
}