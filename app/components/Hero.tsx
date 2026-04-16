"use client"

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import HeroImage3 from "@/public/hero-image-3.png";
import VisualScriptingBackground from "./home/VisualScriptingBackground";

export function Hero() {    
    return (
        <section className="relative overflow-hidden">
            <VisualScriptingBackground />
            {/* <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.6))]" /> */}
            <div className="mx-auto flex min-h-[92vh] max-w-7xl flex-col items-center justify-center px-6 pt-24 pb-16 text-center lg:px-8">                                          
            
                {/* Badge / small label */}
                <div className="animate-fade-up mb-6 inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-500/5 px-4 py-1.5 text-sm backdrop-blur-sm">
                    Built for Dynamo and visual scripting workflows                    
                </div>

                {/* Headline */}
                <h1 className="animate-fade-up max-w-6xl text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-7xl">
                    From scattered scripts to{" "}
                    <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500 text-transparent bg-clip-text">
                        structured automation workflows
                    </span>
                </h1>

                {/* Subheading */}
                <p className="animate-fade-up mt-6 max-w-2xl text-base leading-7 text-gray-400  md:text-lg">
                    Manage, share, and compare Dynamo scripts with built-in version control
                    and visual diff - designed for real-world BIM workflows across teams and projects
                </p>

                {/* CTA */}
                <div className="animate-fade-up mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                    <Button 
                        asChild 
                        size="lg">
                        <Link href="/resources/dynamo-scripts">Explore Scripts</Link>                    
                    </Button>

                    <Button 
                        variant="outline" 
                        asChild 
                        size="lg">
                        <Link href="/dashboard">Publish Script</Link>
                    </Button>
                </div>

                <p className="mt-3 text-sm text-gray-500">
                    Or use it directly inside Dynamo →{" "}
                    <Link href="/download-extension" className="text-cyan-400 hover:underline">
                        Download Extension
                    </Link>
                </p>

                {/* Supporting micro-copy */}
                <p className="animate-fade-up mt-4 text-sm text-gray-500">
                    Search, publish, version, and compare scripts - directly in one ecosystem
                </p>

                {/* Product visual */}
                <div className="animate-fade-up relative mt-14 w-full max-w-6xl">
                    {/* glow */}
                    <div className="absolute inset-0 -z-10 mx-auto h-[85%] w-[85%] rounded-full bg-cyan-500/10 blur-3xl" />

                    <div className="animate-float relative overflow-hidden rounded-lg border border-white/10 bg-white/5 shadow-2xl shadow-gray-300 dark:shadow-gray-600 backdrop-blur-sm">
                        <Image 
                            src={HeroImage3} 
                            alt="BIMformative version control and visual script comparison interface" 
                            className="w-full h-auto object-cover" 
                            priority />
                    </div>     
                </div>            
            </div> 
        </section>
                   
    )
}