"use client"

import { ColumnDef } from "@tanstack/react-table";
import revitImage from "@/public/bim-icons/revit.png";
import civil3dImage from "@/public/bim-icons/civil3d.png";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import youtubeColor from "@/public/tech-icons/youtube-color.svg";
import youtubeDark from "@/public/tech-icons/youtube-black.svg";
import DialogDetails from "@/app/components/DialogDetails";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";
import DownloadButton from "@/app/components/DownloadButton";
import LikeButton from "@/app/components/LikeButton";
import { comment } from "@/app/lib/interface";



export type DynamoScript = {
    _id: string
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
    author: string
    authorPicture: string
    downloads: number
    likes: string[]
    dynamoversion: string
    tags: string[]
    comments: comment[]
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
        accessorKey: "description",
        header: () => <div className="text-center">Description</div>,
        cell: ({row}) => {
            const description = row.getValue<string>("description");

            return (
                <div className="flex items-start line-clamp-1 overflow-clip max-h-[40px]">
                    {description}
                </div>
            );
        },
    },
    {
        accessorKey: "author",
        header: ({column}) => {
            return (
                <Button variant={"ghost"} onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Author
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({row}) => {
            const script = row.original;
            const author = script.author;
            const authorPic = script.authorPicture;

            return (
                <div className="flex items-center justify-center line-clamp-1">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Avatar className="w-8 h-8">
                                    <AvatarImage src={authorPic}/>
                                    <AvatarFallback>{String(author).slice(0,2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{String(author)}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>                    
                </div>
            );
        },
    },
    // {
    //     accessorKey: "externalpackages",
    //     header: () => <div className="text-center">External Packages</div>,
    //     cell: ({row}) => {
    //         const extPacks = row.getValue<string[] | null>("externalpackages") || [];

    //         return (
    //             <div className="flex items-center justify-center">
    //                 {extPacks.length > 0 ? (
    //                     <CheckmarkCircleIcon className="h-8 w-8 text-green-500" />
    //                 ): (
    //                     <span className="text-gray-500"></span>
    //                 )}
    //             </div>
    //         );
    //     },
    // },
    {
        accessorKey: "youtubelink",
        header: () => <div className="text-center">Demo</div>,
        cell: ({row}) => {
            const youtubelink = row.getValue<string>("youtubelink");

            return (
                <div className="flex items-center justify-center">
                    <Link href={!youtubelink ? "/" : youtubelink}
                        rel="noopener noreferrer"
                        target="_blank">
                            <Image src = {!youtubelink ? youtubeDark : youtubeColor}
                            alt = "Demo"
                            className={!youtubelink ? "dark:invert w-6 h-6 opacity-50 cursor-not-allowed" : "w-6 h-6 hover:-translate-y-0.5 ease-in-out"} />
                    </Link>                    
                </div>
            );
        },
    },
    {
        accessorKey: "downloads",
        header: ({column}) => {
                return (
                    <Button variant={"ghost"} onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                        Download
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
        cell: ({row}) => {     

            return (
                <div className="flex items-center justify-center">
                    <DownloadButton script={row.original} />
                </div>
            );
        },
    },
    {
        accessorKey: "likes",
        header: ({column}) => {
                return (
                    <Button variant={"ghost"} onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                        Likes
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
        cell: ({row}) => {   

            return (
                <div className="flex items-center justify-center">                    
                    <LikeButton script={row.original} />
                </div>
            );
        },
    },
    // {
    //     id: "actions",
    //     cell: ({ row }) => {
    //         const script = row.original
    //         const router = useRouter();
            
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
    //                         <DropdownMenuItem onClick={() => navigator.clipboard.writeText(script.fileUrl+"?dl")}>Copy link</DropdownMenuItem>
    //                         <DropdownMenuItem onClick={() => handleScriptDownload(script.fileUrl+"?dl", script._id, router.push, () => router.refresh())}>Download</DropdownMenuItem>
    //                     </DropdownMenuContent>
    //                 </DropdownMenu>
    //                 <DialogDetails script={script} />
    //             </Dialog>                
    //         );
    //     }
    // },
]