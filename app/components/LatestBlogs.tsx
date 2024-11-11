import React from "react";
import Link from "next/link";
import { client, urlFor } from "../lib/sanity";
import { simpleBlogCard } from "../lib/interface";
import Image from "next/image";

const blogs = [
    { title: 'Understanding BIM for Infrastructure', link: '/blog/bim-infra'},
    { title: 'Top Dynamo Scripts for Engineers', link: '/blog/dynamo-scripts'},
];

export const revalidate = 30;  //revalidate at most 30 seconds

async function getData() {
    const query = `
  *[_type == 'blog'] | order(_createdAt desc) [0..1] {
  title,
    smallDescription,
    "currentSlug": slug.current,
    titleImage,
    date,
    "author": author->{"name": coalesce(name, "Anonymous"), picture},
  }`;

  const data = await client.fetch(query);

  return data;
}

export default async function LatestBlogs() {
    const data: simpleBlogCard[] = await getData();
    return (
        <section className="max-w-7xl mx-auto mt-10 py-16 bg-gray-100 dark:bg-black">
            <h2 className="text-center text-3xl font-semibold">Latest Blogs</h2>
            <div className="flex mt-8 max-w-4xl gap-6 mx-auto items-center justify-between">
                {data.map((post, index) => (
                    <article key={index}>
                        <Link key={index} href={`/blog/${post.currentSlug}`} className="hover:underline">
                        <Image src= {urlFor(post.titleImage).url()}
                            alt="image"
                            width={400}
                            height={200}
                            className="rounded-sm object-cover w-[400px] h-[200px] border border-gray-300 drop-shadow-md hover:opacity-50"
                            priority />
                        </Link>
                        <h3 className="text-balance text-center mt-2 text-lg font-semibold leading-snug">
                            <Link href={`/blog/${post.currentSlug}`} className="hover:underline">
                                {post.title}
                            </Link>
                        </h3>
                    </article>
                ))}
            </div>
        </section>
    );
}