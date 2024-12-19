import Image from "next/image";
import { simpleBlogCard, tag } from "../lib/interface";
import { client, urlFor } from "../lib/sanity";
import Link from "next/link";
import DateComponent from "../components/Date";
import { Metadata } from "next";
import cube from "@/public/cube-cover.png";
import { capitalizeWords } from "../lib/utils";
import NewsletterSignup from "../components/NewsletterSignup";
import { Skeleton } from "@/components/ui/skeleton";
import { Container } from "postcss";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import BlogPostCard from "../components/BlogPostCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import TagMenu from "../components/TagMenu";
import { PageBanner } from "../components/PageBanner";
import Blogs from "../components/Blogs";

export const revalidate = 30;  //revalidate at most 30 seconds

export const metadata: Metadata = {
    title : "Blog"
}

async function getData(onlyFeatured: boolean = false) {
    const query = `
  *[_type == 'blog' ${onlyFeatured ? "&& featured == true": ""}] | order(_createdAt desc) {
  title,
    smallDescription,
    "currentSlug": slug.current,
    titleImage,
    date,
    featured,
    "author": author->{"name": coalesce(name, "Anonymous"), picture},
    "tags": coalesce(tags, ["Untagged"]),
  }`;

  const data = await client.fetch(query);

  return data;
}

async function getBlogs(tagName?: string, onlyFeatured: boolean = false) {
    const query = tagName
    ? `*[_type == 'blog' && "${tagName}" in tags[]->slug.current ${onlyFeatured ? "&& featured == true" : ""}] | order(_createdAt desc) {
    title,
    smallDescription,
    "currentSlug": slug.current,
    titleImage,
    date,
    featured,
    "author": author->{"name": coalesce(name, "Anonymous"), picture},
    "tags": coalesce(tags[]->name, ["Untagged"]),}`
    : `*[_type == 'blog' ${onlyFeatured ? "&& featured == true": ""}] | order(_createdAt desc) {
    title,
    smallDescription,
    "currentSlug": slug.current,
    titleImage,
    date,
    featured,
    "author": author->{"name": coalesce(name, "Anonymous"), picture},
    "tags": coalesce(tags[]->name, ["Untagged"]),}`;

    const blogs = await client.fetch(query);
    return blogs;
}

async function getAllTags() {
    const query = `
        *[_type == "tag"] {
        name,
        slug,
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

export default async function BlogPage() {
    const data: simpleBlogCard[] = await getData();
    const allTags: tag[] = await getAllTags();
    const featuredPosts = await getData(true);
    const featuredPost = featuredPosts[0];
    
    return (
        <section className="mt-10 mx-auto">
            <div className="max-w-7xl w-full px-4 md:px-8 mx-auto">
                <PageBanner imageSrc={cube} title="Blog" description="Insights, Updates, and Guides on BIM for Infrastructure" />
                <TagMenu allTags={allTags} />
                <div className="mt-10">
                    <Card className="bg-gray-100 dark:bg-black">                    
                        <CardContent className="w-full p-10 grid grid-cols-1 md:grid-cols-2 mx-auto gap-4">
                            <div className="flex flex-col h-[300px] justify-center gap-12">
                                <Link href={`/blog/${featuredPost.currentSlug}`}>
                                    <div className="font-bold text-3xl md:w-[400px] w-[300px] hover:underline">
                                        {featuredPost.title}
                                    </div>
                                </Link>                            
                                <div className="md:w-[400px] w-[300px] line-clamp-2">
                                    {featuredPost.smallDescription}
                                </div>
                                <Button className="w-40" asChild>
                                    <Link href={`/blog/${featuredPost.currentSlug}`} className="hover:underline">
                                        Read More <ArrowRight />
                                    </Link>
                                </Button>
                            </div>
                            <Link href={`/blog/${featuredPost.currentSlug}`}>
                                <div className="md:col-start-2 col-start-1 mt-10 md:mt-0 d-block w-full h-[200px] md:h-[300px] border border-gray-300 dark:border-stone-900 drop-shadow-sm bg-white content-center">
                                    <Image src= {urlFor(featuredPost.titleImage).url()}
                                    alt="image"
                                    fill={true}
                                    className="mx-auto w-auto h-auto object-contain hover:opacity-50"/>
                                </div>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>            
            <div>
                <NewsletterSignup />
            </div>             
            <div className="max-w-7xl mx-auto mt-10 mb-16 grid grid-cols-1 gap-y-10 md:grid-cols-3 md:gap-x-16 md:gap-y-10 lg:gap-x-10 content-center">
                {data.map((post, idx) => (
                    <BlogPostCard key={idx} post={post} idx={idx} />
                ))}
            </div>   
        </section>        
    );
}