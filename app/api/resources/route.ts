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

    // Sanity query for resources with search filter and pagination
    const query = `
        [
            ...*[_type == 'blog' && (title match $search || tags[]->name match $search)] | order(_createdAt desc) {_type, title, smallDescription, "currentSlug": slug.current, titleImage, date, featured, "author": author->{"name": coalesce(name, "Anonymous"), picture}, "tags": tags[]->name, _id},
            ...*[_type == 'dynamoscript' && (title match $search || tags match $search)] | order(_createdAt desc) {_type, title, scriptfile, description, tags, "fileUrl": scriptfile.asset->url, youtubelink, "scripttype":scripttype->name, dynamoplayer, externalpackages, pythonscripts, "image":image.asset->url, _id},
            ...*[_type == 'codeSnippet' && (title match $search)] | order(_createdAt desc) {_type, title, codeField, _id},
            ...*[_type == 'videoTutorial' && (name match $search)] | order(_createdAt desc) {_type, name, description, "youtube":url.id, _id},
            ...*[_type == 'otherassets' && (title match $search || tags match $search)] | order(_createdAt desc) {_type, file, title, description, "image": image.asset->url, assettype, youtubelink, tags, "fileUrl": file.asset->url, _id},
            ...*[_type == 'docs' && (name match $search || tags match $search)] | order(_createdAt desc) {_type, name, description, url, "imageUrl": image.asset->url, tags, _id},
        ]`;

    const searchQuery = `${query}[${offset}...${offset + limit}]`;
    
    const countQuery = `count(${query})`;
    

    try{
        const queryParams = {
            search: `${search}*`,
        };
        const result = await client.fetch(searchQuery, queryParams);
        const totalCount = await client.fetch(countQuery, queryParams);

        return NextResponse.json({ 
            totalCount,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
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