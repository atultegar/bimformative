
import Image from "next/image";
import { fullBlog, simpleBlogCard } from "../../lib/interface";
import { client, urlFor } from "../../lib/sanity";
import { PortableText } from "@portabletext/react";
import React from 'react';
import { YouTubePlayer } from "@/app/components/YouTubePlayer";
import DateComponent from "@/app/components/Date";
import Link from "next/link";
import CodeBlock from "@/app/components/CodeBlock";
import { Metadata } from "next";
import SocialShare from "@/app/components/SocialShare";


export const revalidate = 30; // revalidate at most 30 seconds

interface BlogArticleProps {
    params: Promise<{ slug: string}>;
}

export async function generateMetadata({params}: BlogArticleProps): Promise<Metadata> {
    const { slug } = await params;
    const data: fullBlog = await getData(slug);
    return {
        title: data.title,
        description: data.smallDescription,
        openGraph: {
            images: [
                {
                    url: urlFor(data.titleImage).url()
                }
            ]
        }
    }
}

async function getData(slug: string){
    const query = `
        *[_type == "blog" && slug.current=='${slug}'] {
        "currentSlug": slug.current,
            title,
            content,
            titleImage,
            date,
            "tags": coalesce(tags, ["untagged"]),
            smallDescription,
        }[0]`;

    const data = await client.fetch(query)

    return data;
}

const serializers = {
    types: {
        youtube: ({ value }: { value: {url:string}}) => {
            const {url} = value;
            return <YouTubePlayer url={url} />;
        },
        code: ({ value }: {value: {code: string; language: string}}) => {
            return (
                <CodeBlock title="code" code={value.code} language={value.language} />       
            );
        },
    },
};

export async function generateStaticParams() {
    const query = `
        *[_type == 'blog'] | order(_createdAt desc) {
        title,
            smallDescription,
            "currentSlug": slug.current,
            titleImage,
            date,
            "author": author->{"name": coalesce(name, "Anonymous"), picture},
            "tags": coalesce(tags, ["Untagged"]),
        }`;

    const blogs: simpleBlogCard[] = await client.fetch(query);

    return blogs.map((blog) => ({
        slug: blog.currentSlug,
    }))
}

export default async function BlogArticle({params}: BlogArticleProps) {    
    const { slug } = await params;
    const data: fullBlog = await getData(slug);    
    return (
        <div className="mt-8 max-w-3xl w-full px-4 md:px-8 mx-auto">
            <div className="max-w-4xl mx-auto flex justify-between items-center mb-5">
                <div className="text-gray-400">
                    <DateComponent dateString={data.date} />
                </div>
                <Link href="/blog" className="flex items-center self-end text-right cursor-pointer hover:text-gray-500">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-4 h-4 mr-1"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12l7.5-7.5M3 12h18" />
                </svg>
                    <p className="cursor-pointer">Back</p>
                </Link>
            </div>
            
            
            <h1>                
                <span className="mt-2 block text-3xl text-center leading-8 font-bold tracking-tight sm:text-4xl">
                    {data.title}
                </span>
            </h1>
            <div style={{
                display: "flex",
                justifyContent: "center",
                }}>
                    <Image
                    src={urlFor(data.titleImage).url()}
                    width={500}
                    height={500}
                    alt="Title Image"
                    priority
                    className="mt-8 border"
                    style={{objectPosition: "center"}}
                    />
            </div>
            <SocialShare url={data.currentSlug} title={data.title} />
            {/* <div className="mt-5 max-w-4xl mx-auto flex flex-wrap gap-2">
                {data.tags.map((tagItem, index) => (
                    <Badge
                    key={index}>
                        {tagItem}
                    </Badge>
                ))}
            </div>             */}

            <div className="mt-10 max-w-4xl mx-auto prose prose-blue prose-lg dark:prose-invert prose-li:marker:text-primary prose-a:text-primary">
                <PortableText value={data.content} components={serializers}/>
            </div>
        </div>
    )
}