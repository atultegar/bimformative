import { User } from "@/app/lib/interface";
import { client } from "@/app/lib/sanity";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    const query = `*[_type == "author"]`;

    try {
        const users = await client.fetch(query);
        return NextResponse.json(users);        
    } catch (error) {
        console.error("Error fetching users", error);
        return NextResponse.json({error: "Failed to fetch users"}, {status: 500});
    }
}

export async function POST (request: Request) {
    try{
        const req = await request.json();    
        const doc = {
            _type: "author",
            _id: req.id,
            id: req.id,
            givenName: req.givenName,
            familyName: req.familyName,
            email: req.Email
        };

        await client.createIfNotExists(doc);

        return NextResponse.json({message: "User created successfully"}, {status: 201});

    } catch (error) {
        return NextResponse.json({error: "Failed to create user"}, {status: 500});
    }
}