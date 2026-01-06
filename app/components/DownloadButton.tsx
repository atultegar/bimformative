"use client";

import React, { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { handleScriptFileDownload } from "@/app/actions/clientActions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type DownloadButtonProps = {
    userId: string;
    slug: string;
    downloadsCount: number;
    variant?: "full" | "icon";
};

export default function DownloadButton({userId, slug, downloadsCount, variant = "icon" } : DownloadButtonProps) {
    const router = useRouter();
    const [downloads, setDownloads] = useState<number>(downloadsCount);
    const [isPending, startTransition] = useTransition();
    
    useEffect(() => {
        setDownloads(downloadsCount);
    }, [downloadsCount]);

    const handleDownload = () => {
        // User not logged in
        if (!userId) {
            router.push(`/sign-in?redirect_url=/resources/dynamo-scripts/${slug}`);
            return;
        };
        
        startTransition(async () => {
            try {
                await handleScriptFileDownload(userId, slug);
                setDownloads(downloadsCount + 1);
            } catch (error) {
                toast.error(`Error downloading script. ${error}`);
            }            
        })
    };
    const baseClasses = "transition-opacity hover:opacity-80 hover:-translate-y-0.5 ease-in-out";

    // Full version
    if (variant === "full") {
        return (
            <Button
                variant={"default"}
                size={"sm"}
                onClick={handleDownload}
                disabled={isPending}
                className={`${baseClasses} flex items-center gap-2`}
            >
                <Download className="w-4 h-4 text-white" />
                <span>Download</span>
                <span className="text-xs bg-black/20 rounded px-1 py-0.5">
                    {isPending ? "..." : downloads}
                </span>
            </Button>
        );
    }

    // Icon-only version
    return (
        <Button
            variant={"ghost"}
            size={"icon"}
            onClick={handleDownload}
            disabled={isPending}
            className={`${baseClasses} relative flex items-center`}>
                <Download className="w-5 h-5 text-green-600" />
                <span className="text-xs opacity-80">
                    {isPending ? "..." : downloads}
                </span>                
        </Button>
    );
}