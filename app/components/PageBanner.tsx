"use client";

import React from "react";
import { cn } from "@/lib/utils";

import Image, { StaticImageData } from "next/image";
import VisualScriptingBackground from "./home/VisualScriptingBackground";

interface PageBannerProps {
    title: string;
    description: string;
    variant?: "default" | "dynamo" | "python" | "csharp"
}

export const PageBanner: React.FC<PageBannerProps> = ({
    title,
    description,
    variant = "default",
}) => {
    return (
        <div className="relative overflow-hidden border-b border-white/10 py-20">
            
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-500/20 dark:via-white/5 to-transparent" />

            {/* Glow based on page   */}
            <div
                className={cn(
                    "absolute inset-0 opacity-40 blur-3xl",
                    variant === "dynamo" && "bg-cyan-500/10",
                    variant === "python" && "bg-purple-500/10",
                    variant === "csharp" && "bg-emerald-500/10",
                    variant === "default" && "bg-blue-500/10",
                )}
            />

            {/* Optional subtle grid */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_70%)]" />

            {/* Content */}
            <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                <h1 className="max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                    {title}
                </h1>

                <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
                    {description}
                </p>
            </div>
            {/* <hr className="absolute bottom-0 w-full h-px bg-gray-300 dark:bg-gray-800" /> */}
        </div>             
    );
};