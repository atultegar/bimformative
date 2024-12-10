import { client } from "@/app/lib/sanity";
import { NextRequest, NextResponse } from "next/server";

export const GET =  async (req: NextRequest) => {
    const searchParams = req.nextUrl.searchParams
    const search = searchParams.get("search") || "";
    const tag = searchParams.get("tag") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Sanity query for blogs with search filter and pagination
    const query = `
        *[_type == 'blog' && (title match $search || smallDescription match $search) && ($tag == "" || $tag in tags[]->slug.current)] | order(_createdAt desc) [${offset}...${offset + limit}] {
            title,
            smallDescription,
            "currentSlug": slug.current,
            titleImage,
            date,
            "author": author->{"name": coalesce(name, "Anonymous"), picture},
            "tags": coalesce(tags, ["Untagged"]),
        }`;
    
    const countQuery = `
        count(*[_type == 'blog' && (title match $search || smallDescription match $search) && ($tag == "" || $tag in tags[]->slug.current)])`;

    try{
        const blogs = await client.fetch(query, {search: `${search}*`, tag});
        const totalCount = await client.fetch(countQuery, {search: `${search}*`, tag});

        return NextResponse.json({ 
            blogs, 
            totalCount, 
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit), 
        });
    } catch(error) {
        console.error("Error fetching blogs:", error);        
        return NextResponse.json({
            error: "Failed to fetch blogs.",
        },
        {status : 500}
        );
    }        
}