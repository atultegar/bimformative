import React, { useState } from "react";
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import youtubeColor from "@/public/tech-icons/youtube-color.svg";
import youtubeDark from "@/public/tech-icons/youtube-black.svg";
import dynamoImage from "@/public/dynamo.png";
import { handleScriptDownload } from "@/app/actions/clientActions";
import SVGCanvasD3 from "./svg/SvgCanvasD3";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckmarkCircleIcon, CloseCircleIcon } from "@sanity/icons";
import { Badge } from "@/components/ui/badge";
import { comment } from "../lib/interface";
import CommentForm from "./CommentForm";
import revitImage from "@/public/bim-icons/revit.png";
import civil3dImage from "@/public/bim-icons/civil3d.png";
import LikeButton from "./LikeButton";
import DownloadButton from "./DownloadButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    const [tab, setTab] = useState("details");
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

    const scriptTypeImg = imageMapping[script.scripttype.toLowerCase().replace(/\s/g, "")] || null;

    return (
        <DialogContent className="sm:max-w-[1250px]">            
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
            <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid grid-cols-3">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="comments">Comments</TabsTrigger>
                    <TabsTrigger value="viewer">Viewer</TabsTrigger>
                </TabsList>
                <ScrollArea className="h-[650px]">
                
                    {/* Details Tab */}
                    <TabsContent value="details" className="mt-5 flex flex-col">
                        <div className="grid grid-cols-5 items-center justify-items-start gap-4 mb-5 h-10">
                            <strong className="w-[250px] ml-2 text-muted-foreground">Tags:</strong>
                            <div className="col-span-4">
                                {script.tags && script.tags.length > 0 ? (
                                    <ul className="ml-2 space-x-2 list-disc list-inside">
                                        {script.tags.map((tag, index) => (
                                            <Badge key={index}>{tag}</Badge>
                                        ))}
                                    </ul>
                                ) : (
                                    <h3 className="text-gray-500"></h3>
                                )}
                            </div>                                                    
                        </div>
                        <div className="grid grid-cols-5 items-center justify-items-start gap-4 mb-5 h-10">
                            <strong className="w-[250px] ml-2 text-muted-foreground">Script Type:</strong>
                            <div className="col-span-4">
                                {scriptTypeImg ? (
                                    <div className="flex flex-row items-center gap-1 font-light">
                                        <Image src={scriptTypeImg.src} alt={scriptTypeImg.alt} className="w-10 h-10" />
                                        <p>{script.scripttype}</p>
                                    </div>
                                ) : (
                                    <p>{script.scripttype}</p>
                                )}
                            </div>                            
                        </div>
                        
                        <div className="grid grid-cols-5 items-center justify-items-start gap-5 mb-5 font-light h-10">
                            <strong className="w-[250px] ml-2 font-bold text-muted-foreground">Author:</strong>
                            <div className="col-span-4 ml-2 flex flex-row items-center gap-2">
                            <Avatar className="w-6 h-6">
                                <AvatarImage src={script.authorPicture}/>
                                <AvatarFallback>{String(script.author).slice(0,2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                                {script.author}
                            </div>                    
                        </div>
                        <div className="grid grid-cols-5 items-start justify-items-start gap-5 font-light mb-5">
                            <strong className="w-[250px] ml-2 font-bold text-muted-foreground">Description:</strong>
                            <div className="col-span-4 ml-2 mr-2">
                                {script.description}
                            </div>
                            
                        </div>
                        <div className="grid grid-cols-5 items-center justify-items-start gap-5 mb-5 font-light h-10">
                            <strong className="w-[250px] ml-2 font-bold text-muted-foreground">Dynamo Version:</strong>
                            <div className="col-span-4 ml-2">
                                {script.dynamoversion}
                            </div>
                        </div>
                        <div className="grid grid-cols-5 items-center justify-items-start gap-5 mb-5 h-10">
                            <strong className="w-[250px] ml-2 text-muted-foreground">Dynamo Player Ready:</strong>
                            <div className="col-span-4 ml-2">
                                {script.dynamoplayer ? (
                                    <CheckmarkCircleIcon className="w-6 h-6 text-green-500"/>
                                ) : (
                                    <CloseCircleIcon className="w-6 h-6 text-red-500" />
                                )}
                            </div>
                            
                        </div>
                        <div className="grid grid-cols-5 items-center justify-items-start gap-5 mb-5 h-10">
                            <strong className="w-[250px] ml-2 text-muted-foreground">Python Scripts:</strong>
                            <div className="col-span-4 ml-2">
                                {script.pythonscripts ? (
                                    <CheckmarkCircleIcon className="w-6 h-6 text-green-500"/>
                                ) : (
                                    <CloseCircleIcon className="w-6 h-6 text-red-500" />
                                )}
                            </div>                            
                        </div>               
                        <div className="grid grid-cols-5 items-start justify-items-start gap-5 mb-5">
                            <strong className="w-[250px] ml-2 text-muted-foreground">External Packages:</strong>
                            <div className="col-span-4 ml-2">
                                {script.externalpackages && script.externalpackages.length > 0 ? (
                                    <ul className="mt-1 space-y-1 list-disc list-inside font-light">
                                        {script.externalpackages.map((pkg, index) => (
                                            <li key={index}>{pkg}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <h3 className="text-gray-500">No external packages listed.</h3>
                                )}
                            </div>
                                                    
                        </div>
                    </TabsContent>

                    {/* Comments Tab */}
                    <TabsContent value="comments" className="mt-5">
                        <CommentForm script={script} />
                    </TabsContent>

                    {/* Viewer Tab */}
                    <TabsContent value="viewer" className="mt-5">
                        <div className="w-[1200px]">
                            {nodes.length > 0 && connectors.length > 0 ? (
                                <SVGCanvasD3 nodes={nodes} connectors={connectors} canvasWidth={1200} canvasHeight={600} />
                            ): (
                                <p className="text-gray-500">No code snippet available.</p>
                            )}                    
                        </div>
                    </TabsContent>
                </ScrollArea>
            </Tabs>     
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
                <Button asChild variant={"outline"}>
                    <Link href={`/resources/dynamo-scripts/${script._id}`}>
                        More Details
                    </Link>
                </Button>
                <Button type="submit" onClick={
                    () => handleScriptDownload(script._id)} variant={"default"}>
                    Download
                </Button>
            </DialogFooter>
        </DialogContent>
    );
};

export default DialogDetails;