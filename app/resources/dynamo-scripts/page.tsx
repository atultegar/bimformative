import { dynamoscript } from "@/app/lib/interface";
import { client, urlFor } from "../../lib/sanity";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import DownloadButton from "@/app/components/DownloadButton";
import YouTubeButton from "@/app/components/YouTubeButton";
import Image from "next/image";
import Dynamo from "../../../public/tech-icons/dynamo.png";


async function getData() {
    const query = `
  *[_type == 'dynamoscript'] | order(_createdAt desc) {
  title,
    scriptfile,
    description,
    tags,
    "fileUrl": scriptfile.asset->url,
    youtubelink
  }`;

  const data = await client.fetch(query);

  return data;
}

export default async function DynamoScriptPage() {
    const data: dynamoscript[] = await getData();
    return (
        <section className="max-w-7xl w-full px-4 md:px-8 mx-auto">
            <h1>
                <span className="block text-center font-bold text-3xl tracking-wide text-blue-950 dark:text-blue-400">Dynamo Scripts</span>
            </h1>
            <div className="mt-5">
                {data.map((item, index)=> ( 
                    <article key={index}>
                        <AlertDialog key={index}>
                        <AlertDialogTrigger asChild>
                            <Button className="text-lg" variant="link">{item.title}</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle className="flex items-center">
                                    <Image src={Dynamo} alt="Dynamo" className="w-8 h-8" />
                                    {item.title}
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    {item.description}
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <YouTubeButton videoUrl={item.youtubelink} />
                                <DownloadButton fileUrl={item.fileUrl} />                                
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    </article>
                ))}
            </div>
        </section>
    )
}