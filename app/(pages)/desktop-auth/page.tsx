import { Suspense, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import DesktopAuthClient from "./DesktopAuthClient";

interface Props {
    searchParams: Promise<{
        session?: string;
    }>;
}

export default async function DesktopAuthPage({ searchParams }: Props) {
    const { session } = await searchParams;
    
    return (
        <Suspense fallback={<DesktopAuthLoading />}>
            <DesktopAuthClient sessionId={session ?? null} />
        </Suspense>
    );
}

function DesktopAuthLoading() {
    return (
        <div className="h-[100vh] flex items-center justify-center">
            <div className="text-center">
                <h2>Loading authentication...</h2>
            </div>
        </div>
    );
}