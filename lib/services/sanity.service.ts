import { FullBlog, SanitySearchParams, SanitySearchResult, SimpleBlogCard } from "@/app/lib/interface";
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

// GET ALL BLOGS
export async function getBlogs(onlyFeatured: boolean = false): Promise<SimpleBlogCard[]> {
    const query = `
    *[_type == "blog" ${onlyFeatured ? "&& featured == true": ""}]
    | order(_createdAt desc)
    {
        title,
        smallDescription,
        "slug": slug.current,
        titleImage,
        date,
        "author": author->{
        "name": coalesce(givenName+" "+familyName, "Anonymous"),
        pictureurl
        },
        "tags": coalesce(tags[]->name, ["Untagged"]),
        featured,
      }`;

    try {
        const blogs = await client.fetch(query);

        return blogs;
    } catch (error) {
        console.error("Error fetching blogs", error);        
        return [];
    }    
}

// GET BLOG BY SLUG
export async function getBlogBySlug(slug: string) {
    const query = `
    *[_type == "blog" && slug.current == '${slug}']
    {
        title,
        smallDescription,
        "slug": slug.current,
        titleImage,
        date,
        "author": author->{
        "name": coalesce(givenName+" "+familyName, "Anonymous"),
        pictureurl
        },
        "tags": coalesce(tags[]->name, ["Untagged"]),
        content,
      }`;

      try {
        const blog = await client.fetch(query);

        return blog[0];
      } catch (err: any) {
        throw new Error("Error fetching blog", err);        
      }
}

// GET ALL TAGS
export async function getAllTags() {
    const query = `
        *[_type == "tag"] {
        name,
        slug,
        _id,
        "postCount": count(*[_type == "blog" && references("tags", ^._id)])
        }
    `;

    const tags = await client.fetch(query);

    // Prepend the "All" tag to the array
    const allTags = [
        {
            name: "All",
            slug: "/blog",
            _id: "all",
            postCount: tags.reduce((total: number, tag: {postCount: number}) => total + tags.postCount, 0),
        },
        ...tags.map((t: { name: string; slug: {current: string}; _id: string; postCount: number}) => ({
            ...t,
            slug: `/blog/tag/${t.slug.current}`,
        })),
    ];

    return allTags;
}

// SEARCH RESOURCES
export async function searchResources({
    search,
    page = 1,
    limit = 10,
}: SanitySearchParams): Promise<SanitySearchResult> {
    if (!search || typeof search !== "string") {
        throw new Error("SEARCH_QUERY_REQUIRED");
    }

    const offset = (page - 1) * limit;

    const baseQuery = `
    [
        ...*[
        _type == "blog" &&
        (title match $search || tags[]->name match $search)
        ] | order(_createdAt desc) {
        _type,
        _id,
        title,
        smallDescription,
        "slug": slug.current,
        titleImage,
        date,
        featured,
        "author": author->{
            "name": coalesce(name, "Anonymous"),
            picture
        },
        "tags": tags[]->name
        },
        
        ...*[
        _type == "codeSnippet" &&
        title match $search
        ] | order(_createdAt desc) {
        _type,
        _id,
        title,
        codeField
        },

        ...*[
        _type == "videoTutorial" &&
        name match $search
        ] | order(_createdAt desc) {
        _type,
        _id,
        name,
        description,
        "youtube": url.id
        },

        ...*[
        _type == "otherassets" &&
        (title match $search || tags match $search)
        ] | order(_createdAt desc) {
        _type,
        _id,
        title,
        description,
        tags,
        assettype,
        youtubelink,
        "image": image.asset->url,
        "fileUrl": file.asset->url
        },

        ...*[
        _type == "docs" &&
        (name match $search || tags match $search)
        ] | order(_createdAt desc) {
        _type,
        _id,
        name,
        description,
        url,
        tags,
        "imageUrl": image.asset->url
        }
    ]
    `;

    const pagedQuery = `${baseQuery}[${offset}...${offset + limit}]`;
    const countQuery = `count(${baseQuery})`;

    const params = {
        search: `${search}*`,
    };

    try {
        const [results, total] = await Promise.all([
            client.fetch(pagedQuery, params),
            client.fetch(countQuery, params),
        ]);

        return {
            results,
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        };
    } catch (err) {
        console.error("Sanity search failed:", err);
        throw new Error("SANITY_SEARCH_FAILED");
    }
}