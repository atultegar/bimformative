"use client"

import React from "react";
import ReactPlayer from "react-player";

export function YouTubePlayer({url}: {url: string}) {
    return (
        <div className="flex justify-center items-center border rounded-md overflow-hidden w-full max-w-[800px] mx-auto border-gray-500 dark:border-gray-900 aspect-[16/9]">
            <ReactPlayer url={url} controls width="100%"/>
        </div>        
    ) 
}