"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { GitBranch, ScanSearch, UploadCloud } from "lucide-react";

const steps = [
    {
        icon: UploadCloud,
        step: "Step 1",
        title: "Publish your script",
        description: "Upload Dynamo scripts with metadata, visibility settings, and version details",
    },
    {
        icon: GitBranch,
        step: "Step 2",
        title: "Track versions over time",
        description: "Manage updates, preserve script history, and maintain a reliable source of truth",
    },
    {
        icon: ScanSearch,
        step: "Step 3",
        title: "Compare changes visually",
        description: "Review node-level and Python script changes side by side to understand what changed",
    },
];

const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.35,
            duration: 0.6,
            ease: "easeOut",
        },
    }),
};

const lineVariants = {
    hidden: { scaleX: 0, opacity: 0.2 },
    visible: (i: number) => ({
        scaleX: 1,
        opacity: 1,
        transition: {
            delay: 0.2 + i * 0.35,
            duration: 0.5,
            ease: "easeOut",
        },
    }),
};

export function HowItWorks() {
    return (
        <section className="relative mx-auto max-w-7xl px-6 py-24 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="mx-auto max-w-2xl text-center"
            >
                <h2 className="text-3xl font-semibold text-primary tracking-tight sm:text-4xl">
                    How it works
                </h2>
                <p className="mt-4 text-muted-foreground">
                    A structured workflow for publishing, versioning, and comparing Dynamo scripts
                </p>
            </motion.div>

            <div className="relative hidden mt-16 items-center lg:grid lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:gap-6">
                {steps.map((step, index) => {
                    const Icon = step.icon;

                    return (
                        <div key={step.title} className="contents">
                            <motion.div
                                custom={index}
                                variants={cardVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.35 }}
                            >
                                <Card className="group relative min-h-[240px] overflow-hidden backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-white/10">
                                    <CardHeader>
                                        <div className="mb-4 flex items-center justify-between">
                                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10 ring-1 ring-cyan-400/10">
                                                <Icon className="h-6 w-6 text-cyan-400" />
                                            </div>
                                            <span className="text-xs uppercase tracking-[0.2em] text-gray-500">
                                                {step.step}
                                            </span>
                                        </div>

                                        <CardTitle className="text-lg font-semibold">
                                            {step.title}
                                        </CardTitle>
                                    </CardHeader>

                                    <CardContent>
                                        <CardDescription className="text-sm leading-6 text-gray-400">
                                            {step.description}
                                        </CardDescription>
                                    </CardContent>

                                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                </Card>
                            </motion.div>

                            {index < steps.length -1 && (
                                <div className="relative flex items-center justify-center">
                                    <motion.div
                                        custom={index}
                                        variants={lineVariants}
                                        initial="hidden"
                                        whileInView="visible"
                                        viewport={{ once: true, amount: 0.35 }}
                                        className="h-px w-24 origin-left bg-gradient-to-r from-cyan-400/70 via-blue-400/70 to-cyan-400/70" 
                                    />
                                    <motion.div 
                                        custom={index}
                                        initial={{ opacity: 0, x: -8 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true, amount: 0.35 }}
                                        transition={{
                                            delay: 0.45 + index * 0.35,
                                            duration: 0.35,
                                            ease: "easeOut",
                                        }}
                                        className="absolute right-0 h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.8)]"
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Mobile stacked version */}
            <div className="mt-12 grid grid-cols-1 gap-6 lg:hidden">
                {steps.map((step, index) => {
                    const Icon = step.icon;

                    return (
                        <motion.div
                            key={step.title}
                            custom={index}
                            variants={cardVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.35 }}
                        >
                            <Card className="backdrop-blur-sm">
                                <CardHeader>
                                    <div className="mb-4 flex items-center justify-between">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10 ring-1 ring-cyan-400/10">
                                            <Icon className="h-6 w-6 text-cyan-400" />
                                        </div>
                                        <span className="text-xs uppercase tracking-[0.2em] text-gay-500">
                                            {step.step}
                                        </span>
                                    </div>
                                    <CardTitle className="text-lg font-semibold">
                                        {step.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-sm leading-6 text-gray-400">
                                        {step.description}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    )
}