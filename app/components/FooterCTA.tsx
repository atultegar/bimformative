"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function FooterCTA() {
    return (
        <section className="relative max-w-7xl mx-auto px-6 py-24 lg:px-8">
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 px-6 py-16 text-center backdrop-blur-sm sm:px-10">

                {/* subtle glow */}
                <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-500/10" />

                {/* Heading */}
                <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                    Start building structured automation workflows
                </h2>

                {/* Subtext */}
                <p className="mx-auto mt-4 max-w-2xl text-gray-400">
                    Discover reusable Dynamo scripts, publish your own workflows, and bring
                    version control into your BIM automation process
                </p>

                {/* CTA buttons */}
                <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Button 
                        asChild
                        size="lg"
                        className="min-w-[180px]"
                    >
                        <Link href="/resources/dynamo-scripts">Explore Scripts</Link>                
                    </Button>

                    <Button 
                        asChild
                        size="lg"
                        variant="outline" 
                        className="min-w-[180px]"
                    >
                        <Link href="/dashboard">Publish Script</Link>             
                    </Button>

                    <Button
                        asChild
                        size="lg"
                        variant="outline"
                        className="min-w-[180px] border-cyan-400/40 text-cyan-400 hover:bg-cyan-400/10"
                    >
                        <Link href="/download-extension">Download Extension</Link>
                    </Button>
                </div>

                {/* Optional micro text */}
                <p className="mt-6 text-xs text-gray-500">
                    Built for Dynamo and visual scripting workflows
                </p>
            </div>                        
        </section>
    )
}