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


async function getData() {
    const query = `
  *[_type == 'dynamoscript'] | order(_createdAt desc) {
  title,
    scriptfile,
    description,
    tags,
    "fileUrl": scriptfile.asset->url,
    youtubelink,
    "scripttype": scripttype[]->name,
    dynamoplayer,
    externalpackages,
    pythonscripts,
  }`;

  const data = await client.fetch(query);

  return data;
}

export default async function DynamoScriptPage() {
    const data: dynamoscript[] = await getData();
    return (
        <section className="mt-10 max-w-7xl w-full px-4 md:px-8 mx-auto min-h-[900px]">
            <div className="relative text-left h-[300px] bg-gray-100 dark:bg-black">
                <Image src={dynamoCover} alt="Dynamo Cover" className="d-block h-[300px] object-cover" />
                <h1 className="absolute top-0 left-0 mt-10 text-4xl lg:text-6xl font-semibold text-black dark:text-white mx-10 max-w-xl">
                    Dynamo Scripts
                </h1>
                <p className="absolute top-20 left-11 mt-40 max-w-md text-gray-900 dark:text-gray-400">
                    Explore, Enhance, Execute with Dynamo Scripts.
                </p>
            </div>
            <hr className="h-px bg-gray-300 border-0 dark:bg-gray-800"></hr>
            
            <div className="container mx-auto py-10">
                <DataTable columns={columns} data={data} />
            </div>
        </section>
        
    )
}