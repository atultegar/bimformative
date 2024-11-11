import React from "react";

const resources = [
    { title: 'Blog', description: 'BIM software insights and best practices.'},
    { title: 'Documentation', description: 'Step-by-step tutorials and documentation for BIM workflows.'},
    { title: 'Dynamo Scripts', description: 'Ready-to-use Dynamo and Python scripts.'},
    { title: 'Code Snippets', description: 'C# and Python code snippets for BIM development'},
    { title: 'Tutorials', description: 'Watch our in-depth tutorials.'},
    { title: 'Other Assets', description: 'Other assets to streamline BIM workflows.'},
];

export default function ResourceHighlights() {
    return (
        <section className="max-w-7xl mx-auto mt-10 py-16 bg-gray-100 dark:bg-black">
            <h2 className="text-center text-3xl font-semibold">Explore Our Resources</h2>
            <div className="grid md:grid-cols-3 gap-6 mt-8 max-w-4xl mx-auto">
                {resources.map((resources, index) => (
                    <div key={index} className="p-6 rounded-lg shadow text-center dark:shadow-stone-950">
                        <h3 className="text-lg font-bold">{resources.title}</h3>
                        <p className="text-gray-600 mt-2">{resources.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}