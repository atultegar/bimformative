"use client"
import Image from "next/image";
import profileImage from "../../public/intro.png";
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
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import GridPattern from "@/components/ui/grid-pattern";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import HeroImage from "@/public/hero-image.jpg";

const charm = Charm({ weight: "700", subsets: ["latin"]});

export function Hero() {
    const plugin = React.useRef(
        Autoplay({delay: 2000, stopOnInteraction: false})
    )

    const carouselArray = [
        intro1, intro2, intro3, intro4, intro5
    ]

    return (
        <div className="max-w-7xl mx-auto bg-transparent items-center min-h-[90vh] flex flex-col justify-center text-center gap-y-5">            
            {/* <h1 className="text-4xl lg:text-6xl font-semibold">
                BIM<span className={`italic ${charm.className}`}>formative</span>
            </h1> */}
            <h1 className="text-2xl lg:text-6xl font-bold mt-3 bg-gradient-to-r from-blue-300 to-pink-300 inline-block text-transparent bg-clip-text">
                Simplify Complex BIM Workflows for Infrastructure Projects
            </h1>
            <p className="mt-5 text-gray-400 max-w-4xl">
                Discover tools and resources to tackle challenging BIM tasks with ease - Dynamo Scripts, Revit Families, Custom Subassemblies, and Python &amp; C# Code snippets.
            </p>
            <div className='mt-5 space-x-5'>
                <Button asChild>
                    <Link href="/resources">Get Started</Link>
                </Button>
                <Button variant="outline" asChild>
                    <Link href="/about">Learn More</Link>
                </Button>
            </div>
            <div className="relative w-full max-w-7xl mx-auto">
                <div className="relative rounded-2xl overflow-hidden h-[400px] w-full m-auto">
                    <Image src={HeroImage} alt="Hero Image" layout="fill" objectFit="cover" className="rounded-xl" />
                    {/* <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-50 rounded-xl"></div> */}
                </div>                
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative flex w-full max-w-sm sm:max-w-md items-center justify-center space-x-2 border dark:border-gray-500 rounded-2xl hover:border-gray-900 bg-white p-1 dark:hover:border-blue-800">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <Search className="w-6 h-6 text-gray-500" />
                        </span>
                        <Input
                            type="search"
                            placeholder="Find the BIM resource you need..."
                            className="pl-10 border-none focus:outline-none focus:ring-0 bg-transparent text-gray-500"
                        />
                        <span>
                            <Button variant="default" className="p-2 rounded-xl w-24">
                                Search
                            </Button>
                        </span>
                    </div>
                </div>
            </div>
        </div>            
    )
}