"use client";

import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { use, useEffect, useState } from "react";
import { set } from "zod";
import ProgressBar from "./ProgressBar";


async function fetchRoadmapItems() {
    const API_KEY = process.env.NEXT_PUBLIC_API_KEY as string;
    const res = await fetch("/api/roadmap", {
        headers: {
            "x-api-key": API_KEY
        },
    });
    const data = await res.json();
    console.log(data);
    return data;
}

interface RoadmapItem {
    title: string;
    description: string;
    image: string;
    type: string;
    status: number;
}

export default function Roadmap() {
    const [addinsData, setAddinsData] = useState<RoadmapItem[]>([]);
    const [dynamoScriptsData, setDynamoScriptsData] = useState<RoadmapItem[]>([]);
    const [othersData, setOthersData] = useState<RoadmapItem[]>([]);

    useEffect(() => {
        async function fetchData() {
            const res = await fetchRoadmapItems();
            const addins = res.roadmapItems.filter((item: RoadmapItem) => item.type === "addin");
                setAddinsData(addins);
                const dynamoscripts = res.roadmapItems.filter((item: RoadmapItem) => item.type === "dynamoscript");
                setDynamoScriptsData(dynamoscripts);
                const others = res.roadmapItems.filter((item: RoadmapItem) => item.type === "other");
                setOthersData(others);            
        }
        fetchData();
    } , []);
    
    return (
        <section className="max-w-7xl mx-auto mt-10 p-10 min-h-[600px] items-center justify-center">
            <h2 className="text-center text-4xl font-semibold">Our Roadmap</h2>
            <p className="text-center text-muted-foreground p-5 w-[75%] justify-self-center">Join us on our journey to revolutionize BIM for Infrastructure with cutting-edge resources and tools, including tailored add-ins, Dynamo scripts, custom subassemblies, and Python automation.</p>
            <div className="w-full flex items-center justify-center text-center">
                <Tabs defaultValue="addins" className="mt-5 items-center justify-center w-[80%]">
                    <TabsList className="w-full justify-evenly">
                        <TabsTrigger value="addins">Add-ins</TabsTrigger>
                        <TabsTrigger value="dynamoscripts">Dynamo Scripts</TabsTrigger>
                        <TabsTrigger value="others">Others</TabsTrigger>
                    </TabsList>

                    <TabsContent value="addins">
                        <div className="mt-0 mb-16 p-5 items-center justify-center rounded-md bg-muted">
                            <ul className="w-full mx-auto mt-5 space-y-5">
                                {addinsData.map((item, index) => (
                                    <li className="flex items-center justify-between rounded-lg px-4 py-1" key={index}>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger>{item.title}</TooltipTrigger>
                                                <TooltipContent>
                                                    <p className="text-left w-[500px]">{item.description}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>                                        
                                        <ProgressBar className="w-[250px]" statusValue={item.status} />                                  
                                    </li>
                                ))
                                }
                            </ul>
                            
                        </div>
                    </TabsContent>

                    <TabsContent value="dynamoscripts">
                        <div className="mt-0 mb-16 p-5 items-center justify-center rounded-md bg-muted">
                            <ul className="w-full mx-auto mt-0">
                                {dynamoScriptsData.map((item, index) => (
                                    <li className="flex items-center justify-between rounded-lg px-4 py-1" key={index}>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger>{item.title}</TooltipTrigger>
                                                <TooltipContent>
                                                    <p className="text-left w-[500px]">{item.description}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>                                        
                                        <ProgressBar className="w-[250px]" statusValue={item.status} />                                       
                                    </li>
                                ))
                                }
                            </ul>
                            
                        </div>
                    </TabsContent>

                    <TabsContent value="others">
                        <div className="mt-0 mb-16 p-5 items-center justify-center rounded-md bg-muted">
                            <ul className="w-full mt-0">
                                {othersData.map((item, index) => (
                                    <li className="flex items-center justify-between rounded-lg px-4" key={index}>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger>{item.title}</TooltipTrigger>
                                                <TooltipContent>
                                                    <p className="text-left w-[500px]">{item.description}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>                                        
                                        <ProgressBar className="w-[250px]" statusValue={item.status} />                                        
                                    </li>
                                ))
                                }
                            </ul>
                            
                        </div>
                    </TabsContent>     
                </Tabs>

            </div>
            
            
        </section>
    )

}