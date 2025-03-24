import { client } from "@/app/lib/sanity";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";

const REDIRECT_URL = process.env.LOCAL_LOGIN_REDIRECT_URL;

export async function GET() {
    try{
        const {getUser} = getKindeServerSession();
        const user = await getUser();

        if (!user || !user.id) {
            return NextResponse.json({success: false, message: "Unauthorized"}, {status: 401 });
        }

        const userId = user.id;
        console.log("userId:", userId);

        const query = `*[_type == "author" && _id == "${userId}"]`;

        let author = await client.fetch(query);

        if(!author.length) {
            const doc = {
                _type: "author",
                _id: user.id,
                id: user.id,
                givenName: user.given_name,
                familyName: user.family_name,
                email: user.email
            };
            author = await client.create(doc);
            console.log("New author created:", author);
        }

        console.log(author);
        return NextResponse.redirect(`${REDIRECT_URL}`, 302);

    } catch (error){
        console.error("Error:", error);
        return NextResponse.json({success: false, message: "Internal Server Error", error: error}, {status: 500 })
    }    
}