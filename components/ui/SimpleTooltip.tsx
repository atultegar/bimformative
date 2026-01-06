"use client";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type SimpleTooltipProps = {
    label: string;
    children: React.ReactNode;
    side?: "top" | "right" | "bottom" | "left";
};

export default function SimpleTooltip({
    label,
    children,
    side = "top",
}: SimpleTooltipProps) {
    return (
        <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
                {children}
            </TooltipTrigger>
            <TooltipContent side={side}>
                <span className="text-xs">{label}</span>
            </TooltipContent>
        </Tooltip>
    );
}