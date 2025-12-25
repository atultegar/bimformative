"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";

import logoLight from "@/public/logo-light-2.png"
import logoDark from "@/public/logo-dark-2.png"

import NavbarClient from "./navbar/NavbarClient";
import { navigationItems } from "./navbar/navigation.config";

export default function Navbar() {
    return (
        <nav className="sticky top-0 left-0 z-20 w-full shadow-sm shadow-gray-300 dark:shadow-stone-900 bg-violet-50 dark:bg-zinc-900">
            <div className="max-w-full grid grid-cols-12 mx-auto px-4 md:px-8 py-2">
                
                {/* LOGO */}
                <div className="col-span-6 md:col-span-3">
                    <Link href="/" aria-label="Home">
                        {/* Light mode logo */}
                        <Image src={logoLight} width={250} alt="BIMformative Logo" className="dark:hidden" priority/>
                        {/* Dark mode logo */}
                        <Image src={logoDark} width={250} alt="BIMformative Logo" className="hidden dark:block" priority/>
                    </Link>
                </div>

                {/* Client-side interactive section */}
                <NavbarClient navigationItems={navigationItems} />
            </div>            
        </nav>
    );
}
