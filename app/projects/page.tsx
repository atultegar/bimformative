import Image from "next/image";
import { ProjectsCard } from "../lib/interface";
import { client, urlFor } from "../lib/sanity";
import { Metadata } from "next";
import { PageBanner } from "../components/PageBanner";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FaGithub} from "react-icons/fa";

export const metadata: Metadata = {
    title : "Projects"
}

async function getData() {
    const query = `*[_type == 'project'] {
        title,
          _id,
          link,
          description,
          tags,
          "imageUrl": image.asset->url
    }`;

    const data = await client.fetch(query);

    return data
}

export default async function ProjectsPage() {
    const data: ProjectsCard[] = await getData();
    return (
        <section className="mt-10 max-w-7xl w-full px-4 md:px-8 mx-auto min-h-[900px]">
            <PageBanner title="Projects" description="Check out what projects I have created" />            
            <div className="mt-10 mb-16">
                {data.map((item, idx) => (
                    <div key={idx}>
                        <Card className="bg-gray-100 dark:bg-black mb-10">
                            <CardContent className="w-full p-10 grid grid-cols-1 md:grid-cols-2 mx-auto gap-4">
                                { idx % 2 === 0 ? (
                                    <>
                                    <Link href={item.link}>
                                        <div className="md:col-start-2 col-start-1 mt-10 md:mt-0 d-block w-full h-[200px] md:h-[300px] border border-gray-300 dark:border-stone-900 drop-shadow-sm bg-white content-center">
                                            <Image src={item.imageUrl} alt="image" fill={true} className="mx-auto w-auto h-auto object-contain hover:opacity-50" />
                                        </div>
                                    </Link>
                                    <div className="flex flex-col h-[300px] justify-center items-end gap-14">
                                        <Link href={item.link}>
                                        <div className="font-bold text-3xl md:w-[400px] w-[300px] hover:underline text-right">
                                            {item.title}
                                        </div>
                                        </Link>
                                        <div className="md:w-[400px] w-[300px] text-right">
                                            {item.description}
                                        </div>
                                        <Button className="w-40" asChild>
                                            <Link href={item.link} className="hover:underline">
                                                <FaGithub /> Repository
                                            </Link>
                                        </Button>
                                    </div>
                                    
                                    </>
                                ) : (
                                    <>
                                    <div className="flex flex-col h-[300px] justify-center gap-14">
                                        <Link href={item.link}>
                                        <div className="font-bold text-3xl md:w-[400px] w-[300px] hover:underline">
                                            {item.title}
                                        </div>
                                        </Link>
                                        <div className="md:w-[400px] w-[300px]">
                                            {item.description}
                                        </div>
                                        <Button className="w-40" asChild>
                                            <Link href={item.link} className="hover:underline">
                                                <FaGithub /> Repository
                                            </Link>
                                        </Button>
                                    </div>
                                    <Link href={item.link}>
                                        <div className="md:col-start-2 col-start-1 mt-10 md:mt-0 d-block w-full h-[200px] md:h-[300px] border border-gray-300 dark:border-stone-900 drop-shadow-sm bg-white content-center">
                                            <Image src={item.imageUrl} alt="image" fill={true} className="mx-auto w-auto h-auto object-contain hover:opacity-50" />
                                        </div>
                                    </Link>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                    
                ))}
            </div>
        </section>
        
    )
}