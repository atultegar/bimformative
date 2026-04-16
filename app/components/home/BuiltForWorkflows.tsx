"use client";

import { AnimatePresence, motion } from "framer-motion";
import { GitCompare, Puzzle, UploadCloud, Wrench } from "lucide-react";

import SearchWorkflowImage from "@/public/workflow-search.png";
import CompareWorkflowImage1 from "@/public/workflow-compare-1.png";
import CompareWorkflowImage2 from "@/public/workflow-compare-2.png";
import PublishWorkflowImage from "@/public/workflow-publish.png";
import ManageWorkflowImage from "@/public/workflow-manage.png";
import { Card, CardContent } from "@/components/ui/card";
import Image, { StaticImageData } from "next/image";
import { useEffect, useState } from "react";

type WorkflowItem = {
    icon: React.ElementType;
    title: string;
    description: string;
    imageAlt: string;
    image?: StaticImageData;
    images?: StaticImageData[];
};

const workflows: WorkflowItem[] = [
    {
        icon: Puzzle,
        title: "Browse and load scripts inside Dynamo",
        description: "Search and access scripts directly from Dynamo for Revit and Civil 3D, withoutswitching tools, folders, or disconnected libraries",
        image: SearchWorkflowImage,
        imageAlt: "BIMformative Dynamo extension search and load scripts interface",
    },
        {
        icon: GitCompare,
        title: "Understand changes before you run them",
        description: "Compare script versions visually, including changed nodes, updated values, and Python code differences side by side for safer automation updates",
        images: [CompareWorkflowImage1, CompareWorkflowImage2],
        imageAlt: "BIMformative script compare dialog showing visual differences between versions",
    },
    {
        icon: UploadCloud,
        title: "Publish, version, and manage scripts in one place",
        description: "Upload scripts, maintain version history, and manage your own automation workflows through a structured publishing flow built for real BIM teams",
        image: PublishWorkflowImage,
        imageAlt: "BIMformative Dynamo extension publish script interface",
    },
    {
        icon: Wrench,
        title: "Manage downloaded and local scripts",
        description: "Keep track of your local script library, manage downloaded scripts, and maintain a cleaner automation workflow inside Dynamo",
        image: ManageWorkflowImage,
        imageAlt: "BIMformative Dynamo extension manage scripts interface",
    },
];

function WorkflowSlideshow({
    images,
    alt,
} : {
    images: StaticImageData[];
    alt: string;
}) {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        if (!images?.length || images.length <= 1) return;

        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % images.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [images]);

    return (
        <div className="relative overflow-hidden rounded-md border border-white/10 bg-slate-950/60 shadow-2xl ring-1 ring-white/5">
            <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-500/10" />

            <div className="relative z-10 w-full">
                <AnimatePresence mode="wait">
                <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.45, ease: "easeInOut" }}
                    className="w-full"
                >
                    <Image
                    src={images[activeIndex]}
                    alt={alt}
                    sizes="(max-width: 1024px) 100vw, 800px"
                    className="object-cover h-auto w-full"
                    priority={activeIndex === 0}
                    />
                </motion.div>
                </AnimatePresence>
            </div>        
        </div>
    );
}

export function BuiltForWorkflows() {
    return (
        <section className="relative mx-auto max-w-7xl px-6 py-24 lg:px-8">
            {/* Section heading */}
            <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={ {opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="mx-auto max-w-3xl text-center"
            >
                <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl text-primary">
                    Built for real BIM workflows
                </h2>
                <p className="mt-4 text-gray-400">
                    From script discovery to version comparison, BIMformative is designed
                    around how teams actually work with Dynamo
                </p>
            </motion.div>

            {/* Workflow cards */}
            <div className="mt-16 space-y-8">
                {workflows.map((workflow, index) => {
                    const Icon = workflow.icon;
                    const isReversed = index % 2 === 1;

                    return (
                        <motion.div
                            key={workflow.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{
                                duration: 0.65,
                                delay: index * 0.08,
                                ease: "easeOut",
                            }}
                        >
                            <Card className="overflow-hidden border-white/10 backdrop-blur-sm transition-all duration-300">
                                <CardContent className="p-0">
                                    <div className={`grid grid-cols-1 items-center gap-0 lg:grid-cols-2 ${isReversed ? "lg:[&>*:first-child]:order-2" : ""}`}>
                                        {/* Text content */}
                                        <div className="flex h-full flex-col justify-center px-6 py-8 sm:px-8 lg:px-10 lg:py-12">
                                            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl ring-1 ring-cyan-400/10">
                                                <Icon className="h-6 w-6 text-primary" />
                                            </div>

                                            <h3 className="text-2xl font-semibold tracking-tight">
                                                {workflow.title}
                                            </h3>

                                            <p className="mt-4 max-w-xl text-sm leading-7 text-gray-400 sm:text-base">
                                                {workflow.description}
                                            </p>

                                            
                                        </div>
                                        {/* Image / product visual  */}
                                        <div className="relative h-full w-full p-4 sm:p-6 lg:p-8">
                                            {workflow.images ? (
                                                <WorkflowSlideshow images={workflow.images} alt={workflow.imageAlt} />
                                            ) : workflow.image ? (
                                                <div className="relative overflow-hidden rounded-md border border-white/10 bg-slate-950/60 shadow-2xl ring-1 ring-white/5">
                                                    {/* subtle glow */}
                                                    <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-500/10" />

                                                    <Image 
                                                        src={workflow.image}
                                                        alt={workflow.imageAlt}
                                                        className="relative z-10 h-auto w-full object-cover transition-transform duration-500 hover:scale-[1.01]"
                                                    />
                                                </div>
                                            ) : null}                                            
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    )
}