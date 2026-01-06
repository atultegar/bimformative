"use client"

import { ColumnDef } from "@tanstack/react-table";
import revitImage from "@/public/bim-icons/revit.png";
import civil3dImage from "@/public/bim-icons/civil3d.png";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import youtubeColor from "@/public/tech-icons/youtube-color.svg";
import youtubeDark from "@/public/tech-icons/youtube-black.svg";
import Link from "next/link";
import DownloadButton from "@/app/components/DownloadButton";
import LikeButton from "@/app/components/LikeButton";
import UserActionMenu from "../components/UserActionMenu";
import { Badge } from "@/components/ui/badge";
import { ScriptDashboard } from "@/lib/types/script";
import VersionSheet from "../components/scripts/VersionSheet";

export const usercolumns = (currentUserId: string | null): ColumnDef<ScriptDashboard>[] => [
    {
        accessorKey: "is_public",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
            )
        },
        cell: ({row}) => {
            const isPublic = row.getValue<boolean>("is_public");
            return (
                <Badge variant={"outline"} className={`${isPublic ? "text-primary" : "text-secondary-foreground"}`}>{isPublic ? "Public" : "Private"}</Badge>
            )
        }
    },

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
            return (
                <Button variant={"ghost"} asChild>
                    <Link href={`/resources/dynamo-scripts/${row.original.slug}`}>{row.original.title}</Link>
                </Button>
            )
        }
    },

    {
        accessorKey: "script_type",
        header: () => <div className="text-left">Type</div>,
        cell: ({row}) => {
            const scriptType = row.getValue<string>("script_type");

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
        accessorKey: "current_version_number",
        header: () => <div className="text-center">Version</div>,
        cell: ({row}) => {
            const version = row.getValue<number>("current_version_number");

            return (
                <div className="flex items-center justify-center">
                    <VersionSheet 
                        title={row.original.title} 
                        currentVersionNumber={version} 
                        scriptOwnerId={row.original.owner_id} 
                        scriptId={row.original.id} 
                        currentUserId={currentUserId} 
                    />
                </div>
            );
        },
    },

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
                    <DownloadButton userId={currentUserId} slug={row.original.slug} downloadsCount={row.original.downloads_count} />
                </div>
            );
        },
    },
    {
        accessorKey: "likes_count",
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
                    <LikeButton scriptId={row.original.id} likesCount={row.original.likes_count} likedByUser={row.original.liked_by_user} userId={currentUserId} />
                </div>
            );
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const script = row.original            
            return (
                <UserActionMenu script={script} />
            );
        }
    },
]