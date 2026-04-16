"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import DateComponent from "./Date";
import { SimpleBlogCard } from "../lib/interface"
import { urlFor } from "../lib/sanity";
import { ArrowUpRight } from "lucide-react";

interface BlogPostCardProps {
    post: SimpleBlogCard;
    idx: number;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post }) => {
    return (
        <article className="group relative overflow-hidden rounded-xl border border-white/10 bg-gray-100/80 transition-all duration-300 hover:border-cyan-400/30 hover:bg-gray-200/60 dark:bg-white/5 dark:hover:bg-white/10">
            
            <Link href={`/blog/${post.slug}`} className="block">

                {/* Image */}
                <div className="relative h-44 w-full overflow-hidden">
                    <Image 
                        src= {urlFor(post.titleImage).url()}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* subtle overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-70" />
                </div>

                {/* Content */}
                <div className="p-5">

                    {/* Title */}
                    <h3 className="text-lg font-semibold leading-snug tracking-tight text-gray-900 transition-colors group-hover:text-primary dark:text-gray-200">
                        {post.title}
                    </h3>

                    {/* Description                     */}
                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">
                        {post.smallDescription}
                    </p>

                    {/* Meta */}
                    <div className="mt-5 flex items-center justify-between text-sm text-muted-foreground">

                        {/* Left: Author (light) */}
                        <div className="flex items-center gap-2">
                            <div className="relative h-7 w-7 overflow-hidden rounded-full border border-white/10">
                                <Image
                                    src={post.author.pictureurl ?? ""}
                                    alt={post.author.name ?? ""}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <span className="text-xs">{post.author.name}</span>
                        </div>

                        {/* Right: Date */}
                        <div className="flex items-center gap-2">
                            <DateComponent dateString={post.date} />
                            <ArrowUpRight className="h-4 w-4 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
                        </div>
                    </div>                    
                </div>            
            </Link>                 
        </article>
    );
};

export default BlogPostCard;