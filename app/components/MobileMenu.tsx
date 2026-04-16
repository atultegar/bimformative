"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetTrigger } from "@/components/ui/sheet";
import { ChevronDown, Menu } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { navigationItems } from "./navbar/navigation.config";

import Image from "next/image";

import logoLight from "@/public/logo-light-2.png"
import logoDark from "@/public/logo-dark-2.png"

export function MobileMenu() {
    const pathName = usePathname();
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const navigationItemsAll = [        
        ...navigationItems.map((item) => item),
        {
            name: 'Contact Us',
            href: '/contact'            
        },
    ];

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                    <Menu className="h-4 w-4"/>
                </Button>
            </SheetTrigger>
            <SheetContent>
                <div className="mt-6 flex flex-col">
                    <div className="mb-6 border-b border-white/10 pb-4">
                        <Link href="/">
                            <Image src={logoLight} alt="BIMformative Logo" className="h-8 w-auto dark:hidden" priority />
                            <Image src={logoDark} alt="BIMformative Logo" className="h-8 w-auto hidden dark:block" priority />
                        </Link>
                        <p className="mt-2 text-sm text-gray-400">
                            Structured workflows for visual scripting and BIM automation
                        </p>
                    </div>

                    <div className="space-y-1">
                        {navigationItemsAll.map((item, index) => (
                            <div key={item.name} className="flex flex-col">
                                {item.submenu ? (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => 
                                                setOpenIndex(openIndex === index ? null : index)
                                            }
                                            className="flex items-center justify-between rounded-lg px-3 py-3 text-left text-sm font-medium text-gray-200 transition-colors hover:bg-white/5">
                                                <span>{item.name}</span>
                                                <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", openIndex === index && "rotate-180")} />
                                        </button>
                                        
                                        {openIndex === index && (
                                            <div className="ml-3 mt-1 space-y-1 border-l border-white/10 pl-3">
                                                {item.submenu.map((subItem) => (
                                                    <Link
                                                        key={subItem.href}
                                                        href={subItem.href}
                                                        className={cn(
                                                            "block rounded-md px-3 py-2 text-sm transition-colors",
                                                            pathName === subItem.href
                                                            ? "bg-muted"
                                                            : "hover:bg-muted hover:bg-opacity-75"
                                                        )}
                                                    >
                                                        <div className="font-medium">{subItem.name}</div>
                                                        <div className="mt-0.5 text-xs text-gray-500">
                                                            {subItem.description}
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        )}                               
                                    </>
                                ) : (
                                    <Link 
                                        href={item.href}
                                        className={cn(
                                            "rounded-lg px-3 py-3 text-sm fon-medium transition-colors",
                                            pathName === item.href
                                            ? "bg-muted"
                                            : "hover:bg-muted hover:bg-opacity-75"
                                        )}
                                    >
                                        {item.name}
                                    </Link>
                                )}                    
                            </div>
                        ))}
                    </div>                
                </div>
                <SheetFooter className="mt-8 border-t border-white/10 pt-6">
                    <div className="flex w-full flex-col gap-3">
                        <Button asChild className="w-full">
                            <Link href="/download-extension">Download Extension</Link>
                        </Button>

                        <SheetClose asChild>
                            <Button type="submit">Close</Button>
                        </SheetClose>
                    </div>       
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}