import { codeSnippet, dynamoscript } from "@/app/lib/interface";
import { client, urlFor } from "@/app/lib/sanity";
import CodeBlock from "@/app/components/CodeBlock";
import csharpCover from "@/public/csharp-cover.png";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Metadata } from "next";
import { PageBanner } from "@/app/components/PageBanner";

export const metadata: Metadata = {
    title : "CSharp Snippets"
}

async function getData() {
    const query = `
  *[_type == 'codeSnippet' && codeField.language == 'csharp'] | order(_createdAt desc) {
  title,
  codeField,
  }`;

  const data = await client.fetch(query);

  return data;
}

export default async function CsharpPage() {
    const data: codeSnippet[] = await getData();
    return (
        <section className="mt-10 max-w-7xl w-full px-4 md:px-8 mx-auto min-h-[900px]">
            <PageBanner imageSrc={csharpCover} title="C# Code Snippets" description="Designed to simplify development and enhance productivity." />
            <div className="mt-10 mb-16 grid grid-cols-1 gap-y-10 md:grid-cols-3 md:gap-x-16 md:gap-y-10 lg:gap-x-10 content-center">
                {data.map((item, index) => (
                    <article key={index}>
                        <Dialog>
                            <DialogTrigger asChild>
                                <div className="group relative mx-auto">                                    
                                    <div className="d-block w-full h-[75px] ring-1 ring-gray-900/5 border border-gray-300 dark:border-stone-900 drop-shadow-sm bg-white dark:bg-stone-950 content-center rounded-lg hover:bg-gray-100 cursor-pointer hover:text-primary">
                                        <h3 className="text-balance text-lg ml-5 font-semibold leading-snug">
                                            {item.title}
                                        </h3>
                                    </div>
                                </div>
                                
                            </DialogTrigger>
                            <DialogContent className="max-w-6xl">
                                <DialogHeader>
                                    <DialogTitle>{item.title}</DialogTitle>
                                    <DialogDescription className="mt-2">
                                        <CodeBlock language={item.codeField.language} code={item.codeField.code} />
                                    </DialogDescription>                                    
                                </DialogHeader>
                            </DialogContent>                            
                        </Dialog>
                    </article>
                ))}
            </div>
        </section>
    )
}