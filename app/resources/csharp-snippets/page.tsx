import { codeSnippet, dynamoscript } from "@/app/lib/interface";
import { client, urlFor } from "../../lib/sanity";
import CodeBlock from "@/app/components/CodeBlock";

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
        <section className="max-w-7xl w-full px-4 md:px-8 mx-auto">
            <h1>
                <span className="block text-center font-bold text-3xl tracking-wide text-blue-950 dark:text-blue-400">C# Code Snippets</span>
            </h1>
            <div>
                {data.map((item, index) => (
                    <div key={index}>
                        <h3>{item.title}</h3>
                        
                        <CodeBlock language="c#" code={item.codeField.code} />
                    </div>
                ))}
            </div>
        </section>
    )
}