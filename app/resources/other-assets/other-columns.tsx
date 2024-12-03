"use client"

import { CheckmarkCircleIcon } from "@sanity/icons";
import { ColumnDef } from "@tanstack/react-table";
import revitImage from "@/public/bim-icons/revit.png";
import civil3dImage from "@/public/bim-icons/civil3d.png";
import dynamoImage from "@/public/dynamo.png";
import Image from "next/image";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { handleDownload } from "@/app/api/handleDownload";
import { Dialog, DialogHeader, DialogTitle, DialogTrigger, DialogContent, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import youtubeColor from "@/public/tech-icons/youtube-color.svg";
import youtubeDark from "@/public/tech-icons/youtube-black.svg";
import DialogDetails from "@/app/components/DialogDetails";
import DialogAssetDetails from "@/app/components/DialogAssetDetails";

export type OtherAssets = {
    title: string
    assettype: string    
    fileUrl: string
    description: string
    youtubelink: string
    image: string  
}

export const othercolumns: ColumnDef<OtherAssets>[] = [
    {
        accessorKey: "title",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                        Title
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
            )
        },
        cell: ({row}) => {
            const otherasset = row.original
            return (
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="ghost">{otherasset.title}</Button>
                    </DialogTrigger>
                    <DialogAssetDetails otherasset={otherasset} />
                </Dialog>
            )
        }
    },
    {
        accessorKey: "assettype",
        header: () => <div className="text-left">Type</div>,
        cell: ({row}) => {
            const assetType = row.getValue<string>("assettype");

            // Map tags to corrsponding images
            const imageMapping: { [key: string]: { src: any; alt: string; value: string;}} = {
                revitfamily: {src: revitImage, alt: "Revit Logo", value: "Revit Family"},
                subassembly: { src: civil3dImage, alt: "Civil 3D Logo",value: "Subassembly" },
                excelsheet: { src: civil3dImage, alt: "Civil 3D Logo", value: "Excel Sheet" },
                lisp: { src: civil3dImage, alt: "Civil 3D Logo", value: "Lisp" },
            };

            // Filter valid images based on the scripttypes array
            const cleanedScriptType = assetType.trim().toLowerCase();
            const image = imageMapping[cleanedScriptType] || null;

            return (
                <div className="flex space-x-2 items-center">
                    {image && <Image src={image.src} alt={image.alt} width={40} height={40} />} <span>{image.value}</span>
                </div>
            );
        },
    },
    
    {
        id: "actions",
        cell: ({ row }) => {
            const otherasset = row.original
            const downloadUrl = otherasset.fileUrl+"?dl";
            
            return (
                <Dialog>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {/* <DropdownMenuLabel>Actions</DropdownMenuLabel> */}
                            <DialogTrigger asChild>
                                <DropdownMenuItem>Details</DropdownMenuItem>
                            </DialogTrigger>
                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(downloadUrl)}>Copy link</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDownload(downloadUrl)}>Download</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <DialogAssetDetails otherasset={otherasset} />
                </Dialog>                
            );
        }
    },
]