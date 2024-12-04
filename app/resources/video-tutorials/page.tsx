import React from "react";
import { PageBanner } from "@/app/components/PageBanner";
import { client } from "@/app/lib/sanity";
import { Metadata } from "next";
import { videoTutorial } from "@/app/lib/interface";
import { YouTubePlayer } from "@/app/components/YouTubePlayer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import tutorialsCover from "@/public/tutorials-cover.png";

export const revalidate = 30;  //revalidate at most 30 seconds

export const metadata: Metadata = {
    title : "Video Tutorials"
}

async function getData() {
    const query = `
  *[_type == 'videoTutorial'] | order(_createdAt desc) {
    name,
    description,
    "youtube": url.id
  }`;

  const data = await client.fetch(query);

  return data;
}

export default async function Resources() {
    const data: videoTutorial[] = await getData();
    return (
    <section className="mt-10 max-w-7xl w-full px-4 md:px-8 mx-auto min-h-[900px]">
        <PageBanner imageSrc={tutorialsCover} title="Video Tutorials" description="Explore, Enhance, Execute with Dynamo Scripts." />            
        <div className="container max-w-[1280px] mx-auto py-10 mt-10 mb-16 flex flex-col">
            {data.map((item, idx) => (
                <div key={idx}>                    
                    <Card className="relative block w-full bg-gray-100 dark:bg-black mb-10">                    
                    <CardContent className="flex flex-col overflow-hidden rounded-none p-4 lg:flex-row">
                        {idx % 2 === 0 ? (
                            <>
                            {/* Video on the left */}
                            <div className="inline-block w-full lg:rounded overflow-hidden h-full cursor-pointer">
                                <YouTubePlayer url={`https://www.youtube.com/watch?v=${item.youtube}`} />                                                      
                            </div>
                            {/* Name and Description on the right */}
                            <div className="w-full p-6 lg:w-3/5">
                                <h2 className="font-bold text-3xl">{item.name}</h2>
                                <p className="mt-2 text-gray-700 dark:text-gray-300">{item.description}</p>
                            </div>
                            
                            </>
                        ): (
                            <>
                            {/* Name and Description on the left */}
                            <div className="w-full p-6 lg:w-3/5">
                                <h2 className="font-bold text-3xl">{item.name}</h2>
                                <p className="mt-2 text-gray-700 dark:text-gray-300">{item.description}</p>
                            </div>
                            {/* Video on the right */}
                            <div className="inline-block w-full lg:rounded overflow-hidden h-full cursor-pointer">
                                <YouTubePlayer url={`https://www.youtube.com/watch?v=${item.youtube}`} />                                                      
                            </div>
                            </>
                        )}                        
                    </CardContent>
                </Card>
                </div>
                )
            )}
        </div>
    </section>    
    )
}