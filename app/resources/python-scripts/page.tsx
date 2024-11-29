import { codeSnippet, dynamoscript } from "@/app/lib/interface";
import { client, urlFor } from "../../lib/sanity";
import CodeBlock from "@/app/components/CodeBlock";
import { AlertDialog, AlertDialogContent, AlertDialogDescription } from "@radix-ui/react-alert-dialog";
import { AlertDialogHeader, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import pythonCover from "@/public/python-cover.png";
import Image from "next/image";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Metadata } from "next";
import { PageBanner } from "@/app/components/PageBanner";

export const metadata: Metadata = {
    title : "Python Scripts"
}

async function getData() {
    const query = `
  *[_type == 'codeSnippet' && codeField.language == 'python'] | order(_createdAt desc) {
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
            <PageBanner imageSrc={pythonCover} title="Python Scripts" description="Crafted to automate tasks, enhance workflows, and unlock new possibilities." />
            <div className="mt-10 mb-16 grid grid-cols-1 gap-y-10 md:grid-cols-3 md:gap-x-16 md:gap-y-10 lg:gap-x-10 content-center">
                {data.map((item, index) => (
                    <article key={index}>
                        <Dialog>
                            <DialogTrigger asChild>
                                <div className="d-block w-full h-[75px] border border-gray-300 dark:border-stone-900 drop-shadow-sm bg:white content-center rounded-lg hover:bg-gray-100 dark:hover:bg-stone-800 cursor-pointer hover:text-primary">
                                    <h3 className="text-balance text-lg ml-5 font-semibold leading-snug">
                                        {item.title}
                                    </h3>
                                </div>
                            </DialogTrigger>
                            <DialogContent className="max-w-5xl">
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