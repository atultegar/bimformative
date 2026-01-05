"use client";

import React from "react";
import { VersionSheetContent } from "./version-sheet-content";
import { 
    Sheet, 
    SheetContent, 
    SheetDescription, 
    SheetHeader, 
    SheetTitle, 
    SheetTrigger 
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { History } from "lucide-react";

type Props = {
    title: string;
    scriptId: string;
    currentVersionNumber: number | string;
    scriptOwnerId: string;
    currentUserId: string;
    variant?: "badge" | "button";
};

export default function VersionSheet({
    title,
    scriptId,
    currentVersionNumber,
    scriptOwnerId,
    currentUserId,
    variant = "badge",
}: Props) {
    const canManageVersions = scriptOwnerId === currentUserId;
    return (
        <Sheet>
            <SheetTrigger asChild>
                { variant === "badge"
                ? (
                    <button>
                        <Badge variant="outline" className="cursor-pointer select-none">
                            V{currentVersionNumber}
                        </Badge>
                    </button>
                ) : (
                    <Button variant={"secondary"} size={"sm"} className="flex items-center gap-2 transition-all hover:opacity-80 hover:-translate-y-0.5 ease-in-out">
                        <History />
                        Version history
                    </Button>
                )}
                
            </SheetTrigger>

            <SheetContent className="w-[600px] sm:max-w-none overflow-y-auto pointer-events-auto">
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                        <History className="w-5 h-5" />
                        Version history
                    </SheetTitle>
                    <SheetDescription>{title}</SheetDescription>
                </SheetHeader>
                <VersionSheetContent title={title} scriptId={scriptId} currentUserId={currentUserId} canManageVersions={canManageVersions} />
            </SheetContent>
        </Sheet>
    )
}