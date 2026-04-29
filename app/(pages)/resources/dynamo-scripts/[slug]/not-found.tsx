"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion"
import { ArrowLeft, FileX, Search } from "lucide-react"
import Link from "next/link";
export default function NotFound() {
    return (
        <div className="relative flex min-h-[70vh] items-center justify-center px-6 py-24 text-center">

            {/* subtle background glow */}
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_60%_at_50%_-20%,rgba(34,211,238,0.08),transparent)]" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-xl"
            >
                {/* Icon */}
                <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-cyan-500/10 ring-1 ring-cyan-400/10">
                    <FileX className="h-6 w-6 text-cyan-400" />
                </div>

                {/* Title */}
                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                    Script not found
                </h1>

                {/* Description */}
                <p className="mt-4 text-muted-foreground">
                    The script you are looking for does not exist, may have been removed,
                    or the link might be incorrect.
                </p>

                {/* Suggestions */}
                <div className="mt-6 text-sm text-muted-foreground">
                    Try exploring available scripts or searching for what you need.
                </div>

                {/* Actions */}
                <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                    <Button asChild>
                        <Link href="/resources/dynamo-scripts">
                        <Search className="mr-2 h-4 w-4" />
                        Explore Scripts
                        </Link>
                    </Button>

                    <Button variant={"outline"} asChild>
                        <Link href="/">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Go to Home
                        </Link>
                    </Button>
                </div>
            </motion.div>
        </div>
    );
}