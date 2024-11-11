import { codeSnippet, dynamoscript } from "@/app/lib/interface";
import { client, urlFor } from "../../lib/sanity";
import CodeBlock from "@/app/components/CodeBlock";
import { AlertDialog, AlertDialogContent, AlertDialogDescription } from "@radix-ui/react-alert-dialog";
import { AlertDialogHeader, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

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
        <section className="max-w-7xl w-full px-4 md:px-8 mx-auto">
            <h1>
                <span className="block text-center font-bold text-3xl tracking-wide text-blue-950 dark:text-blue-400">Python Scripts / Code Snippets</span>
            </h1>
            <div>
                {data.map((item, index) => (
                    <div key={index}>
                        {/* <h3>{item.title}</h3>                        
                        <CodeBlock language={item.codeField.language} code={item.codeField.code} /> */}

                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button className="text-lg" variant="link">{item.title}</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader className="flex items-center">
                                    {item.title}
                                </AlertDialogHeader>
                                <AlertDialogDescription>
                                    <CodeBlock language={item.codeField.language} code={item.codeField.code} />
                                </AlertDialogDescription>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                ))}
            </div>
        </section>
    )
}