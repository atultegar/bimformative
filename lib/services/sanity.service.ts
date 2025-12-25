import { SimpleBlogCard } from "@/app/lib/interface";
import { client } from "@/app/lib/sanity";

// RESOURCE COUNT FROM SANITY
export async function getResourcesCount() {
    const query = `{
        "blogs": count(*[_type == "blog"]),
        "codeSnippets": count(*[_type == "codeSnippet"]),
        "docs": count(*[_type == "docs"]),
        "tutorials": count(*[_type == "videoTutorial"]),
        "otherAssets": count(*[_type == "otherassets"]),
    }`;

    try {
        const data = await client.fetch(query);

        return data;
    } catch (error) {
        console.error("Error fetching resource counts:", error);
        return null;
    }
}

// ROADMAP ITEMS FROM SANITY
export async function getRoadmapItems() {
    const query = `
        *[_type == 'roadmapitems' ] | order(_createdAt desc) {
            id,
            title,
            description,
            image,
            type,
            status
    }`

    try {
        const roadmapItems = await client.fetch(query);

        return roadmapItems;

    } catch (error) {
        console.error("Error fetching roadmapItems:", error);
        return null;
    }
}

// GET LATEST BLOGS
export async function getLatestBlogs(): Promise<SimpleBlogCard[]> {
    const query = `
    *[_type == "blog"]
      | order(_createdAt desc)
      [0...2] {
        title,
        smallDescription,
        "slug": slug.current,
        titleImage,
        date,
        "author": author->{
          "name": coalesce(name, "Anonymous"),
          picture
        }
      }`;

    try {
        const latestBlogs = await client.fetch(query);

        return latestBlogs;
    } catch (error) {
        console.error("Error fetching latest blogs", error);        
        return [];
    }
}