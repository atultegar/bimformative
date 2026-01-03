import { MetadataRoute } from "next";
import { ScriptSlug, SimpleBlogCard } from "./lib/interface";
import { getBlogs } from "@/lib/services/sanity.service";
import { getScriptSlugs } from "@/lib/services/scripts.service";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const blogs: SimpleBlogCard[] = await getBlogs();
    const blogUrls: MetadataRoute.Sitemap = blogs.map((blog) => ({
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/blog/${blog.slug}`,
        lastModified: new Date(blog.date),
        changeFrequency: 'never',
        priority: 1,
    }))

    const scriptSlugs: ScriptSlug[] = await getScriptSlugs();
    const scriptUrls: MetadataRoute.Sitemap = scriptSlugs.map((script) => ({
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/resources/dynamo-scripts/${script.slug}`,
        lastModified: new Date(script.updated_at),
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
        ...blogUrls,
        ...scriptUrls
    ]

}