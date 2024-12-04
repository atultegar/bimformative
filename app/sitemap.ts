import { MetadataRoute } from "next";
import { simpleBlogCard, tag } from "./lib/interface";
import { client } from "./lib/sanity";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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
    const blogUrls: MetadataRoute.Sitemap = blogs.map((blog) => ({
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/blog/${blog.currentSlug}`,
        lastModified: new Date(blog.date),
        changeFrequency: 'never',
        priority: 1,
    }))

    return [
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/about`,
            lastModified: new Date(2024,11,22),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/blog`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/docs`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/resources`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/resources/dynamo-scripts`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/resources/csharp-snippets`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/resources/python-scripts`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/resources/video-tutorials`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/resources/other-assets`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/projects`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.5,
        },
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/disclaimer`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.5,
        },
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/privacy-policy`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.5,
        },        
        ...blogUrls
    ]

}