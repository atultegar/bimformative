import Image from "next/image";
import { simpleBlogCard, tag } from "../lib/interface";
import { client, urlFor } from "../lib/sanity";
import Link from "next/link";
import DateComponent from "../components/Date";
import { Metadata } from "next";
import blogCoverImage from "../../public/blog-cover-image-2.png";
import cube from "../../public/cube-cover.png";

export const revalidate = 30;  //revalidate at most 30 seconds

export const metadata: Metadata = {
    title : "Blog"
}

async function getData() {
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

  const data = await client.fetch(query);

  return data;
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

    return tags;
}

export default async function BlogPage() {
    const data: simpleBlogCard[] = await getData();
    const allTags: tag[] = await getAllTags();
    return (
        <section className="mt-10 max-w-7xl w-full px-4 md:px-8 mx-auto">
            <div className="relative text-left h-[300px] bg-gray-100 dark:bg-black">
                <Image src={cube} alt="blogcover" className="d-block h-[300px] object-cover" />
                <h1 className="absolute top-0 left-0 mt-10 text-4xl font-semibold text-black dark:text-white mx-10 max-w-xl">
                    Insights, Updates, and Guides on BIM for Infrastructure
                </h1>
            </div>
            <hr className="h-px my-1 bg-gray-200 border-0 dark:bg-gray-800"></hr>
            <div className="mt-10 flex flex-wrap max-w-7xl gap-2">
                {allTags.map((item, index) => (
                    <h3 key={index}>{item.name}</h3>
                ))}
            </div>            
            <div className="mt-10 mb-16 grid grid-cols-1 gap-y-20 md:grid-cols-3 md:gap-x-16 md:gap-y-32 lg:gap-x-10 mx-auto"> 
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