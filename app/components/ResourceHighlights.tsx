"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getResourceCounts } from "../actions/serverActions";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShineBorder } from "@/components/ui/magicui/shine-border";
import { NumberTicker } from "@/components/ui/magicui/number-ticker";

async function fetchCounts() {
    const res = await getResourceCounts();

    if (!res) return null;

    return res;
}

export default function ResourceHighlights() {
    const [counts, setCounts] = useState({
        blogCount: 0,
        dynamoScriptCount: 0,
        codeSnippetCount: 0,
        docCount: 0,
        tutorialCount: 0,
        otherAssetCount: 0,
    });

    const resources = [
        { title: 'Blog', description: 'BIM software insights and best practices.', countKey: "blogCount", url: "/blog"},
        { title: 'Documentation', description: 'Step-by-step tutorials and documentation for BIM workflows.', countKey: "docCount", url: "/docs"},
        { title: 'Dynamo Scripts', description: 'Ready-to-use Dynamo scripts.', countKey: "dynamoScriptCount", url: "/resources/dynamo-scripts"},
        { title: 'Code Snippets', description: 'C# and Python code snippets for BIM development', countKey: "codeSnippetCount", url: "/resources/csharp-snippets"},
        { title: 'Tutorials', description: 'Watch our in-depth tutorials.', countKey: "tutorialCount", url: "/resources/video-tutorials"},
        { title: 'Other Assets', description: 'Other assets to streamline BIM workflows.', countKey: "otherAssetCount", url: "/resources/other-assets"},
    ];

    useEffect(() => {
        async function updateCounts() {
            const fetchedCounts = await fetchCounts();
            if (fetchedCounts) {
                setCounts(fetchedCounts);
            }            
        }
        updateCounts();
    }, []);


    return (
        <section className="max-w-full mx-auto mt-10 py-16 bg-gray-100 dark:bg-black">
            <h2 className="text-center text-3xl font-semibold">Explore Our Resources</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 gap-y-5 mt-8 max-w-4xl mx-auto">
                {resources.map((res, index) => (
                    // <div key={index} className="p-6 rounded-lg shadow text-center dark:shadow-gray-600">
                    //     <h3 className="text-5xl font-bold text-primary">
                    //         <Counter targetValue={counts[res.countKey as keyof typeof counts] || 0} className="font-bold text-4xl" />
                    //     </h3>
                    //     <Link href={res.url}>
                    //         <h3 className="text-lg font-bold mt-2">{res.title}</h3>
                    //     </Link>                                               
                    //     <p className="text-gray-600 mt-2">{res.description}</p>
                    // </div>
                    <Card key={index} className="relative w-full max-w-[300px] overflow-hidden p-6 shadow text-center dark:shadow-gray-600">
                        <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />
                        <CardHeader>
                            <CardTitle>
                                <NumberTicker 
                                    value={counts[res.countKey as keyof typeof counts] || 0}
                                    className="text-4xl font-medium tracking-tighter whitespace-pre-wrap text-black dark:text-white" 
                                />
                            </CardTitle>
                            <CardDescription className="flex flex-col text-sm gap-y-1 font-normal text-gray-600">
                                <Link href={res.url} className="text-lg font-bold mt-2 text-black dark:text-white">
                                    {res.title}
                                </Link>
                                {res.description}
                            </CardDescription>
                        </CardHeader>

                    </Card>
                ))}
            </div>
        </section>
    );
}