"use client";

import React from "react";
import { AlertDialogAction } from "@/components/ui/alert-dialog";

export default function YouTubeButton({videoUrl}: {videoUrl: string}) {
    const handleRedirect = () => {
        if (!videoUrl) {
            console.error("No video URL provided");
            return;
        }

        window.open(videoUrl, "_blank");
    };

    return (
        <AlertDialogAction onClick={handleRedirect}>
            Demo
        </AlertDialogAction>
    )
}