"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Boxes, Download, Wrench } from "lucide-react";
import Link from "next/link";

const extensionGroups = [
    {
        title: "Dynamo for Revit",
        description: "Download the BIMformative extension for Dynamo running inside Revit",
        versions: [
            { version: "Revit 2023", href: "/downloads/bimformative-revit-2023.zip" },
            { version: "Revit 2024", href: "/downloads/bimformative-revit-2024.zip" },
            { version: "Revit 2025", href: "/downloads/bimformative-revit-2025.zip" },
            { version: "Revit 2026", href: "/downloads/bimformative-revit-2026.zip" },
        ],
    },
    {
        title: "Dynamo for Civil 3D",
        description: "Download the BIMformative extension for Dynamo running inside Civil 3D",
        versions: [
            { version: "Civil 3D 2023", href: "/downloads/bimformative-c3d-2023.zip" },
            { version: "Civil 3D 2024", href: "/downloads/bimformative-c3d-2024.zip" },
            { version: "Civil 3D 2025", href: "/downloads/bimformative-c3d-2025.zip" },
            { version: "Civil 3D 2026", href: "/downloads/bimformative-c3d-2026.zip" },
        ],
    },
];

export default function DownloadExtensionPage() {
    return (
        <main className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
            {/* Hero */}
            <section className="mx-auto max-w-3xl text-center">
                <div className="mb-6 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-gray-300 backdrop-blur-sm">
                    BIMformative Extension
                </div>

                <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                    Download BIMformative Extension
                </h1>

                <p className="mt-5 text-base leading-7 text-gray-400 sm:text-lg">
                    Access script search, publishing, local management, and version-aware
                    workflows directly inside Dynamo
                </p>

                <p className="mt-3 text-sm text-gray-500">
                    Supported for Revit 2023-2026 and Civil 3D 2023-2026
                </p>
            </section>

            {/* Extension groups */}
            <section className="mt-16 space-y-10">
                {extensionGroups.map((group) => (
                    <Card
                        key={group.title}
                        className="border-white/10 bg-white/5 backdrop-blur-sm"
                    >
                        <CardHeader>
                            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10 ring-1 ring-cyan-400/10">
                                <Boxes className="h-6 w-6 text-cyan-400" />
                            </div>
                            <CardTitle className="text-2xl">{group.title}</CardTitle>
                            <CardDescription className="text-sm leading-6 text-gray-400">
                                {group.description}
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                                {group.versions.map((item) => (
                                    <div
                                        key={item.version}
                                        className="rounded-xl border border-white/10 bg-slate-950/40 p-5"
                                    >
                                        <h3 className="text-lg font-semibold">
                                            {item.version}
                                        </h3>
                                        <p className="mt-2 text-sm text-gray-400">
                                            Download the extension package for this version
                                        </p>

                                        <Button asChild className="mt-5 w-full">
                                            <Link href={item.href}>
                                                <Download className="mr-2 h-4 w-4" />
                                                Download
                                            </Link>
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </section>

            {/* Installation notes */}
            <section className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                    <CardHeader>
                        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10 ring-1 ring-cyan-400/10">
                            <Wrench className="h-6 w-6 text-cyan-400" />
                        </div>
                        <CardTitle>Installation notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li>Download the package matching your Revit or Civil 3D version.</li>
                            <li>Install the extension and restart the host application.</li>
                            <li>Open Dynamo to access BIMformative features inside your workflow.</li>
                        </ul>
                    </CardContent>
                </Card>

                <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                    <CardHeader>
                        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10 ring-1 ring-cyan-400/10">
                            <Boxes className="h-6 w-6 text-cyan-400" />
                        </div>
                        <CardTitle>What&apos;s next</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm leading-6 text-gray-400">
                            Grasshopper support is currently under early exploration and may be
                            added in a future release.
                        </p>
                    </CardContent>
                </Card>
            </section>
        </main>
    );
}