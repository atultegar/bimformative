"use client";
import Link from "next/link";
import { tag } from "../lib/interface";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import React from "react";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface TagMenuProps {
    allTags: tag[];
}

export default function TagMenu({ allTags }: TagMenuProps) {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState("");
    const router = useRouter();
    const pathname = usePathname();

    const activeTag = allTags.find((t) => pathname.includes(t.slug));

    return (
        <div className="mt-6">

            {/* Desktop Tag Pills */}
            <div className="hidden flex-wrap gap-3 sm:flex">
                { allTags.map((item) => {
                    const isActive = pathname.includes(item.slug);

                    return (
                        <Link
                            key={item.slug}
                            href={item.slug}
                            className={cn(
                                "rounded-full border px-4 py-1.5 text-sm transition-all",
                                "border-white/10 bg-white/40 text-slate-700 hover:border-cyan-400/30 hover:text-cyan-500",
                                "dark:bg-black/20 dark:text-slate-300",
                                isActive && 
                                    "border-cyan-400/40 bg-cyan-500/10 text-cyan-400"
                            )}    
                        >
                            {item.name}
                        </Link>
                    );
                })}
            </div>

            {/* Mobile Dropdown */}
            <div className="sm:hidden">
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-full justify-between"
                        >
                            {activeTag ? activeTag.name : "Select tag"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                        </Button>
                    </PopoverTrigger>

                    <PopoverContent className="w-full p-0">
                        <Command>
                            <CommandInput placeholder="Search tag..." />

                            <CommandList>
                                <CommandEmpty>No tag found.</CommandEmpty>

                                <CommandGroup>
                                    {allTags.map((tag) => {
                                        const isSelected = pathname.includes(tag.slug);
                                        
                                        return (
                                        <CommandItem
                                            key={tag.slug}
                                            value={tag.slug}
                                            onSelect={() => {
                                                setOpen(false);
                                                router.push(tag.slug);
                                            }}
                                        >
                                            {tag.name}
                                            <Check className={cn(
                                                "ml-auto h-4 w-4",
                                                isSelected ? "opacity-100" : "opacity-0"
                                                )} 
                                            />
                                        </CommandItem>
                                        );
                                    })}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>                
        </div>        
    );
}