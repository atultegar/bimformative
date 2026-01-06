"use client";

import { handleScriptVersionDownload } from "@/app/actions/clientActions";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useRouter } from "next/navigation";
import SimpleTooltip from "@/components/ui/SimpleTooltip";

type Props = {
    title: string;
    versionId: string;
    userId?: string | null;
};

export default function VersionDownloadButton({
    title,
    versionId,
    userId,
}: Props) {
    const router = useRouter();

    const onDownload = async () => {
        if (!userId) {
            router.push(
                `/sign-in?redirect_url=/resources/dynamo-scripts`
            );
            return;
        }

        await handleScriptVersionDownload(title, versionId);
    };

    const tooltipText = userId
        ? "Download this version"
        : "Sign in to download";

    return (
        <SimpleTooltip label={tooltipText}>
            <Button size={"icon"} onClick={onDownload}>
                <Download />
            </Button> 
        </SimpleTooltip>        
    );
}