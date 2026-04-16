import Image from "next/image";
import { SimpleBlogCard, tag } from "../../lib/interface";
import { urlFor } from "../../lib/sanity";
import Link from "next/link";
import { Metadata } from "next";
import NewsletterSignup from "../../components/NewsletterSignup";
import { Card, CardContent } from "@/components/ui/card";
import BlogPostCard from "../../components/BlogPostCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import TagMenu from "../../components/TagMenu";
import { PageBanner } from "../../components/PageBanner";
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
        <section className="mx-auto w-full max-w-7xl px-4 md:px-8">
            <PageBanner title="Blog" description="Insights, Updates, and Guides on BIM for Infrastructure" />

            {/* Tags */}
            <div className="mt-6">
                <TagMenu allTags={allTags} />
            </div>

            {/* Featured Post */}
            {featuredPost && (
                <div className="mt-10">
                    <Card className="overflow-hidden border-white/10 bg-gray-100/80 dark:bg-white/5">
                        <CardContent className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2 md:p-10">

                            {/* Text */}
                            <div className="flex flex-col justify-center">
                                <p className="text-sm uppercase tracking-[0.2em] text-cyan-500">
                                    Featured
                                </p>

                                <Link href={`/blog/${featuredPost.slug}`}>
                                    <h2 className="mt-3 text-2xl font-semibold tracking-tight hover:underline sm:text-3xl">
                                        {featuredPost.title}
                                    </h2>
                                </Link>

                                <p className="mt-4 text-sm leading-7 text-muted-foreground line-clamp-3">
                                    {featuredPost.smallDescription}
                                </p>

                                <div className="mt-6">
                                    <Button asChild>
                                        <Link href={`/blog/${featuredPost.slug}`}>
                                            Read article <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </div>
                            </div>

                            {/* Image */}
                            <Link href={`/blog/${featuredPost.slug}`}>
                                <div className="relative h-[220px] w-full overflow-hidden rounded-xl border border-white/10 md:h-[320px]">
                                    <Image 
                                        src={urlFor(featuredPost.titleImage).url()}
                                        alt={featuredPost.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        className="object-cover transition-transform duration-500 hover:scale-105"
                                    />
                                </div>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Blog Grid */}
            <div className="mt-12 mb-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {data.map((post, idx) => (
                    <BlogPostCard key={idx} post={post} idx={idx} />
                ))}
            </div>

            {/* Bottom CTA */}
            <div className="mb-16 rounded-2xl border border-white/10 bg-gray-100/80 p-8 text-center dark:bg-white/5">
                <h3 className="text-2xl font-semibold">
                    Looking for practical BIM workflows?
                </h3>
                <p className="mt-3 text-muted-foreground">
                    Explore scripts, automation tools, and real implementations on BIMformative
                </p>

                <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                    <Button asChild>
                        <Link href="/resources/dynamo-scripts">Explore Scripts</Link>
                    </Button>

                    <Button asChild variant={"outline"}>
                        <Link href="/download-extension">Download Extension</Link>
                    </Button>
                </div>
            </div>
        </section>       
    );
}