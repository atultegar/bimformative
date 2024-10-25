"use client";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu"
import Link from "next/link"
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MobileMenu } from "./MobileMenu";
import { useEffect, useState } from "react";

export const navigationItems = [
    {
        name: 'Home',
        href: '/'
    },
    {
        name: 'Blog',
        href: '/blog'
    },
    {
        name: 'Docs',
        href: '/docs'
    },
    {
        name: 'Projects',
        href: '/projects'
    },
    {
        name: 'About',
        href: '/about'
    }
]

export function Navbar() {
    const [top, setTop] = useState(true);
    useEffect(() => {
        const scrollHandler = () => {
            window.scrollY > 10 ? setTop(false) : setTop(true)
        };
        window.addEventListener('scroll', scrollHandler);
        return () => window.removeEventListener('scroll', scrollHandler);
    }, [top]);
    const pathname = usePathname();
    return (
    <nav className= {`sticky top-0 left-0 z-20 ${!top && `bg-white shadow-lg`} max-w-7xl mx-auto px-4 md:px-8 py-2 grid grid-cols-12`}>
        <div className="col-span-6 flex md:col-span-3">
            <Link href="/">
                
                <h1 className="text-3xl font-bold text-blue-950">
                    BIM<span className="text-blue-400 italic text-2xl">formative</span>
                </h1>
            </Link>
        </div>
        <div className="hidden sm:flex justify-center items-center col-span-6">
            <NavigationMenu>
                <NavigationMenuList>
                    {navigationItems.map((item,index) => (
                        <NavigationMenuItem key={index}>
                            <Link href={item.href} legacyBehavior passHref>
                            <NavigationMenuLink 
                            active={pathname == item.href}
                            className={navigationMenuTriggerStyle()}>
                                {item.name}
                            </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                    ))}
                </NavigationMenuList>
            </NavigationMenu>
        </div>

        <div className="flex items-center justify-end md:col-span-3 col-span-6">
            <a href="/" className="rounded-md px-3.5 py-2 m-1 overflow-hidden relative group cursor-pointer border-2 font-medium border-primary text-primary hidden sm:block">
            <span className="absolute w-64 h-0 transition-all duration-300 origin-center rotate-45 -translate-x-20 bg-primary top-1/2 group-hover:h-64 group-hover:-translate-y-32 ease"></span>
            <span className="relative text-primary transition duration-300 group-hover:text-white ease">Contact Us</span>
            </a>
            <div className="sm:hidden">
                <MobileMenu />
            </div>              
        </div>
    </nav>
    )
}