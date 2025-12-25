import React from "react";
import Link from "next/link";
import { client, urlFor } from "../lib/sanity";
import { SimpleBlogCard } from "../lib/interface";
import Image from "next/image";
import { getLatestBlogs } from "@/lib/services/sanity.service";

export const revalidate = 30;  //revalidate at most 30 seconds

export default async function LatestBlogs() {
    const blogs: SimpleBlogCard[] = await getLatestBlogs();

    if (!blogs?.length) return null;
    return (
        <section className="max-w-7xl mx-auto mt-10 py-16 px-4">
            <h2 className="text-center text-3xl font-semibold">
                Latest Blogs
            </h2>

            <div className="mt-10 grid gap-8 sm:grid-cols-2 max-w-4xl mx-auto">
                {blogs.map((post) => (
                    <article 
                        key={post.slug} 
                        className="flex flex-col items-center text-center"
                    >
                        <Link 
                            href={`/blog/${post.slug}`} 
                            className="group w-full"
                        >
                            <div className="relative w-full h-[250px] aspect-[16/9] overflow-hidden rounded-lg border bg-muted">
                                <Image 
                                    src= {urlFor(post.titleImage).url()}
                                    alt={post.title}
                                    fill
                                    className="object-cover transition-opacity group-hover:opacity-50"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    priority
                                />
                            </div>
                        </Link>

                        <h3 className="mt-4 text-lg font-semibold leading-sung">
                            <Link 
                                href={`/blog/${post.slug}`} 
                                className="hover:underline"
                            >
                                {post.title}
                            </Link>
                        </h3>
                    </article>
                ))}
            </div>
        </section>
    );
}