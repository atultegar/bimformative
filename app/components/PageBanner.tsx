import React from "react";
import Image, { StaticImageData } from "next/image";

interface PageBannerProps {
    imageSrc?: StaticImageData;
    title: string;
    description: string;
}

export const PageBanner: React.FC<PageBannerProps> = ({
    imageSrc,
    title,
    description,
}) => {
    return (
        <div className={`relative text-left h-[150px] sm:h-[200px] md:h-[200px] lg:h-[200px] ${ imageSrc ? "" : "bg-gray-100 dark:bg-black"}`}>            
                {imageSrc ? (
                    <Image src={imageSrc} alt={`${title} Cover`} className="block object-cover" fill priority/>
                ): (
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(0,0,0,0))] pointer-events-none" />
                )}
                <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-10 md:px-12">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-black dark:text-white max-w-3xl">
                        {title}
                    </h1>
                    <p className="mt-4 text-sm sm:text-base md:text-lg max-w-60 md:max-w-3xl text-gray-900 dark:text-gray-400">
                        {description}
                    </p>
                </div>
                <hr className="absolute bottom-0 w-full h-px bg-gray-300 dark:bg-gray-800" />
            </div>             
    );
};