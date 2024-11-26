"use client";
import React, { useEffect, useState } from "react";
import Counter from "./animata/text/counter";

async function fetchCounts() {
    try {
        const response = await fetch("/api/resourceCount");
        if(!response.ok) {
            throw new Error("Failed to fetch resource counts:");
        }
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error("Error in fetchCounts:", error);
        return null;
    }
}

export default function ResourceHighlights() {
    const [counts, setCounts] = useState({
        blogCount: 0,
        dynamoScriptCount: 0,
        codeSnippetCount: 0,
        docCount: 3,
        tutorialCount: 1,
        otherAssetCount: 5,
    });

    const resources = [
        { title: 'Blog', description: 'BIM software insights and best practices.', countKey: "blogCount"},
        { title: 'Documentation', description: 'Step-by-step tutorials and documentation for BIM workflows.', countKey: "docCount"},
        { title: 'Dynamo Scripts', description: 'Ready-to-use Dynamo and Python scripts.', countKey: "dynamoScriptCount"},
        { title: 'Code Snippets', description: 'C# and Python code snippets for BIM development', countKey: "codeSnippetCount"},
        { title: 'Tutorials', description: 'Watch our in-depth tutorials.', countKey: "tutorialCount"},
        { title: 'Other Assets', description: 'Other assets to streamline BIM workflows.', countKey: "otherAssetCount"},
    ];

    useEffect(() => {
        async function updateCounts() {
            const fetchedCounts = await fetchCounts();
            if (fetchedCounts) {
                setCounts((prevCounts) => ({
                    ...prevCounts,
                    ...fetchedCounts,
                }));
            }            
        }
        updateCounts();
    }, []);


    return (
        <section className="max-w-7xl mx-auto mt-10 py-16 bg-gray-100 dark:bg-black">
            <h2 className="text-center text-3xl font-semibold">Explore Our Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 gap-y-5 mt-8 max-w-4xl mx-auto">
                {resources.map((res, index) => (
                    <div key={index} className="p-6 rounded-lg shadow text-center dark:shadow-stone-950">
                        <h3 className="text-5xl font-bold text-primary">
                            <Counter targetValue={counts[res.countKey as keyof typeof counts] || 0} className="font-bold text-4xl" />
                        </h3>                        
                        <h3 className="text-lg font-bold mt-2">{res.title}</h3>
                        <p className="text-gray-600 mt-2">{res.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}