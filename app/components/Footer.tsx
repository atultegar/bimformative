"use client"

import Link from "next/link";
import { socialMedia } from "./SectionTwo";
import Image from "next/image";
import logo from "../../public/logo-1.png"
import darklogo from "../../public/logo-2.png"
import { Separator } from "@/components/ui/separator";
import { navigationItems } from "./navbar/navigation.config";

export function Footer() {
    const productLinks = [
        { name: "Explore Scripts", href: "/resources/dynamo-scripts" },
        { name: "Download Extension", href: "/download-extension" },
        { name: "Docs", href: "/docs" },
        { name: "Roadmap", href: "/roadmap" },
    ];

    const resourceLinks = [
        { name: "Blog", href: "/blog" },
        { name: "Video Tutorials", href: "/resources/video-tutorials" },
        { name: "Python Scripts", href: "/resources/python-scripts" },
        { name: "C# Snippets", href: "/resources/csharp-snippets" },
    ];

    const companyLinks = [
        { name: "About", href: "/about" },
        { name: "Contact", href: "/contact" },
        { name: "Disclaimer", href: "/disclaimer" },
        { name: "Privacy Policy", href: "/privacy-policy" },
    ];

    return (
        <footer className="relative mt-0 w-full border-t border-gray-200 bg-slate-50 dark:border-white/10 dark:bg-black">
            <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
                {/* Top section */}
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
                    {/* Brand block */}
                    <div className="lg:col-span-5">
                        <Link href="/" className="inline-flex items-center gap-3">
                            <Image src={logo} alt="BIMformative logo" className="h-9 w-9 block dark:hidden"/>
                            <Image src={darklogo} alt="BIMformative dark logo" className="h-9 w-9 hidden dark:block"/>
                            <span className="text-xl font-semibold tracking-tight">
                                BIMformative
                            </span>
                        </Link>

                        <p className="mt-5 max-w-md text-sm leading-7 text-slate-600 dark:text-slate-400">
                            A platform for sharing, managing, and version-controlling visual scripting
                            workflows for BIM automation. Built for Dynamo today, with more connected
                            automation workflows ahead
                        </p>

                        <div className="mt-6 flex items-center gap-4">
                            {socialMedia.map((item, index) => (
                                <Link
                                    key={index}
                                    href={item.link}
                                    rel="noopener noreferrer"
                                    target="_blank"
                                    className="rounded-md p-2 text-slate-500 transition-all hover:bg-slate-200/60 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/20 dark:hover:text-white"
                                >
                                    <Image
                                        src={item.icon}
                                        alt="Social icon"
                                        className="h-5 w-5 dark:invert"
                                        />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    <div className="grid grid-cols-1 gap-10 sm:grid-cols-3 lg:col-span-7">
                        <div>
                            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-900 dark:text-primary-foreground">
                                Product
                            </h3>
                            <ul className="mt-4 space-y-3">
                                {productLinks.map((item) => (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            className="text-sm text-slate-600 transition-colors hover:text-primary"
                                        >
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-900 dark:text-primary-foreground">
                                Resources
                            </h3>
                            <ul className="mt-4 space-y-3">
                                {resourceLinks.map((item) => (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            className="text-sm text-slate-600 transition-colors hover:text-primary"
                                        >
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-900 dark:text-primary-foreground">
                                Company
                            </h3>
                            <ul className="mt-4 space-y-3">
                                {companyLinks.map((item) => (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            className="text-sm text-slate-600 transition-colors hover:text-primary"
                                        >
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-12 border-t border-gray-200 pt-6 dark:border-white/10">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <p className="text-sm text-slate-500 dark:text-slate-500">
                            © {new Date().getFullYear()} BIMformative. All rights reserved.
                        </p>

                        <div className="flex h-5 items-center gap-4 text-sm text-slate-500 dark:text-slate-500">
                            <Link
                                href="/disclaimer"
                                className="transition-color hover:text-primary"
                            >
                                Disclaimer
                            </Link>
                            <Separator orientation="vertical" />
                            <Link
                                href="/privacy-policy"
                                className="transition-color hover:text-primary"
                            >
                                Privacy Policy
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}