import { codeSnippet } from "@/app/lib/interface";
import { client } from "@/app/lib/sanity";
import CodeBlock from "@/app/components/CodeBlock";
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
        <section className="mx-auto w-full max-w-7xl px-4 md:px-8">
            <PageBanner title="C# Code Snippets" description="Designed to simplify development and enhance productivity." variant="csharp" />
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
                            <DialogContent className="max-w-5xl bg-transparent border-none">
                                <DialogHeader>
                                    <DialogTitle></DialogTitle>
                                    <DialogDescription className="mt-2">
                                        <CodeBlock language={item.codeField.language} code={item.codeField.code} title={item.title} />
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