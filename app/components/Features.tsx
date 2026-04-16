"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, GitBranch, Search, Upload } from "lucide-react";
import { motion } from "framer-motion";

export function Features() {
    const features = [
        {
            icon: <Search className="h-6 w-6 text-primary" />,
            title: "Search & Load Scripts",
            description: "Browse and load Dynamo scripts directly without leaving your workflow",
        },
        {
            icon: <Upload className="h-6 w-6 text-primary" />,
            title: "Publish & Share",
            description: "Upload and share scripts with your team or the wider BIM community",
        },
        {
            icon: <GitBranch className="h-6 w-6 text-primary" />,
            title: "Version Control",
            description: "Track script changes over time and manage multiple versions with ease",
        },
        {
            icon: <Eye className="h-6 w-6 text-primary" />,
            title: "Visual Comparison",
            description: "See exactly what changed between versions, including node and Python code updates",
        }
    ];

    return (
        <section className="relative mx-auto max-w-7xl px-6 py-24 lg:px-8">
            {/* Section heading */}            
            <div className="mx-auto max-w-2xl text-center animate-fade-up">
                <h2 className="text-3xl font-semibold text-primary sm:text-4xl">
                    Everything you need to manage automation workflows
                </h2>
                <p className="mt-4 text-gray-400">
                    From discovering scripts to tracking changes - all in one place
                </p>
            </div>

            {/* Grid */}
            <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-4">
                {features.map((feature, index) => {
                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <Card
                                className={`group relative overflow-hidden backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/30 dark:hover:bg-white/10 hover:bg-gray-400/10 animate-fade-up delay-${index + 1}`}>
                                <CardHeader>
                                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10 ring-1 ring-cyan-400/10">
                                        {feature.icon}
                                    </div>
                                    <CardTitle className="text-lg font-semibold">
                                        {feature.title}
                                    </CardTitle>
                                </CardHeader>

                                <CardContent>
                                    <CardDescription className="text-sm leading-6 text-muted-foreground">
                                        {feature.description}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        </motion.div>                
                    )}
                )}
            </div>
        </section>
    )
}