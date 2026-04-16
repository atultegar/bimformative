"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";

interface Props {
    sessionId?: string | null;
}

export default function DesktopAuthPage({ sessionId }: Props) {    
    const { getToken, isSignedIn } = useAuth();

    useEffect(() => {
        if (!isSignedIn || !sessionId) return;

        let cancelled = false;

        const completeAuth = async () => {
            try {
                const token = await getToken();

                if (!token || cancelled) return;

                await fetch('/api/public/v1/desktop-auth/approve', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        sessionId,
                        token,
                    }),
                });
            } catch (error) {
                console.error("Desktop auth approval failed:", error);
            }            
        };

        completeAuth();
        
        return () => {
            cancelled = true;
        };
    }, [isSignedIn, sessionId, getToken]);

    return (
        <div className="h-[100vh] flex items-center justify-center">
            <div className="text-center">
                <h2>Signed in successfully</h2>
                <p>You may now return to Dynamo.</p>
                <p className="mt-12 opacity-60">
                    This window can be closed.
                </p>
            </div>
        </div>
    );
}