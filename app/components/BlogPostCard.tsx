import React from "react";
import Link from "next/link";
import Image from "next/image";
import DateComponent from "./Date";
import { simpleBlogCard } from "../lib/interface"
import { urlFor } from "../lib/sanity";

interface BlogPostCardProps {
    post: simpleBlogCard;
    idx: number;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post, idx }) => {
    return (
        <article key={idx} className="group relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-transparent shadow md transition-all hover:shadow-lg">
            <Link href={`/blog/${post.currentSlug}`} className="block w-full h-full">
                <div className="relative h-48 w-full overflow-hidden">
                    <Image src= {urlFor(post.titleImage).url()}
                    alt="image"
                    fill={true}
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    priority />
                </div>
                <div className="p-4">
                    <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-200">
                        {post.title}
                    </h3>                    
                    <p className="line-clamp-2 text-sm mb-4 text-gray-600 dark:text-gray-300">
                        {post.smallDescription}
                    </p>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <div className="relative size-8 overflow-hidden rounded-full">
                                <Image
                                    src={post.author.pictureurl}
                                    alt={post.author.name}
                                    fill
                                    className="object-cover"
                                    />
                            </div>
                            <p className="text-sm font-medium text-gray-700">
                                {post.author.name}
                            </p>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                            <DateComponent dateString={post.date} />
                        </div>
                    </div>                    
                </div>            
            </Link>                 
        </article>
    )
}

export default BlogPostCard;