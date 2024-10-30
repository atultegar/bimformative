
import Image from "next/image";
import { fullBlog } from "../../lib/interface";
import { client, urlFor } from "../../lib/sanity";
import { PortableText } from "@portabletext/react";
import React from 'react';
import { YouTubePlayer } from "@/app/components/YouTubePlayer";

interface BlogArticleProps {
    params: {
        slug: string;
    };
}


export const revalidate = 30; // revalidate at most 30 seconds

async function getData(slug: string){
    const query = `
        *[_type == "blog" && slug.current=='${slug}'] {
        "currentSlug": slug.current,
            title,
            content,
            titleImage
        }[0]`;

    const data = await client.fetch(query)

    return data;
}

const serializers = {
    types: {
        youtube: ({ value }: { value: {url:string}}) => {
            const {url} = value;
            return <YouTubePlayer url={url} />;
        }
    }
}

export default async function BlogArticle({params}: {params: {slug: string}}) {
    const data: fullBlog = await getData(params.slug);
    

    return (
        <div className="mt-8 max-w-7xl w-full px-4 md:px-8 mx-auto">
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

            <div className="mt-10 max-w-4xl mx-auto prose prose-blue prose-lg dark:prose-invert prose-li:marker:text-primary prose-a:text-primary">
                <PortableText value={data.content} components={serializers}/>
            </div>
        </div>
    )
}