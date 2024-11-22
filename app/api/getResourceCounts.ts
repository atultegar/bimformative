import { client, urlFor } from "@/app/lib/sanity";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        return res.status(405).json({message: "Method not allowed"});
    }

    const query = `{
    "blogCount": count(*[_type == "blog"]),
    "dynamoScriptCount": count(*[_type == "dynamoscript"]),
    "codeSnippetsCount": count(*[_type == "codeSnippet"]),
    }`;

    try {
        const data = await client.fetch(query);
        res.status(200).json(data);
    } catch (error) {
        console.error("Error fetching resource counts:", error);
        res.status(500).json({error: "Failed to fetch resource counts"});
    }    
}