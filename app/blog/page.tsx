import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { simpleBlogCard } from "../lib/interface";
import { client, urlFor } from "../lib/sanity";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const revalidate = 30;  //revalidate at most 30 seconds

async function getData() {
    const query = `
  *[_type == 'blog'] | order(_createdAt desc) {
  title,
    smallDescription,
    "currentSlug": slug.current,
    titleImage,
    "updatedAt": _updatedAt,
  }`;

  const data = await client.fetch(query);

  return data;
}

export default async function BlogPage() {
    const data: simpleBlogCard[] = await getData();
    return (
        <section className="max-w-7xl w-full px-4 md:px-8 mx-auto">
            <h1>
                <span className="block text-center font-bold text-3xl tracking-wide text-blue-950">
                    BIM<span className="text-blue-400 italic text-2xl">formative</span> - Blog
                </span>                
            </h1>
            <div className="py-12 grid md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-12 grid-cols-1">
                {data.map((post, idx) => (
                    <Card key={idx}>
                        <Image src={urlFor(post.titleImage).url()}
                        alt="image"
                        width={500}
                        height={500}
                        className="rounded-sm h-[200px] object-cover" />
                        <CardContent className="mt-5">
                            <h3 className="text-lg line-clamp-2">{post.title}</h3>
                            <p className="line-clamp-2 text-sm mt-2 text-gray-600 dark:text-gray-300">
                                {post.smallDescription}
                            </p>
                            <p className="mt-2 text-muted-foreground text-sm">
                                {new Date(post.updatedAt).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric',})}
                            </p>
                            <Button asChild className="w-[100px] mt-7">
                                <Link href={`/blog/${post.currentSlug}`}>Read More</Link>
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    );
}