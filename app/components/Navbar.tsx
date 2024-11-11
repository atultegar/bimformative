"use client";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu"
import Link from "next/link"
import { usePathname } from "next/navigation";
import { MobileMenu } from "./MobileMenu";
import { useEffect, useState } from "react";
import * as React from "react";
import { cn } from "@/lib/utils"
import { ModeToggle } from "./ModeToggle";
import { Charm } from "next/font/google";
import Image from "next/image";
import logoLight from "../../public/logo-light-2.png"
import logoDark from "../../public/logo-dark-2.png"

const charm = Charm({ weight: "700", subsets: ["latin"]});

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
        name: 'Resources',
        href: '/resources',
        submenu : [
            { name: "Dynamo Scripts", href: '/resources/dynamo-scripts', description: "Downloadable Dynamo scripts"},
            { name: "C# Snippets", href: '/resources/csharp-snippets', description: "C# code for BIM development"},
            { name: "Python Scripts", href: '/resources/python-scripts', description: "Python scripts for BIM applications"},
            { name: "Video Tutorials", href: '/resources/video-tutorials', description: "In-depth video tutorials"},
            { name: "Other Assets", href: '/resources/other-assets', description: "Other assets for BIM"},
        ]
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
    <nav className= {`sticky top-0 left-0 z-20 ${!top && `bg-white dark:bg-black`} w-full shadow-sm dark:shadow-stone-900`}>
        <div className="max-w-7xl grid grid-cols-12 mx-auto px-4 md:px-8 py-2">
            <div className="col-span-6 flex md:col-span-3">
                <Link href="/">                
                    {/* <h1 className="text-4xl font-bold text-blue-950 dark:text-white">
                        BIM<span className={`text-blue-400 font-bold italic text-3xl ${charm.className}`}>formative</span>
                    </h1> */}
                    {/* Light mode logo */}
                    <Image src={logoLight} width={250} height={80} alt="logo" className="block dark:hidden"/>
                    {/* Dark mode logo */}
                    <Image src={logoDark} width={250} height={80} alt="logo" className="hidden dark:block"/>
                </Link>
            </div>
                <div className="hidden sm:flex justify-center items-center col-span-6">
                <NavigationMenu>
                    <NavigationMenuList>
                        {navigationItems.map((item,index) => (
                            <NavigationMenuItem key={index}>                            
                                {item.submenu ? (
                                    <div>
                                        <NavigationMenuTrigger>{item.name}</NavigationMenuTrigger>
                                        <NavigationMenuContent>
                                            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                                                {item.submenu.map((subItem, subIndex) => (
                                                    <ListItem
                                                    key={subIndex}
                                                    title={subItem.name}
                                                    href={subItem.href}>
                                                        {subItem.description}
                                                    </ListItem>
                                                ))}
                                            </ul>
                                        </NavigationMenuContent>
                                    </div>
                                    // <div>
                                    //     {item.submenu.map((subItem, subIndex) => (
                                    //         <Link href={subItem.href} key={subIndex} legacyBehavior passHref>
                                    //             <a>{subItem.name}</a>
                                    //         </Link>
                                    //     ))}
                                    // </div>
                                ) : <Link href={item.href} legacyBehavior passHref>
                                        <NavigationMenuLink
                                            active={pathname == item.href}
                                            className={navigationMenuTriggerStyle()}>
                                                {item.name}
                                        </NavigationMenuLink>
                                </Link>}
                            </NavigationMenuItem>
                        ))}
                    </NavigationMenuList>
                </NavigationMenu>
            </div>

            <div className="flex items-center justify-end md:col-span-3 col-span-6">
                <a href="mailto:atul.tegar@gmail.com" className="rounded-md px-3.5 py-2 m-1 overflow-hidden relative group cursor-pointer border-2 font-medium border-primary text-primary hidden sm:block">
                    <span className="absolute w-64 h-0 transition-all duration-300 origin-center rotate-45 -translate-x-20 bg-primary top-1/2 group-hover:h-64 group-hover:-translate-y-32 ease"></span>
                    <span className="relative text-primary transition duration-300 group-hover:text-white ease">Contact Us</span>
                </a>
                <ModeToggle />
                <div className="sm:hidden">
                    <MobileMenu />
                </div>              
            </div>
        </div>        
        
    </nav>
    )
}

const ListItem = React.forwardRef<
React.ElementRef<"a">,
React.ComponentPropsWithoutRef<"a">> (
    ({ className, title, children, ...props}, ref) => {
        return (
            <li>
                <NavigationMenuLink asChild>
                    <a
                        ref = {ref}
                        className={cn(
                            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",                            
                        )}
                        {...props}>
                            <div className="text-sm font-medium leading-none">{title}</div>
                            <p className="line-clamp-1 text-sm leading-snug text-muted-foreground">
                                {children}
                            </p>
                        </a>
                </NavigationMenuLink>
            </li>
        )
    }
)
ListItem.displayName = "ListItem"