"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export function DownloadExtensionButton({ id }: { id: string }) {
    const handleDownload = () => {
        window.location.href = `/api/public/v1/extensions/download?id=${id}`;
    };

    return (
        <Button className="mt-5 w-full" onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download
        </Button>
    );
}