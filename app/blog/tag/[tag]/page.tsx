import Image from "next/image";
import { simpleBlogCard, tag } from "@/app/lib/interface";
import { client, urlFor } from "@/app/lib/sanity";
import Link from "next/link";
import DateComponent from "@/app/components/Date";
import { Metadata } from "next";
import cube from "@/public/cube-cover.png";
import { Badge } from "@/components/ui/badge";

export const revalidate = 30;  //revalidate at most 30 seconds

export const metadata: Metadata = {
    title : "Blog"
}

async function getBlogsByTag(tag?: string) {
    const query = `*[_type == 'blog' && "${tag}" in tags[]->slug.current] | order(_createdAt desc) {
    title,
    smallDescription,
    "currentSlug": slug.current,
    titleImage,
    date,
    "author": author->{"name": coalesce(name, "Anonymous"), picture},
    "tags": tags[]->name }`;

    return client.fetch(query);
}

async function getAllTags() {
    const query = `
        *[_type == "tag"] {
        name,
        slug { current },
        _id,
        "postCount": count(*[_type == "blog" && references("tags", ^._id)])
        }`;
    
    const tags = await client.fetch(query);

    // Prepend the "All" tag to the array
    const allTags = [
        {
            name: "All",
            slug: "/blog",
            _id: "all",
            postCount: tags.reduce((total: number, tag: { postCount: number}) => total + tag.postCount, 0),
        },
        ...tags.map((t: { name: string; slug: {current: string}; _id: string; postCount: number}) => ({
            ...t,
            slug: `/blog/tag/${t.slug.current}`,
        })),
    ];

    return allTags;
}

interface TagPageProps {
    params: Promise<{ tag: string }>;
}

export async function generateStaticParams() {
    const allTags: tag[] = await getAllTags();

    return allTags.map((tag) => ({
        tag: tag.slug,
    }))    
}

export default async function TagPage({ params }: TagPageProps): Promise<JSX.Element> {
    const resolvedParams = await params;
    const { tag } = resolvedParams;
    const data: simpleBlogCard[] = await getBlogsByTag(tag);
    const allTags: tag[] = await getAllTags();
    
    return (
        <section className="mt-10 max-w-7xl w-full px-4 md:px-8 mx-auto min-h-[900px]">
            <div className="relative text-left h-[300px] bg-gray-100 dark:bg-black">
                <Image src={cube} alt="blogcover" className="d-block h-[300px] object-cover" />
                <h1 className="absolute top-0 left-0 mt-10 text-4xl lg:text-6xl font-semibold text-black dark:text-white mx-10 max-w-xl">
                    Blog
                </h1>
                <p className="absolute top-20 left-11 mt-40 max-w-md text-gray-900 dark:text-gray-400">
                Insights, Updates, and Guides on BIM for Infrastructure
                </p>
            </div>
            <hr className="h-px my-1 bg-gray-300 border-0 dark:bg-gray-800"></hr>
            <div className="mt-10 lg:inline-flex">
                {allTags.map((item, index) => (
                    <div key={index} className="py-2">
                        <Link href={item.slug} className="block text-slate-600 py-1 hover:text-primary focus:text-slate-500 text-md mr-5">
                            {item.name}
                        </Link>
                    </div>
                ))}
            </div>
            <div className="mt-10">
                <h1 className="text-3xl font-light">
                    {data.length} results found for <span className="text-primary">{tag}</span>
                </h1>
            </div>                        
            <div className="mt-10 mb-16 grid grid-cols-1 gap-y-20 md:grid-cols-3 md:gap-x-16 md:gap-y-20 lg:gap-x-10 content-center">
                {data.map((post, idx) => (
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
                        <div>
                            {post.tags.map((t, idx) => (
                                <Badge key={idx} variant="outline" className="p-2 mr-2">{t}</Badge>
                            ))}
                        </div>                        
                    </article>
                ))}
            </div>
            
        </section>        
    );
}