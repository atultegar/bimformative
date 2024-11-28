// "use client";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { navigationItems } from "./Navbar";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function MobileMenu() {
    const location = usePathname();
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                    <Menu className="h-4 w-4"/>
                </Button>
            </SheetTrigger>
            <SheetContent>
                <div className="mt-5 flex px-2 space-y-1 flex-col">
                {navigationItems.map((item, index) => (
                    <div key={index} className="flex flex-col">
                        {item.submenu ? (
                            <div>
                                <div className="group flex items-center px-2 py-2 text-md font-semibold rounded-md hover:bg-muted hover:bg-opacity-75 cursor-pointer"
                                    onClick={() => setOpenIndex(openIndex === index? null: index)}>
                                        {item.name}
                                </div> 
                                {openIndex === index && (
                                <div className="ml-4 mt-2 space-y-1">
                                    {item.submenu.map((subItem, subIndex) => (
                                        <Link
                                        key={subIndex}
                                        href={subItem.href}
                                        className={cn(
                                            location === subItem.href
                                            ? "bg-muted"
                                            : "hover:bg-muted hover:bg-opacity-75",
                                            "group flex items-center px-2 py-1 text-sm font-semibold rounded-md"
                                        )}
                                        >
                                        {subItem.name}
                                        </Link>
                                    ))}
                                </div>
                            )}                               
                            </div>
                        ): <Link 
                            href={item.href}
                            className={cn(
                            location === item.href
                            ? "bg-muted"
                            : "hover:bg-muted hover:bg-opacity-75",
                            "group flex items-center px-2 py-2 text-md font-semibold rounded-md"
                        )}>
                            {item.name}
                        </Link>}
                    
                    </div>
                ))}
                </div>
                <SheetFooter className="mt-5">
                <SheetClose asChild>
                    <Button type="submit">Close</Button>
                </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}