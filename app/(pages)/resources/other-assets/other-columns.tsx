"use client"

import { ColumnDef } from "@tanstack/react-table";
import revitImage from "@/public/bim-icons/revit.png";
import civil3dImage from "@/public/bim-icons/civil3d.png";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Download } from "lucide-react";
import { handleDownload } from "@/app/actions/clientActions";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
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
        accessorKey: "downloadlink",
        header: () => <div className="text-center">Download</div>,
        cell: ({row}) => {
            const script = row.original;        

            return (
                <div className="flex items-center justify-center">
                    {/* <Link href={`/api/download?scriptid=${scriptId}`} rel="noopener noreferrer" target="_blank" className="block transition-opacity text-inherit text-center hover:opacity-80 opacity-50 hover:-translate-y-0.5 ease-in-out">
                        <Download color="green" />
                        {script.downloads}
                    </Link> */}
                    <Button variant={"ghost"} size="default" onClick={() => handleDownload(script.fileUrl+"?dl")} className="text-md transition-opacity hover:opacity-80 hover:-translate-y-0.5 ease-in-out">
                        <Download color="green" />
                    </Button>
                </div>
            );
        },
    },
    
    // {
    //     id: "actions",
    //     cell: ({ row }) => {
    //         const otherasset = row.original
    //         const downloadUrl = otherasset.fileUrl+"?dl";
            
    //         return (
    //             <Dialog>
    //                 <DropdownMenu>
    //                     <DropdownMenuTrigger asChild>
    //                         <Button variant="ghost" className="h-8 w-8 p-0">
    //                             <span className="sr-only">Open menu</span>
    //                             <MoreHorizontal className="h-4 w-4" />
    //                         </Button>
    //                     </DropdownMenuTrigger>
    //                     <DropdownMenuContent align="end">
    //                         {/* <DropdownMenuLabel>Actions</DropdownMenuLabel> */}
    //                         <DialogTrigger asChild>
    //                             <DropdownMenuItem>Details</DropdownMenuItem>
    //                         </DialogTrigger>
    //                         <DropdownMenuItem onClick={() => navigator.clipboard.writeText(downloadUrl)}>Copy link</DropdownMenuItem>
    //                         <DropdownMenuItem onClick={() => handleDownload(downloadUrl, router.push, () => router.refresh())}>Download</DropdownMenuItem>
    //                     </DropdownMenuContent>
    //                 </DropdownMenu>
    //                 <DialogAssetDetails otherasset={otherasset} />
    //             </Dialog>                
    //         );
    //     }
    // },
]