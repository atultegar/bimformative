import { client } from "@/app/lib/sanity";
import { NextResponse } from "next/server";

export async function GET() {
    const query = `{
    "blogCount": count(*[_type == "blog"]),
    "dynamoScriptCount": count(*[_type == "dynamoscript"]),
    "codeSnippetCount": count(*[_type == "codeSnippet"]),
    }`;

    try {
        const data = await client.fetch(query);
        return NextResponse.json(data);        
    } catch (error) {
        console.error("Error fetching resource counts:", error);
        return NextResponse.json({error: "Failed to fetch resource counts"}, {status: 500});
    }
}