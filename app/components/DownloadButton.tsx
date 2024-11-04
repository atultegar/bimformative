"use client";

import React from "react";
import { AlertDialogAction } from "@/components/ui/alert-dialog";

export default function DownloadButton({ fileUrl } : {fileUrl: string}) {
    const handleDownload = () => {
        if (!fileUrl) {
            console.error("no file URL provided");
            return;
        }

        const downloadUrl = `${fileUrl}?dl`;
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.setAttribute("download", "downloadFile");
        link.setAttribute("target", "_blank");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <AlertDialogAction onClick={handleDownload}>
            Download
        </AlertDialogAction>
    )
}