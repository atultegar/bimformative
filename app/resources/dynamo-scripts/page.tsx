import { dynamoscript } from "@/app/lib/interface";
import { client, urlFor } from "@/app/lib/sanity";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import DownloadButton from "@/app/components/DownloadButton";
import YouTubeButton from "@/app/components/YouTubeButton";
import Image from "next/image";
import Dynamo from "@/public/tech-icons/dynamo.png";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import dynamoCover from "@/public/dynamo-cover.png";
import { Metadata } from "next";
import { PageBanner } from "@/app/components/PageBanner";

export const revalidate = 30;  //revalidate at most 30 seconds

export const metadata: Metadata = {
    title : "Dynamo Scripts"
}

async function getData() {
    const query = `
  *[_type == 'dynamoscript'] | order(_createdAt desc) {
  title,
    scriptfile,
    description,
    tags,
    "fileUrl": scriptfile.asset->url,
    youtubelink,
    "scripttype": scripttype->name,
    dynamoplayer,
    externalpackages,
    pythonscripts,
    "image": image.asset->url,
    "code": scriptView.code
  }`;

  const data = await client.fetch(query);

  return data;
}

export default async function DynamoScriptPage() {
    const data: dynamoscript[] = await getData();
    return (
        <section className="mt-10 max-w-7xl w-full px-4 md:px-8 mx-auto min-h-[900px]">
            <PageBanner imageSrc={dynamoCover} title="Dynamo Scripts" description="Explore, Enhance, Execute with Dynamo Scripts." />            
            <div className="container max-w-[1280px] mx-auto py-10">
                <DataTable columns={columns} data={data} />
            </div>
        </section>        
    )
}