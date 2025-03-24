"use client";

import React, { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { handleScriptDownload } from "../actions/clientActions";

export default function DownloadButton({script } : {script: any}) {
    const [downloads, setDownloads] = useState<number>(script.downloads);
    const [isPending, startTransition] = useTransition();
    
    useEffect(() => {
        setDownloads(script.downloads);
    }, [script.downloads]);

    const handleDownload = () => {
        startTransition(async () => {
            try {
                const result = await handleScriptDownload(script._id);
                setDownloads(result?.downloads);
            } catch (error) {
                console.error("Error downloading script.", error);
            }            
        })
    };

    return (
        <Button
            variant={"ghost"}
            size={"default"}
            onClick={handleDownload}
            disabled={isPending}
            className="text-md transition-opacity hover:opacity-80 hover:-translate-y-0.5 ease-in-out">
                <Download color="green" />
                {isPending ? "..." : downloads}
        </Button>
    )
}