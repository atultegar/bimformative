import React from "react";
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import youtubeColor from "@/public/tech-icons/youtube-color.svg";
import youtubeDark from "@/public/tech-icons/youtube-black.svg";
import dynamoImage from "@/public/dynamo.png";
import { handleDownload } from "@/app/api/handleDownload";
import { urlFor } from "../lib/sanity";


interface DialogDetailsProps {
    otherasset: {
        title: string;
        description: string;
        image: string;
        assettype: string;       
        youtubelink?: string;
        fileUrl: string;        
    };
}


const DialogAssetDetails: React.FC<DialogDetailsProps> = ({ otherasset }) => {
    const assetTypeTitles:{ [key: string]: string;} = {
        subassembly: 'Subassembly',
        revitfamily: 'Revit Family',
        excelsheet: 'Excel Sheet',
        lisp: 'Lisp',
    };
    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle className="flex items-center">                    
                    {otherasset.title}                    
                </DialogTitle>
                <DialogDescription className="items-start">
                    <div className="mt-2 mb-5">
                        <Image src={otherasset.image} alt="asset image" width={500} height={500} className="w-[500px] bg-white border border-gray-500 rounded-sm" />
                    </div>
                    {otherasset.description}
                    <div className="mt-5">
                        <strong>Asset Type: {assetTypeTitles[otherasset.assettype] || 'Unknown'}</strong>                                                                   
                    </div>
                    <hr className="mt-5 w-full bg-gray-300 border dark:bg-gray-800" />                    
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                
                <DialogClose asChild>
                    <Button type="button" variant="secondary">
                        Cancel
                    </Button>
                </DialogClose>
                <Button 
                    variant={otherasset.youtubelink? "outline": "ghost"}
                    disabled={!otherasset.youtubelink}
                    className={!otherasset.youtubelink ? "opacity-50 cursor-not-allowed" : ""}>
                    <Image 
                        src={!otherasset.youtubelink ? youtubeDark : youtubeColor} 
                        alt="YouTube" 
                        className={!otherasset.youtubelink ? "dark:invert w-8 h-8" : "w-8 h-8"} />
                        View Demo
                    </Button>
                <Button type="submit" onClick={() => handleDownload(otherasset.fileUrl)}>Download</Button>
            </DialogFooter>
        </DialogContent>
    );
};

export default DialogAssetDetails;