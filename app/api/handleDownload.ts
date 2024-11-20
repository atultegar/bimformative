export const handleDownload = (fileUrl: string): void => {
    if (!fileUrl) {
        console.error("no file URL provided");
        return;
    }

    try {        
        const link = document.createElement("a");
        link.href = fileUrl;
        link.setAttribute("download", "downloadFile");
        link.setAttribute("target", "_blank");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error("Error while downloading file:", error);
    }    
};