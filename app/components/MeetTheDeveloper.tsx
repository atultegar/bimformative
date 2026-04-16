"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FaGithub, FaLinkedin } from "react-icons/fa6";
import { Layers3 } from "lucide-react";
import profilePic from "@/public/profile-pic.png";
import Image from "next/image";

export default function MeetTheDeveloper() {
    return (
        <section className="relative mt-8 overflow-hidden rounded-2xl border border-white/10 bg-gray-100/80 p-8 dark:bg-white/5 lg:p-10">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5" />

            <div className="realtive grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
                {/* Text */}
                <div>
                    <div className="inline-flex items-center rounded-full border border-cyan-500/20 bg-cyan-500/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-cyan-500">
                        Platform Builder
                    </div>

                    <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                        Atul Tegar
                    </h2>

                    <p className="mt-5 max-w-3xl text-base leading-8 text-muted-foreground">
                        BIM developer focused on automation, workflow design, and technical
                        tooling for the AEC industry. With a background in Civil and
                        infrastructure projects, I work at the intersection of BIM,
                        visual scripting, and software development.
                    </p>

                    <p className="mt-4 max-w-3xl text-base leading-8 text-muted-foreground">
                        BIMformative is being developed as a structured platform for sharing,
                        managing, and versioning visual scripting workflows - starting with
                        Dynamo and expanding toward a more connected automation ecosystem.
                    </p>

                    <div className="mt-6 flex flex-wrap gap-2">
                        {[
                            "Dynamo",
                            "Revit API",
                            "Civil 3D API",
                            "C#",
                            "Python",
                            "Next.js",
                            ".NET",
                            "Workflow Automation",
                        ].map((item) => (
                            <span
                                key={item}
                                className="rounded-full border border.white/10 bg-white/40 px-3 py-1 text-sm text-slate-700 dark:bg-black/20 dark:text-slate-300"
                            >
                                {item}
                            </span>
                        ))}
                    </div>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                        <Button asChild variant={"outline"}>
                            <Link
                                href="https://www.linkedin.com/in/atultegar/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <FaLinkedin className="mr-2 h-8 w-8" />
                                LinkedIn
                            </Link>                            
                        </Button>

                        <Button asChild variant={"outline"}>
                            <Link
                                href="https://github.com/atultegar"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <FaGithub className="mr-2 h-8 w-8" />
                                GitHub
                            </Link>                            
                        </Button>
                    </div>

                    <div className="mt-6 inline-flex items-center text-sm text-muted-foreground">
                        <Layers3 className="mr-2 h-4 w-4 text-cyan-500" />
                        Built with Next.js + .NET and designed for scalable BIM workflows
                    </div>
                </div>

                {/* Image */}
                <div className="flex justify-center lg:justify-end">
                    <div className="relative">
                        <div className="absolute inset-0 rounded-full bg-cyan-500/10 blur-3xl" />
                            <Image
                                src={profilePic}
                                alt="Atul Tegar"
                                width={280}
                                height={280}
                                className="relative rounded-full border border-white/10 object-cover shadow-2xl"
                                priority
                             />
                    </div>
                </div>
            </div>            
        </section>
    );
}