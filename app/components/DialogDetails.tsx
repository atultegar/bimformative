import React from "react";
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import youtubeColor from "@/public/tech-icons/youtube-color.svg";
import youtubeDark from "@/public/tech-icons/youtube-black.svg";
import dynamoImage from "@/public/dynamo.png";
import { handleDownload, handleScriptDownload } from "@/app/actions/clientActions";
import { urlFor } from "../lib/sanity";
import SVGCanvasD3 from "./svg/SvgCanvasD3";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckmarkCircleIcon, CloseCircleIcon } from "@sanity/icons";
import { Badge } from "@/components/ui/badge";
import { Download, ThumbsUp } from "lucide-react";
import { comment } from "../lib/interface";
import CommentForm from "./CommentForm";
import revitImage from "@/public/bim-icons/revit.png";
import civil3dImage from "@/public/bim-icons/civil3d.png";
import LikeButton from "./LikeButton";
import DownloadButton from "./DownloadButton";

const imageMapping: { [key: string]: {src: any, alt:string}} = {
    revit: {src: revitImage, alt: "Revit"},
    civil3d: {src: civil3dImage, alt: "Civil 3D"}
};

interface DialogDetailsProps {
    script: {        
        _id: string;
        title: string;
        description: string;
        externalpackages: string[];
        youtubelink?: string;
        fileUrl: string;
        image: string;
        code: string;
        dynamoversion: string;
        author: string;
        authorPicture: string;
        dynamoplayer: boolean;
        pythonscripts: boolean;
        tags: string[];
        downloads: number;
        likes: string[];
        comments: comment[];
        scripttype: string;        
    };
}

const DialogDetails: React.FC<DialogDetailsProps> = ({ script }) => {
    let nodes: any[] = [];
    let connectors: any[] = [];
    try {        
        if(script?.code){
            const parsedCode = JSON.parse(script?.code);

            nodes = parsedCode.Nodes ?? [];
            connectors = parsedCode.Connectors ?? [];
        }        
        
    } catch (error) {
        console.error(error);
    }

    const cleanedScriptType = script.scripttype.toLowerCase().replace(/\s/g, "");
    const scriptTypeImg = imageMapping[cleanedScriptType] || null;

    return (
        <DialogContent className="sm:max-w-[1280px]">            
            <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Image src={dynamoImage} alt="Dynamo" className="w-10 h-10" />
                        <h3 className="text-2xl">{script.title}</h3>
                    </div>                    
                    <div className="flex items-center gap-5 mr-7">
                        <LikeButton script={script} />
                        <DownloadButton script={script} />                        
                    </div>                                        
                </DialogTitle>
                <DialogDescription className="items-start border-b">
                                                         
                </DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-[700px]">
            <div>
                <div className="ml-2 flex flex-row w-full items-center justify-items-start gap-4 mb-5">
                    <strong className="w-[250px]">Tags:</strong>
                    {script.tags && script.tags.length > 0 ? (
                        <ul className="mt-1 space-x-2 list-disc list-inside">
                            {script.tags.map((tag, index) => (
                                <Badge key={index}>{tag}</Badge>
                            ))}
                        </ul>
                    ) : (
                        <h3 className="text-gray-500"></h3>
                    )}                        
                </div>
                <div className="ml-2 flex flex-row w-full items-center justify-items-start gap-4 mb-5">
                    <strong className="w-[250px]">Script Type:</strong>
                    {scriptTypeImg ? (
                        <div className="flex flex-row items-center gap-1">
                            <Image src={scriptTypeImg.src} alt={scriptTypeImg.alt} className="w-8 h-8" />
                            <p>{script.scripttype}</p>
                        </div>
                    ) : (
                        <p>{script.scripttype}</p>
                    )}
                </div>
                
                <div className="ml-2 mt-2 flex flex-row w-full items-center justify-items-start gap-5 mb-5">
                    <strong className="w-[250px]">Author:</strong>
                    <div className="flex flex-row items-center gap-2">
                    <Avatar className="w-6 h-6">
                        <AvatarImage src={script.authorPicture}/>
                        <AvatarFallback>{String(script.author).slice(0,2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                        {script.author}
                    </div>                    
                </div>
                <div className="ml-2 mb-5 flex flex-col max-w-[1180px]">
                    <strong className="w-[250px]">Description:</strong>
                    {script.description}
                </div>
                <div className="ml-2 flex flex-row w-full items-center justify-items-start gap-5 mb-5">
                    <strong className="w-[250px]">Dynamo Version:</strong>
                    {script.dynamoversion}
                </div>
                <div className="ml-2 flex flex-row w-full items-center justify-items-start gap-5 mb-5">
                    <strong className="w-[250px]">Dynamo Player Ready:</strong>
                    {script.dynamoplayer ? (
                        <CheckmarkCircleIcon className="w-6 h-6 text-green-500"/>
                    ) : (
                        <CloseCircleIcon className="w-6 h-6 text-red-500" />
                    )}
                </div>
                <div className="ml-2 flex flex-row w-full items-center justify-items-start gap-5 mb-5">
                    <strong className="w-[250px]">Python Scripts:</strong>
                    {script.pythonscripts ? (
                        <CheckmarkCircleIcon className="w-6 h-6 text-green-500"/>
                    ) : (
                        <CloseCircleIcon className="w-6 h-6 text-red-500" />
                    )}
                </div>               
                <div className="ml-2 mb-5">
                    <strong className="w-[250px]">External Packages:</strong>
                    {script.externalpackages && script.externalpackages.length > 0 ? (
                        <ul className="mt-1 space-y-1 list-disc list-inside">
                            {script.externalpackages.map((pkg, index) => (
                                <li key={index}>{pkg}</li>
                            ))}
                        </ul>
                    ) : (
                        <h3 className="text-gray-500">No external packages listed.</h3>
                    )}                        
                </div>
                
                <div className="ml-2 mb-5">                    
                    <CommentForm script={script} />
                </div>
                <div className="w-[1200px]">
                    {nodes.length > 0 && connectors.length > 0 ? (
                        <SVGCanvasD3 nodes={nodes} connectors={connectors} canvasWidth={1200} canvasHeight={600} />
                    ): (
                        <p className="text-gray-500">No code snippet available.</p>
                    )}                    
                </div>
            </div>
            </ScrollArea>
            <Separator />
            <DialogFooter>                         
                <DialogClose asChild>
                    <Button type="button" variant="secondary">
                        Cancel
                    </Button>
                </DialogClose>
                <Button
                    asChild 
                    variant={script.youtubelink? "outline": "ghost"}
                    disabled={!script.youtubelink}
                    className={!script.youtubelink ? "opacity-50 cursor-not-allowed" : ""}>
                        <Link 
                            href={!script.youtubelink? "/": script.youtubelink}
                            rel="noopener noreferrer"
                            target="_blank">
                            <Image 
                            src={!script.youtubelink ? youtubeDark : youtubeColor} 
                            alt="YouTube" 
                            className={!script.youtubelink ? "dark:invert w-8 h-8" : "w-8 h-8"} />
                            View Demo
                        </Link>
                    </Button>
                <Button type="submit" onClick={
                    () => handleScriptDownload(script._id)}>
                        Download
                    </Button>
            </DialogFooter>
        </DialogContent>
    );
};

export default DialogDetails;