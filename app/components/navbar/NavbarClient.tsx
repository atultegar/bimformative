"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import logoLight from "@/public/logo-light-2.png"
import logoDark from "@/public/logo-dark-2.png"

import { 
    NavigationMenu, 
    NavigationMenuContent, 
    NavigationMenuItem, 
    NavigationMenuLink, 
    NavigationMenuList, 
    NavigationMenuTrigger, 
    navigationMenuTriggerStyle 
} from "@/components/ui/navigation-menu"

import { ModeToggle } from "@/app/components/ModeToggle";
import { MobileMenu } from "@/app/components/MobileMenu";
import UserMenu from "@/app/components/UserMenu";

import { 
    SignedIn, 
    SignedOut, 
    SignInButton,
    ClerkLoaded,
    ClerkLoading,
} from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
    navigationItems: {
        name: string;
        href: string;
        submenu?: {
            name: string;
            href: string;
            description: string;
        }[];
    }[];
};

export default function NavbarClient({ navigationItems }: Props) {
    const pathname = usePathname();

    return (
        <>
            {/* Desktop Navigation */}
            <div className="hidden md:col-span-6 lg:flex items-center justify-center">
                <NavigationMenu>
                    <NavigationMenuList className="gap-1">
                        {navigationItems.map((item) => (
                            <NavigationMenuItem key={item.name}>
                                {item.submenu ? (
                                    <>
                                        <NavigationMenuTrigger className={cn("bg-transparent text-sm")}>
                                            {item.name}
                                        </NavigationMenuTrigger>
                                        <NavigationMenuContent>
                                            <ul className="grid w-[560px] gap-3 p-4 md:grid-cols-2">
                                                {item.submenu.map((sub) => (
                                                    <li key={sub.href}>
                                                        <NavigationMenuLink asChild>
                                                            <Link
                                                                href={sub.href}
                                                                className="block rounded-xl border border-transparent p-3 transition-colors hover:border-white/10 hover:bg-muted"
                                                            >
                                                                <div className="text-sm font-medium text-foreground">
                                                                    {sub.name}
                                                                </div>
                                                                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                                                    {sub.description}
                                                                </p>
                                                            </Link>
                                                        </NavigationMenuLink>
                                                    </li>                                                    
                                                ))}
                                            </ul>
                                        </NavigationMenuContent>
                                    </>
                                ) : (
                                    <NavigationMenuLink asChild>
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                "bg-transparent text-sm hover:bg-white/5",
                                                navigationMenuTriggerStyle(),
                                                pathname === item.href && "bg-gray-500/10 dark:bg-white/10 font-medium"
                                            )}
                                        >
                                            {item.name}
                                        </Link>
                                    </NavigationMenuLink>
                                )}
                            </NavigationMenuItem>
                        ))}
                    </NavigationMenuList>
                </NavigationMenu>
            </div>

            {/* Right Side */}
            <div className="col-span-6 md:col-span-9 lg:col-span-3 flex items-center justify-end gap-2">
                <Button
                    asChild
                    size={"sm"}
                    className="hidden sm:inline-flex"
                >
                    <Link href="/download-extension">Download Extension</Link>
                </Button>

                <ModeToggle />

                <div className="sm:hidden">
                    <MobileMenu />
                </div>

                <ClerkLoaded>
                    <SignedOut>
                        <Button variant={"ghost"} asChild>
                            <SignInButton mode="modal" />
                        </Button>
                    </SignedOut>

                    <SignedIn>
                        <UserMenu />
                    </SignedIn>
                </ClerkLoaded>

                <ClerkLoading>
                    <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
                </ClerkLoading>
            </div>
        </>
    );
}