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

const charm = Charm({ weight: "700", subsets: ["latin"]});

export function Hero() {
    const plugin = React.useRef(
        Autoplay({delay: 2000, stopOnInteraction: false})
    )

    const carouselArray = [
        intro1, intro2, intro3, intro4, intro5
    ]

    return (
        <div className="mt-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 bg-gray-100 dark:bg-transparent items-center">
            <div className="col-span-1 lg:col-span-1 h-full min-h-[300px] rounded-2xl p-8 flex flex-col justify-center">
                <h1 className="text-4xl lg:text-6xl font-semibold">
                    BIM<span className={`italic ${charm.className}`}>formative</span>
                </h1>
                <h1 className="text-2xl lg:text-6xl font-bold mt-3 bg-gradient-to-r from-blue-300 to-pink-300 inline-block text-transparent bg-clip-text">
                    Where infrastructure innovation takes shape.
                </h1>
                <p className="mt-4 text-gray-400">
                    Blogs, Tutorials, Documentation, Resources
                </p>
                <div className='mt-8 space-x-4'>
                    <Button asChild>
                        <Link href="/resources">Get Started</Link>
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href="/about">Learn More</Link>
                    </Button>
                </div>                
            </div>

            {/* <div className="col-span-1 lg:col-start-2 lg:col-span-1 h-full min-h-[300px] rounded-lg p-8 flex flex-col justify-start">
                <Image
                    src={profileImage}
                    alt="Profile"
                className="col-span-1 object-cover lg:h-[350px] rounded-lg mt-2"
                priority />
            </div> */}

            <div className="col-span-1 lg:col-start-2 lg:col-span-1 h-full min-h-[300px] rounded-lg p-8 flex flex-col justify-start">
                <Carousel plugins={[plugin.current]}
                className="w-full">
                    <CarouselContent>
                        {carouselArray.map((_, index) => (
                            <CarouselItem key={index}>
                                <Image src={_} alt="intro" className="col-span-1 object-cover lg:h-[350px] rounded-lg mt-2" />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </div>            
        </div>
    )
}