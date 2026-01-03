"use client"

import { ColumnDef } from "@tanstack/react-table";
import revitImage from "@/public/bim-icons/revit.png";
import civil3dImage from "@/public/bim-icons/civil3d.png";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, History } from "lucide-react";
import youtubeColor from "@/public/tech-icons/youtube-color.svg";
import youtubeDark from "@/public/tech-icons/youtube-black.svg";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import DownloadButton from "@/app/components/DownloadButton";
import LikeButton from "@/app/components/LikeButton";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { VersionSheetContent } from "../../components/scripts/version-sheet-content";
import { ScriptMinimal } from "@/lib/types/script";
import ClientVersionSheet from "@/app/components/scripts/ClientVersionSheet";

export type DynamoScript = {
    id: string;
    slug: string;
    title: string;
    script_type: string;
    description: string;
    current_version_number: number;
    dynamo_version: string;
    owner_id: string;
    owner_first_name: string;
    owner_last_name: string;
    owner_avatar_url: string;
    downloads_count: number;
    likes_count: number;
    demo_link: string | null;
    dyn_file_url: string | null;
};

export const columns = (currentUserId: string): ColumnDef<ScriptMinimal>[] => [
    // TITLE
    {
        accessorKey: "title",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Title <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({row}) => {
            const script = row.original
            return (
                <Button variant={"ghost"} asChild>
                    <Link href={`/resources/dynamo-scripts/${script.slug}`}>{script.title}</Link>
                </Button>
            )
        }
    },
    
    // SCRIPT TYPE
    {
        accessorKey: "script_type",
        header: () => <div className="text-left">Type</div>,
        cell: ({row}) => {
            const scriptType = row.getValue<string>("script_type")?.toLowerCase();

            // Map tags to corrsponding images
            const iconMap: Record<string, any> = {
                revit: revitImage,
                civil3d: civil3dImage,
            };

            const img = iconMap[scriptType];
            
            return (
                <div className="flex space-x-2 items-center">
                    {img && <Image src={img} alt={scriptType} width={40} height={40} />}
                </div>
            );
        },
    },

    // DESCRIPTION
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

    // OWNER
    {
        accessorKey: "owner_first_name",
        header: ({column}) => (
            <Button 
                variant={"ghost"} 
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Author <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({row}) => {
            const author = row.original.owner_first_name + " " + row.original.owner_last_name;
            const avatar = row.original.owner_avatar_url;

            return (
                <div className="flex items-center justify-center line-clamp-1">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Avatar className="w-8 h-8">
                                    <AvatarImage src={avatar}/>
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

    // VERSION
    {
        accessorKey: "current_version_number",
        header: () => <div className="text-center">Version</div>,
        cell: ({row}) => {
            return (
                <div className="flex items-center justify-center">                    
                    <ClientVersionSheet 
                        title={row.original.title} 
                        currentVersionNumber={row.original.current_version_number} 
                        scriptOwnerId={row.original.owner_id} 
                        scriptId={row.original.id} 
                        currentUserId={currentUserId} 
                    />       
                </div>
            );
        },
    },
    
    // DEMO LINK
    {
        accessorKey: "demo_link",
        header: () => <div className="text-center">Demo</div>,
        cell: ({row}) => {
            const link = row.original.demo_link;

            const icon = link ? youtubeColor : youtubeDark;

            return (
                <div className="flex items-center justify-center">
                    <Link 
                        href={link || "#"}
                        rel="noopener noreferrer"
                        target="_blank"
                        className={link ? "cursor-pointer" : "opacity-40 cursor-not-allowed"}
                    >
                        <Image src = {icon} alt = "Demo" className="w-6 h-6" />
                    </Link>                    
                </div>
            );
        },
    },

    // DOWNLOADS
    {
        accessorKey: "downloads_count",
        header: ({column}) => (
            <Button 
                variant={"ghost"} 
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Download 
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({row}) => (
            <div className="flex items-center justify-center">
                <DownloadButton userId={currentUserId} slug={row.original.slug} downloadsCount={row.original.downloads_count} />
            </div>
        ),
    },

    // LIKES
    {
        accessorKey: "likes_count",
        header: ({column}) => (
            <Button 
                variant={"ghost"} 
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Likes <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({row}) => (
            <div className="flex justify-center">                    
                <LikeButton scriptId={row.original.id} likesCount={row.original.likes_count} likedByUser={row.original.liked_by_user} userId={currentUserId} />
            </div>
        ),
    },
];