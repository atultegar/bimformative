"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import ProgressBar from "./ProgressBar";
import { getRoadmapItemsAction } from "../actions/serverActions";
import { RoadmapItem } from "@/lib/types/resources";
import RoadmapList from "./RoadmapList";

type RoadmapType = "addin" | "dynamoscript" | "other";

type RoadmapState = Record<RoadmapType, RoadmapItem[]>;

const INITIAL_STATE: RoadmapState = {
    addin: [],
    dynamoscript: [],
    other: [],
};

export default function Roadmap() {
    const [items, setItems] = useState<RoadmapState>(INITIAL_STATE);

    useEffect(() => {
        async function loadRoadmap() {
            const data = await getRoadmapItemsAction();

            const grouped: RoadmapState = {
                addin: [],
                dynamoscript: [],
                other: [],
            };

            for (const item of data) {
                const itemType = (item.type === "addin" || item.type === "dynamoscript" || item.type === "other")
                    ? (item.type as RoadmapType)
                    : "other";
                grouped[itemType] = [...grouped[itemType], item];
            }

            setItems(grouped);
        }

        loadRoadmap();
    } , []);
    
    return (
        <section className="max-w-7xl mx-auto mt-10 p-10 min-h-[600px]">
            <h2 className="text-center text-4xl font-semibold">Our Roadmap</h2>

            <p className="text-center text-muted-foreground p-5 w-[75%] mx-auto">
                Join us on our journey to revolutionize BIM for Infrastructure with cutting-edge resources and tools, including tailored add-ins, Dynamo scripts, custom subassemblies, and Python automation.
            </p>

            <div className="flex justify-center">
                <Tabs defaultValue="addins" className="mt-5 w-[80%]">
                    <TabsList className="w-full justify-evenly">
                        <TabsTrigger value="addins">Add-ins</TabsTrigger>
                        <TabsTrigger value="dynamoscripts">Dynamo Scripts</TabsTrigger>
                        <TabsTrigger value="others">Others</TabsTrigger>
                    </TabsList>

                    <TabsContent value="addins">
                        <RoadmapList items={items.addin} />
                    </TabsContent>

                    <TabsContent value="dynamoscripts">
                        <RoadmapList items={items.dynamoscript} />
                    </TabsContent>

                    <TabsContent value="others">
                        <RoadmapList items={items.other} />
                    </TabsContent>     
                </Tabs>
            </div>
        </section>
    )
}