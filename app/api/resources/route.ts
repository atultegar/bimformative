import { client } from "@/app/lib/sanity";
import { NextRequest, NextResponse } from "next/server";

export const GET =  async (req: NextRequest) => {
    const searchParams = req.nextUrl.searchParams
    const search = searchParams.get("query") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    if (!search || typeof search !== "string") {
        return NextResponse.json({
            error: "Query parameter is required."
        },
        { status: 400 }
        );
    }

    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Sanity query for blogs with search filter and pagination
    const query = `
        {
            "blogs": *[_type == 'blog' && (title match $search)] | order(_createdAt desc) [${offset}...${offset + limit}] {
            _type, title, smallDescription, "currentSlug": slug.current,"tags": tags[]->name, _id
            },
            "dynamoscripts": *[_type == 'dynamoscript' && (title match $search)] | order(_createdAt desc) [${offset}...${offset + limit}] {
            _type, title, "tags": tags, _id
            },
        }
        `;   
    

    try{
        const queryParams = {
            search: `${search}*`,
        };
        const result = await client.fetch(query, queryParams);

        return NextResponse.json({ 
            result 
        });
    } catch(error) {
        console.error("Error fetching search results:", error);        
        return NextResponse.json({
            error: "Failed to fetch search results:",
        },
        {status : 500}
        );
    }        
}