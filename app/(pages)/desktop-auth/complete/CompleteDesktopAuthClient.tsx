"use client";

import { useSignIn } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

interface Props {
    token: string | null;
    redirectUrl: string;
}

export default function CompleteDesktopAuthClient({
    token,
    redirectUrl
}: Props) {
    const { signIn, setActive } = useSignIn();
    const router = useRouter();
    const hasRun = useRef(false);

    useEffect(() => {
        if (hasRun.current) return;
        if (!token || !signIn) return;

        hasRun.current = true;

        const complete = async () => {
            try {
                const result = await signIn.create({
                    strategy: "ticket",
                    ticket: token,
                });

                if (result.createdSessionId) {
                    await setActive({ session: result.createdSessionId });
                    router.replace(redirectUrl);
                }
            } catch (error) {
                console.error("Desktop auth completion failed:", error);
                router.replace("/sign-in");
            }
        };

        complete();
        
    }, [token, signIn, router, setActive, redirectUrl]);

    return <div>Signing you in...</div>;
}