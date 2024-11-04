import Image from "next/image";
import { simpleBlogCard } from "../lib/interface";
import { client, urlFor } from "../lib/sanity";
import Link from "next/link";
import DateComponent from "../components/Date";

export const revalidate = 30;  //revalidate at most 30 seconds

async function getData() {
    const query = `
  *[_type == 'blog'] | order(_createdAt desc) {
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

export default async function BlogPage() {
    const data: simpleBlogCard[] = await getData();
    return (
        <section className="max-w-7xl w-full px-4 md:px-8 mx-auto">
            <h1>
                <span className="block text-center font-bold text-3xl tracking-wide text-blue-950 dark:text-blue-400">Blog</span>
            </h1>
            <div className="mt-5 mb-16 grid grid-cols-1 gap-y-20 md:grid-cols-3 md:gap-x-16 md:gap-y-32 lg:gap-x-10 mx-auto"> 
                {data.map((post, idx) => (
                    <article key={idx}>
                        <Link href={`/blog/${post.currentSlug}`} className="group mb-5 block">
                            <Image src= {urlFor(post.titleImage).url()}
                            alt="image"
                            width={500}
                            height={500}
                            className="rounded-sm object-cover h-[200px] w-[400px] border border-gray-300 drop-shadow-md hover:opacity-50"
                            priority />
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
                    </article>
                ))}
            </div>
        </section>        
    );
}