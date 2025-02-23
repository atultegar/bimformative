"use client";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import React from "react";
export default function ProgressBar({ statusValue, className } : {statusValue: number, className?: string}) {
    return (
        statusValue === 0 ? (
            <div className={`${className} flex justify-end mr-[50px]`}>
                <Badge variant="destructive" className="text-xs">Planned</Badge>
            </div>            
        ) : statusValue === 100 ? (
            <div className={`${className} flex justify-end mr-[50px]`}>
                <Badge variant="default" className="text-xs">Completed</Badge>
            </div>
        ) : (
            <div className={`${className} flex items-center justify-between`}>            
                <Progress className="bg-muted-foreground w-4/5" value={statusValue} />
                <span className="text-right w-1/5">{statusValue}%</span>
            </div>
        )
    );
}