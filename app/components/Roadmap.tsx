"use client";

import { Brain, Globe, Rocket, Wrench } from "lucide-react";
import { RoadmapRecord } from "@/lib/services/roadmap.service";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { PageBanner } from "./PageBanner";

const iconMap = {
    rocket: Rocket,
    wrench: Wrench,
    brain: Brain,
    globe: Globe,
};

const statusMap = {
    live: "Live",
    in_progress: "In Progress",
    planned: "Planned",
    vision: "Vision",
};

export default function Roadmap({ items }: { items: RoadmapRecord[] }) {
    return (
        <section className="relative mx-auto max-w-7xl px-4 pb-24 lg:px-8">
            <PageBanner title="Roadmap" description="Building the future of BIM automation workflows" />
            
            <div className="relative mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                {items.map((item, index) => {
                    const Icon = iconMap[item.icon] || Rocket;

                    return (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                        >
                            <Card className="group relative h-full overflow-hidden border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/30">
                                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 opacity-0 transition duration-500 group-hover:opacity-100" />

                                <CardContent className="relative p-6">
                                    <div className="mb-4 flex items-center justify-between">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10 ring-1 ring-cyan-400/10">
                                            <Icon className="h-5 w-5 text-cyan-400" />
                                        </div>
                                        <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-2.5 py-1 text-xs text-cyan-400">
                                            {statusMap[item.status]}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-semibold">
                                        {item.title}
                                    </h3>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {item.subtitle}
                                    </p>

                                    <ul className="mt-5 space-y-2 text-sm text-gray-300">
                                        {item.points.map((point, i) => (
                                            <li key={i} className="flex items-start gap-2">
                                                <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-cyan-400" />
                                                <span>{point}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
}