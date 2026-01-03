import Image from "next/image";
import { SimpleBlogCard, tag } from "../lib/interface";
import { urlFor } from "../lib/sanity";
import Link from "next/link";
import { Metadata } from "next";
import cube from "@/public/cube-cover.png";
import NewsletterSignup from "../components/NewsletterSignup";
import { Card, CardContent } from "@/components/ui/card";
import BlogPostCard from "../components/BlogPostCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import TagMenu from "../components/TagMenu";
import { PageBanner } from "../components/PageBanner";
import { getBlogs, getAllTags } from "@/lib/services/sanity.service";

export const revalidate = 30;  //revalidate at most 30 seconds

export const metadata: Metadata = {
    title : "Blog"
}

export default async function BlogPage() {
    const data: SimpleBlogCard[] = await getBlogs();
    const allTags: tag[] = await getAllTags();
    const featuredPosts = await getBlogs(true);
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
                                <Link href={`/blog/${featuredPost ? featuredPost.slug : ""}`}>
                                    <div className="font-bold text-3xl md:w-[400px] w-[300px] hover:underline">
                                        {featuredPost.title}
                                    </div>
                                </Link>                            
                                <div className="md:w-[400px] w-[300px] line-clamp-2">
                                    {featuredPost.smallDescription}
                                </div>
                                <Button className="w-40" asChild>
                                    <Link href={`/blog/${featuredPost ? featuredPost.slug : ""}`} className="hover:underline">
                                        Read More <ArrowRight />
                                    </Link>
                                </Button>
                            </div>
                            <Link href={`/blog/${featuredPost.slug}`}>
                                <div className="md:col-start-2 col-start-1 mt-10 md:mt-0 block w-full h-[200px] md:h-[300px] border border-gray-300 dark:border-stone-900 drop-shadow-sm bg-white content-center">
                                    <Image src= {urlFor(featuredPost.titleImage).url()}
                                    alt="image"
                                    fill={true}
                                    className="mx-auto w-auto h-auto object-cover transition-transform hover:scale-105"/>
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