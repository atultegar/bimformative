"use client";

import React from "react";
import { VersionSheetContent } from "./version-sheet-content";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

type Props = {
    title: string;
    scriptId: string;
    currentVersionNumber: number | string;
    scriptOwnerId: string;
    currentUserId: string;
};

export default function ClientVersionSheet({
    title,
    scriptId,
    currentVersionNumber,
    scriptOwnerId,
    currentUserId,
}: Props) {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <button>
                    <Badge variant="outline" className="curson-pointer">
                        V{currentVersionNumber}
                    </Badge>
                </button>
            </SheetTrigger>

            <SheetContent className="w-[600px] sm:max-w-none overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>Version history</SheetTitle>
                    <SheetDescription>{title}</SheetDescription>
                </SheetHeader>
                <VersionSheetContent title={title} scriptOwnerId={scriptOwnerId} scriptId={scriptId} currentUserId={currentUserId} />
            </SheetContent>
        </Sheet>
    )
}