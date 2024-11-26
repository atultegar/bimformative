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
        <article key={idx}>
            <Link href={`/blog/${post.currentSlug}`} className="group mb-5 block mx-auto">
                <div className="d-block w-full h-[250px] border border-gray-300 dark:border-stone-900 drop-shadow-sm bg-white content-center">
                    <Image src= {urlFor(post.titleImage).url()}
                    alt="image"
                    fill={true}
                    className="mx-auto w-auto h-auto object-contain hover:opacity-50"
                    priority />
                </div>                
            </Link>
            <h3 className="text-balance mb-2 text-lg font-semibold leading-snug">
                <Link href={`/blog/${post.currentSlug}`} className="hover:underline">
                    {post.title}
                </Link>
            </h3>
            <div className="text-sm text-gray-600 dark:text-gray-300">
                <DateComponent dateString={post.date} />
            </div>
            <p className="line-clamp-2 text-sm mt-2 text-gray-600 dark:text-gray-300">
                {post.smallDescription}
            </p>                        
        </article>
    )
}

export default BlogPostCard;