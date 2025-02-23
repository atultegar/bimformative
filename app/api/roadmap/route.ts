import { client } from "@/app/lib/sanity";
import { NextRequest, NextResponse } from "next/server";

export const GET =  async (req: NextRequest) => {

    // Sanity query for roadmap items
    const query = `
        *[_type == 'roadmapitems' ] | order(_createdAt desc) {
            title,
            description,
            image,
            type,
            status
        }`;

    try{        
        const roadmapItems = await client.fetch(query);

        return NextResponse.json({ 
            roadmapItems
        });
    } catch(error) {
        console.error("Error fetching roadmapItems:", error);        
        return NextResponse.json({
            error: "Failed to fetch roadmapItems.",
        },
        {status : 500}
        );
    }        
}