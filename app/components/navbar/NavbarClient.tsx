"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

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
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        onScroll();
        window.addEventListener("scroll", onScroll);
    }, []);

    return (
        <>
            {/* Desktop Navigation */}
            <div className="hidden sm:flex justify-center items-center col-span-6">
                <NavigationMenu>
                    <NavigationMenuList>
                        {navigationItems.map((item) => (
                            <NavigationMenuItem key={item.name}>
                                {item.submenu ? (
                                    <>
                                        <NavigationMenuTrigger>
                                            {item.name}
                                        </NavigationMenuTrigger>
                                        <NavigationMenuContent>
                                            <ul className="grid w-[500px] gap-3 p-4 md:grid-cols-2">
                                                {item.submenu.map((sub) => (
                                                    <li key={sub.href}>
                                                        <NavigationMenuLink asChild>
                                                            <Link
                                                                href={sub.href}
                                                                className="block rounded-md p-3 hover:bg-muted"
                                                            >
                                                                <div className="text-sm font-medium">
                                                                    {sub.name}
                                                                </div>
                                                                <p className="text-sm text-muted-foreground">
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
                                                navigationMenuTriggerStyle(),
                                                pathname === item.href && "font-semibold"
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
            <div className="flex items-center justify-end gap-2 col-span-6 md:col-span-3">
                <Link
                    href="/contact"
                    className="hidden sm:inline-flex relative overflow-hidden rounded-md border-1 border-primary px-4 py-2 text-primary font-medium group"
                >
                    <span className="absolute w-64 h-0 transition-all duration-300 origin-center rotate-45 -translate-x-20 bg-primary top-1/2 group-hover:h-64 group-hover:-translate-y-32 ease" />
                    <span className="relative text-primary transition duration-300 group-hover:text-white ease">Contact Us</span>
                </Link>
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