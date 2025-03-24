import { client } from "@/app/lib/sanity";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

const LOGIN_REDIRECT_URL = process.env.KINDE_POST_LOGIN_REDIRECT_URL;

export async function GET(req: NextRequest) {
    const searchParams = new URL(req.url).searchParams;
    const scriptId = searchParams.get("scriptid");    

    if (!scriptId) {
        return NextResponse.json({success: false, message: "Script Id is required"}, {status: 400});        
    }

    // Get authentication session
    const session = getKindeServerSession();
    const isAuthenticated = await session.isAuthenticated();

    if(!isAuthenticated){
        return redirect(`/api/auth/login`)
    }

    const query = `*[_type == "dynamoscript" && _id == "${scriptId}"][0] {
    downloads,
    "fileUrl": scriptfile.asset->url,
    }`;
    const script = await client.fetch(query);

    if(!script) {
        return NextResponse.json({ success: false, message: "Script not found" }, { status: 404 });
    }
    
    const downloadUrl = script.fileUrl+"?dl"

    // Increment download count
    const newDownloadCount = (script.downloads || 0) + 1;

    await client.patch(scriptId).set({downloads: newDownloadCount}).commit();
    

    return NextResponse.redirect(downloadUrl);
}