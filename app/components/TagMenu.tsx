"use client";
import Link from "next/link";
import { tag } from "../lib/interface";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import React from "react";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useRouter } from "next/navigation";

interface TagMenuProps {
    allTags: tag[];
}

export default function TagMenu({ allTags }: TagMenuProps) {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState("");
    const router = useRouter();
    return (
        <div>
            <div className="mt-5 lg:inline-flex hidden">
                { allTags.map((item, index) => (
                    <div key={index} className="py-2">
                        <Link href={item.slug} className="block text-slate-600 py-1 hover:text-primary focus:text-slate-500 text-md mr-5">
                            {item.name}
                        </Link>
                    </div>
                ))}
            </div>
            <div className="sm:hidden mt-5">
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-[200px] justify-between">
                                {value 
                                ? allTags.find((tag) => tag.slug === value)?.name
                                : "Select tag..."}
                                <ChevronsUpDown className="opacity-50" />
                            </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                        <Command>
                            <CommandInput placeholder="Search tag..." />
                            <CommandList>
                                <CommandEmpty>No tag found.</CommandEmpty>
                                <CommandGroup>
                                    {allTags.map((tag) => (
                                        <CommandItem
                                            key={tag.slug}
                                            value={tag.slug}
                                            onSelect={(currentSlug) => {
                                                setValue((currentSlug === value ? "" : currentSlug ));
                                                setOpen(false);
                                                if (currentSlug) {
                                                    router.push(currentSlug);
                                                }
                                            }}>
                                                {tag.name}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>

                    </PopoverContent>

                </Popover>
            </div>

        </div>
        
    )
}