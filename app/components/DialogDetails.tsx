import React from "react";
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import youtubeColor from "@/public/tech-icons/youtube-color.svg";
import youtubeDark from "@/public/tech-icons/youtube-black.svg";
import dynamoImage from "@/public/dynamo.png";
import { handleDownload } from "@/app/api/handleDownload";
import { urlFor } from "../lib/sanity";
import SVGCanvas from "./svg/SVGCanvas";
import SVGCanvasD3 from "./svg/SvgCanvasD3";

interface DialogDetailsProps {
    script: {
        title: string;
        description: string;
        externalpackages: string[];
        youtubelink?: string;
        fileUrl: string;
        image: string;
        code: string;
    };
}

const DialogDetails: React.FC<DialogDetailsProps> = ({ script }) => {
    let nodes = [];
    let connectors = [];
    try {
        const parsedCode = JSON.parse(script.code);
        nodes = parsedCode.Nodes || [];
        connectors = parsedCode.Connectors || [];
    } catch (error) {
        console.error(error);
    }
    return (
        <DialogContent className="sm:max-w-[1250px]">
            <DialogHeader>
                <DialogTitle className="flex items-center">
                    <Image src={dynamoImage} alt="Dynamo" className="w-8 h-8" />
                    {script.title}
                    
                </DialogTitle>
                <DialogDescription className="items-start">
                    <div>
                        {nodes.length > 0 && connectors.length > 0 ? (
                            <SVGCanvasD3 nodes={nodes} connectors={connectors} canvasWidth={1200} canvasHeight={675} />
                        ): (
                            <p className="text-gray-500">No code snippet available.</p>
                        )}
                        
                    </div>
                    {script.description}
                    <div className="mt-5">
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
                        <hr className="mt-5"/>
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