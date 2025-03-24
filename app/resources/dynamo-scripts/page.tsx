
import { dynamoscript } from "@/app/lib/interface";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import dynamoCover from "@/public/dynamo-cover.png";
import { Metadata } from "next";
import { PageBanner } from "@/app/components/PageBanner";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getAllDynamoScripts } from "@/app/lib/api";

export const revalidate = 30;

export const metadata: Metadata = {
    title : "Dynamo Scripts"
}

export default async function DynamoScriptPage() {
    const data: dynamoscript[] = await getAllDynamoScripts();
    
    return (
        <section className="mt-10 max-w-7xl w-full px-4 md:px-8 mx-auto min-h-[900px]">
            <PageBanner imageSrc={dynamoCover} title="Dynamo Scripts" description="Explore, Enhance, Execute with Dynamo Scripts." />            
            <div className="container max-w-[1280px] mx-auto py-10">
                <DataTable columns={columns} data={data} />
            </div>
        </section>        
    )
}