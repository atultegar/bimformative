"use client";

import { deleteScriptById, fetchScriptDownloadUrl, getFileDownloadUrl, updateDownloadCount, updateLikeCount } from "./serverActions";

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
            alert("No download URL available");
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
