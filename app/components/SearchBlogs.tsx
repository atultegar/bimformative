"use client";

import React, { useState } from "react";
import { SimpleBlogCard } from "../lib/interface";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import BlogPostCard from "./BlogPostCard";
import { Search } from "lucide-react";

interface SearchProps {
    blogs: SimpleBlogCard[];
}

const SearchBlogs: React.FC<SearchProps> = ({blogs}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [tempSearchTerm, setTempSearchTerm] = useState("");

    const filteredBlogs:SimpleBlogCard[] = blogs.filter(
        (blog) =>
            blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            blog.smallDescription.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            setSearchTerm(tempSearchTerm);
        }
    }

    return (
        <div className="mt-5">
            <div className="relative flex w-full max-w-xs items-center justify-self-end space-x-0 border rounded-sm hover:border-gray-900">
                <span className="absoulte inset-y-0 left-0 flex items-center pl-2">
                    <Search className="w-6 h-6" />
                </span>
                
                <Input 
                    type="search" 
                    placeholder="Search blog" 
                    value={tempSearchTerm} 
                    onChange={(e) => setTempSearchTerm(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="border-none focus:outline-none focus:ring-sky-500 bg-transparent active:ring-0 focus-within:border-transparent" />
            </div>
            <div className="mt-10 mb-16 grid grid-cols-1 gap-y-10 md:grid-cols-3 md:gap-x-16 md:gap-y-10 lg:gap-x-10 content-center">
                {filteredBlogs.length > 0 ? (
                    filteredBlogs.map((post, idx) => (
                        <BlogPostCard key={idx} post={post} idx={idx} />
                    ))
                ) : (
                    <p className="text-gray-500 text-center col-span-full">
                        No blogs found for <span className="font-semibold">{searchTerm}</span>.
                    </p>
                )}                
            </div>
        </div>
    );
};

export default SearchBlogs;