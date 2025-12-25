"use client"
import Image from "next/image";
import * as React from 'react';
import Autoplay from "embla-carousel-autoplay"
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Charm } from "next/font/google";

import intro1 from "../../public/intro.png";
import intro2 from "../../public/intro-2.png";
import intro3 from "../../public/intro-3.png";
import intro4 from "../../public/intro-4.png";
import intro5 from "../../public/intro-5.png";
import HeroImage from "@/public/hero-image-2.jpg";
import backCurves from "@/public/background-curves.png";
import SearchBar from "./SearchBar";
import { BackgroundCircles } from "./design/Hero";
import { useRef } from "react";

const charm = Charm({ weight: "700", subsets: ["latin"]});


export function Hero() {
    const plugin = useRef(
        Autoplay({delay: 2000, stopOnInteraction: false})
    )

    const parallaxRef = useRef(null);

    const carouselArray = [
        intro1, intro2, intro3, intro4, intro5
    ]

    return (
        <div className="max-w-7xl mx-auto bg-transparent items-center min-h-[90vh] flex flex-col justify-center text-center gap-y-5">            
            {/* <h1 className="text-4xl lg:text-6xl font-semibold">
                BIM<span className={`italic ${charm.className}`}>formative</span>
            </h1> */}
            
            <h1 className="mt-10 text-2xl lg:text-6xl font-bold h-[125px] bg-gradient-to-r from-blue-300 to-pink-300 inline-block text-transparent bg-clip-text">
                Simplify Complex BIM Workflows for Infrastructure Projects
            </h1>
            <p className="mt-5 text-gray-400 max-w-4xl">
                Discover tools and resources to tackle challenging BIM tasks with ease - Dynamo Scripts, Revit Families, Custom Subassemblies, and Python &amp; C# Code snippets.
            </p>
            <div className='mt-5 space-x-5'>
                <Button asChild>
                    <Link className="w-[175px]" href="/resources">Explore Resources</Link>
                </Button>
                <Button variant="outline" asChild>
                    <Link className="w-[175px]" href="/about">Learn More</Link>
                </Button>
            </div>
            <BackgroundCircles />
            
            <div className="relative w-full max-w-7xl mx-auto mt-5">
                <div className="relative rounded-2xl overflow-hidden h-[500px] w-full m-auto">
                    <Image src={HeroImage} alt="Hero Image" fill className="rounded-xl object-cover" priority />
                </div>                
                <div className="absolute inset-0 flex items-center justify-center">
                    <SearchBar />
                </div>
            </div>
            
        </div>            
    )
}