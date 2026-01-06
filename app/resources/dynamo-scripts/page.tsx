
import dynamoCover from "@/public/dynamo-cover.png";
import { Metadata } from "next";
import { PageBanner } from "@/app/components/PageBanner";
import { auth } from "@clerk/nextjs/server";
import { ClientDataTable } from "./data-table-wrapper";
import { getPublicScriptsPaged, scriptsLikedByUserId } from "@/lib/services/scripts.service";

const DEV_BYPASS = process.env.NODE_ENV === "development";
const DEV_USER_ID = process.env.DEV_FAKE_USER_ID ?? "dev-user";

export const revalidate = 30;

interface ScriptsPageProps {
    searchParams: Promise<{
        page?: string;
        limit?: string;
        search?: string;
        type?: string;
    }>; 
}

export const metadata: Metadata = {
    title : "Dynamo Scripts"
}

async function getCurrentUserId(): Promise<string | null> {    
    const { userId } = await auth();

    if (userId && DEV_BYPASS) {
        return DEV_USER_ID;
    }
    
    return userId ?? null;
}

export default async function DynamoScriptPage({
    searchParams,
}: ScriptsPageProps) {
    const params = await searchParams;
    const page = Number(params?.page ?? 1);
    const limit = Number(params?.limit ?? 10);
    const search = params?.search ?? "";
    const type = params?.type ?? "";

    const currentUserId = await getCurrentUserId();
   
    const result = await getPublicScriptsPaged(        
        { search, type },
        { page, limit }
    )

    // Only fetch likes if logged in
    const likedSet = new Set<string>();

    if (currentUserId) {
        const likesRes = await scriptsLikedByUserId(currentUserId);
        likesRes.forEach(l => likedSet.add(l.script_id));
    }

    const scriptData = result.data.map(s => ({
        ...s,
        liked_by_user: currentUserId ? likedSet.has(s.id) : false,
    }));
    
    return (
        <section className="mt-10 max-w-7xl w-full px-4 md:px-8 mx-auto min-h-[900px]">
            <PageBanner imageSrc={dynamoCover} title="Dynamo Scripts" description="Explore, Enhance, Execute with Dynamo Scripts." />            
            <div className="container max-w-[1280px] mx-auto py-10">
                <ClientDataTable
                    data={scriptData}
                    page={result.page}
                    limit={result.limit}
                    total={result.total}
                    currentUserId={currentUserId} />
            </div>
        </section>        
    );
}