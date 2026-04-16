"use client";

import { Building2, Code2, Network } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const useCases = [
    {
        icon: Building2,
        title: "For BIM teams",
        description: "Standardized shared automation workflows, reduce script duplication, and make updates easier to review across projects",
        points: [
            "Keep shared scripts organized",
            "Reduce confusion across team members",
            "Review updates before using new versions",
        ],
    },
    {
        icon: Code2,
        title: "For script developers",
        description: "Publish reusable scripts, maintain version history, and compare changes without relying on scattered folders or manual tracking",
        points: [
            "Share scripts with structure",
            "Track node and Python changes",
            "Manage versions with more confidence",
        ],
    },
    {
        icon: Network,
        title: "For digital leads and organizations",
        description: "Create a more reliable automation ecosystem with reusable scripts, internal standards, and clearer ownership of automation workflows",
        points: [
            "Build internal script libraries",
            "Support automation governance",
            "Improve visibility across workflows",
        ],
    },
];

export function UseCases() {
    return (
        <section className="relative mx-auto max-w-7xl px-6 py-24 lg:px-8">
            <motion.div
                initial={{opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="mx-auto max-w-3xl text-center"
            >
                <h2 className="text-3xl font-semibold tracking-tight text-primary sm:text-4xl">
                    Built for the people shaping automation workflows
                </h2>
                <p className="mt-4 text-gray-400">
                    Whether you are building scripts, managing teams, or scaling automation
                    across projects, BIMformative is designed to support real usage
                </p>
            </motion.div>

            <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-3">
                {useCases.map((item, index) => {
                    const Icon = item.icon;

                    return (
                        <motion.div
                            key={item.title}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{
                                duration: 0.55,
                                delay: index * 0.1,
                                ease: "easeOut",
                            }}
                        >
                            <Card className="group h-full border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-white/10">
                                <CardHeader>
                                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10 ring-1 ring-cyan-400/10">
                                        <Icon className="h-6 w-6 text-primary" />
                                    </div>

                                    <CardTitle className="text-xl font-semibold">
                                        {item.title}
                                    </CardTitle>

                                    <CardDescription className="pt-2 text-sm leading-6 text-gray-400">
                                        {item.description}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent>
                                    <ul className="space-y-3 text-sm text-gray-300">
                                        {item.points.map((point) => (
                                            <li key={point} className="flex items-start gap-3">
                                                <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                                                <span>{point}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )
                })}
            </div>
        </section>
    )
}