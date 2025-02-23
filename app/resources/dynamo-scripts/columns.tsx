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

export type DynamoScript = {
    title: string
    scripttype: string
    dynamoplayer: boolean
    externalpackages: string[]
    pythonscripts: boolean
    fileUrl: string
    description: string
    youtubelink: string
    image: string
    code: string
}

export const columns: ColumnDef<DynamoScript>[] = [
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
            const script = row.original
            return (
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="ghost">{script.title}</Button>
                    </DialogTrigger>
                    <DialogDetails script={script} />
                </Dialog>
            )
        }
    },
    {
        accessorKey: "scripttype",
        header: () => <div className="text-left">Type</div>,
        cell: ({row}) => {
            const scriptType = row.getValue<string>("scripttype");

            // Map tags to corrsponding images
            const imageMapping: { [key: string]: { src: any; alt: string}} = {
                revit: {src: revitImage, alt: "Revit Logo"},
                civil3d: { src: civil3dImage, alt: "Civil 3D Logo" },
            };

            // Filter valid images based on the scripttypes array
            const cleanedScriptType = scriptType.trim().toLowerCase();
            const image = imageMapping[cleanedScriptType] || null;

            return (
                <div className="flex space-x-2 items-center">
                    {image && <Image src={image.src} alt={image.alt} width={40} height={40} />}
                </div>
            );
        },
    },
    {
        accessorKey: "dynamoplayer",
        header: () => <div className="text-center">Dynamo Player</div>,
        cell: ({row}) => {
            const isPlayer = row.getValue<boolean>("dynamoplayer");

            return (
                <div className="flex items-center justify-center">
                    {isPlayer ? (
                        <CheckmarkCircleIcon className="h-8 w-8 text-green-500" />
                    ): (
                        <span className="text-gray-500"></span>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: "externalpackages",
        header: () => <div className="text-center">External Packages</div>,
        cell: ({row}) => {
            const extPacks = row.getValue<string[] | null>("externalpackages") || [];

            return (
                <div className="flex items-center justify-center">
                    {extPacks.length > 0 ? (
                        <CheckmarkCircleIcon className="h-8 w-8 text-green-500" />
                    ): (
                        <span className="text-gray-500"></span>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: "pythonscripts",
        header: () => <div className="text-center">Python Scripts</div>,
        cell: ({row}) => {
            const isPython = row.getValue<boolean>("pythonscripts");

            return (
                <div className="flex items-center justify-center">
                    {isPython ? (
                        <CheckmarkCircleIcon className="h-8 w-8 text-green-500" />
                    ): (
                        <span className="text-gray-500"></span>
                    )}
                </div>
            );
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const script = row.original
            const downloadUrl = script.fileUrl+"?dl";
            
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
                    <DialogDetails script={script} />
                </Dialog>                
            );
        }
    },
]