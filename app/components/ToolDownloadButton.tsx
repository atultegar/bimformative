"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface ToolDownloadButtonProps {
    releaseId: string;
    text?: string;
    variant?:
        | "default"
        | "secondary"
        | "outline"
        | "ghost"
        | "link"
        | "destructive";
        size?: "default" | "sm" | "lg" | "icon";
        className?: string;
}

export function ToolDownloadButton({
    releaseId,
    text = "Download",
    variant = "default",
    size = "default",
    className,
}: ToolDownloadButtonProps) {
    const handleDownload = () => {
        window.location.href = `/api/public/v1/tools/download?id=${releaseId}`;
    };

    return (
        <Button
            variant={variant}
            size={size}
            className={className}
            onClick={handleDownload}
        >
            <Download className="mr-2 h-4 w-4" />
            {text}
        </Button>
    )
}