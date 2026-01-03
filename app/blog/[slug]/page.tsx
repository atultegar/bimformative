
import Image from "next/image";
import { FullBlog, SimpleBlogCard } from "../../lib/interface";
import { client, urlFor } from "../../lib/sanity";
import { PortableText } from "@portabletext/react";
import React from 'react';
import { YouTubePlayer } from "@/app/components/YouTubePlayer";
import DateComponent from "@/app/components/Date";
import Link from "next/link";
import CodeBlock from "@/app/components/CodeBlock";
import { Metadata } from "next";
import SocialShare from "@/app/components/SocialShare";
import { getBlogs, getBlogBySlug } from "@/lib/services/sanity.service";


export const revalidate = 30; // revalidate at most 30 seconds

interface BlogArticleProps {
    params: Promise<{ slug: string}>;
}

export async function generateMetadata({params}: BlogArticleProps): Promise<Metadata> {
    const { slug } = await params;
    const data: FullBlog = await getBlogBySlug(slug);
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
    const blogs: SimpleBlogCard[] = await getBlogs();

    return blogs.map((blog) => ({
        slug: blog.slug,
    }))
}

export default async function BlogArticle({params}: BlogArticleProps) {    
    const { slug } = await params;
    const data: FullBlog = await getBlogBySlug(slug);
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
            <SocialShare url={data.slug} title={data.title} />
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