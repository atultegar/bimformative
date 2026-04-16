"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";

import logoLight from "@/public/logo-light-2.png"
import logoDark from "@/public/logo-dark-2.png"

import NavbarClient from "./navbar/NavbarClient";
import { navigationItems } from "./navbar/navigation.config";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 12);
        onScroll();
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <nav 
            className={cn("sticky top-0 left-0 z-50 w-full transition-all duration-300 shadow-sm shadow-gray-300 dark:shadow-stone-900 bg-violet-50 dark:bg-zinc-900",
            scrolled
                ? "border-b border-white/10 bg-violet-100/70 dark:bg-slate-950/70 backdrop-blur-xl"
                : "bg-violet-50/90 dark:bg-zinc-900/90 backdrop-blur-md"
            )}>

            <div className="mx-auto grid max-w-7xl grid-cols-12 px-4 py-3 md:px-8">                
                {/* LOGO */}
                <div className="col-span-6 md:col-span-3 flex items-center">
                    <Link href="/" aria-label="Home" className="inline-flex items-center">
                        {/* Light mode logo */}
                        <Image src={logoLight} width={220} alt="BIMformative Logo" className="dark:hidden h-auto w-auto" priority/>
                        {/* Dark mode logo */}
                        <Image src={logoDark} width={220} alt="BIMformative Logo" className="hidden dark:block h-auto w-auto" priority/>
                    </Link>
                </div>

                {/* Client-side interactive section */}
                <NavbarClient navigationItems={navigationItems} />
            </div>            
        </nav>
    );
}
