import React from "react";
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import youtubeColor from "@/public/tech-icons/youtube-color.svg";
import youtubeDark from "@/public/tech-icons/youtube-black.svg";
import dynamoImage from "@/public/dynamo.png";
import { handleDownload } from "@/app/api/handleDownload";

interface DialogDetailsProps {
    script: {
        title: string;
        description: string;
        externalpackages: string[];
        youtubelink?: string;
        fileUrl: string;
    };
}

const DialogDetails: React.FC<DialogDetailsProps> = ({ script }) => {
    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle className="flex items-center">
                    <Image src={dynamoImage} alt="Dynamo" className="w-8 h-8" />
                    {script.title}
                </DialogTitle>
                <DialogDescription className="items-start">
                    {script.description}
                    <div className="mt-1">
                        <strong>External Packages:</strong>
                        {script.externalpackages && script.externalpackages.length > 0 ? (
                            <ul className="mt-1 space-y-1 list-disc list-inside">
                                {script.externalpackages.map((pkg, index) => (
                                    <li key={index}>{pkg}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">No external packages listed.</p>
                        )}                                             
                    </div>                    
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="secondary">
                        Cancel
                    </Button>
                </DialogClose>
                <Button 
                    variant={script.youtubelink? "outline": "ghost"}
                    disabled={!script.youtubelink}
                    className={!script.youtubelink ? "opacity-50 cursor-not-allowed" : ""}>
                    <Image 
                        src={!script.youtubelink ? youtubeDark : youtubeColor} 
                        alt="YouTube" 
                        className={!script.youtubelink ? "dark:invert w-8 h-8" : "w-8 h-8"} />
                        View Demo
                    </Button>
                <Button type="submit" onClick={() => handleDownload(script.fileUrl)}>Download</Button>
            </DialogFooter>
        </DialogContent>
    );
};

export default DialogDetails;