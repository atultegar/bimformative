"use client";

import { toast } from "sonner";
import { 
    deleteScriptById, 
    fetchScriptDownloadUrl, 
    getFileDownloadUrl, 
    updateDownloadCount, 
    updateLikeCount} from "./serverActions";
import { useRouter } from "next/navigation";

const DEV_KEY = process.env.DEV_MODE_MASTER_KEY as string;

export async function handleDownload(fileUrl: string) {
    if (!fileUrl) {
        console.error("No file URL provided");
        return;
    }

    try {
            const result = await getFileDownloadUrl(fileUrl);
            // Perform client-side download
            const link = document.createElement("a");
            
            if (result.fileUrl) {
                link.href = result.fileUrl;
            } else {
                console.error("File URL is undefined");
                return;
            }

            link.setAttribute("download", "downloadFile");
            link.setAttribute("target", "_blank");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);


    } catch (error) {
        console.error("Error while downloading file:", error)
    }
}

export async function handleScriptDownload(scriptId: string) {
    try {
        // Fetch authenticated download URL
        const downloadUrl = await fetchScriptDownloadUrl(scriptId);
        if(!downloadUrl) {
            toast.warning("No download URL available");
            return;
        }

        const downloadCount = await updateDownloadCount(scriptId);

        // Trigger the actial download
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.setAttribute("download", "scriptFile");
        link.setAttribute("target", "_blank");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        return {downloads: downloadCount}

    } catch (error) {
        console.error("Download failed:", error);
    }  
}

export async function handleScriptFileDownload(userId: string, slug: string) {
    try {
        const res = await fetch(`/api/v1/scripts/${slug}/download`, {
            method: "GET",
            headers: { "x-dev-key": DEV_KEY },
        })

        const blob = await res.blob();

        // Extract filename
        const disposition = res.headers.get("Content-Disposition");
        let filename = "script.dyn";

        if (disposition) {
            const match = disposition.match(/filename="?([^"]+)"?/);
            if (match?.[1]) filename = match[1];
        }

        const url = URL.createObjectURL(blob);

        if(!url || url === "") {
            toast.info("No download URL available");
        }

        // Trigger download
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.target = "_blank";
        a.click();

        URL.revokeObjectURL(url);
    } catch (error: any) {
        toast.error(error ?? "Download failed:");
    }
}

export async function handleScriptVersionDownload(title: string, versionId: string, userId: string) {
    const router = useRouter();
    if (!userId) {
            router.push(`/sign-in?redirect_url=/resources/dynamo-scripts`);
            return;
        };

    try {
        const res = await fetch(`/api/v1/script-versions/${versionId}/download`, {
            method: "GET",
            headers: { "x-dev-key": DEV_KEY}
        });

        if (!res.ok) throw new Error("Download failed");
                
        const blob = await res.blob();

        // Extract filename
        const disposition = res.headers.get("Content-Disposition");
        let filename = "script_v1.dyn";

        if (disposition) {
            const match = disposition.match(/filename="(.+)"/);
            if (match?.[1]) filename = title.replace(/\s+/g, "_") + "_" + match[1];
        }

        const url = URL.createObjectURL(blob);
        
        // Trigger download
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();

        URL.revokeObjectURL(url);
        
    } catch (error: any) {
        console.error("Download failed:", error);
        toast.error(error ?? "Download failed:");
    }
}

export async function handleScriptLike(scriptId: string) {
    try {
        await updateLikeCount(scriptId);
    } catch (error) {
        console.error("Some error occured", error);
    }
}

export async function deleteScript(scriptId: string){
    try {
        await deleteScriptById(scriptId);
    } catch (error) {
        console.error("Unable to delete");
    }
}